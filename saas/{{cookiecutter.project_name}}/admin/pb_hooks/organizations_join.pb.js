// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

// @ts-check

/// <reference path="../pb_data/types.d.ts" />
/** @typedef {import('./utils.js')} Utils */
/** @typedef {import('./audit-logs.utils.js')} AuditLogUtils */

/**
 * INDEX
 * - Base hooks
 * - Email hooks
 */

/* Base hooks */

onRecordBeforeCreateRequest((e) => {
    e.record?.set("status", "pending");
    e.record?.set("reminders", 0);
}, "orgJoinRequests");

onRecordBeforeCreateRequest((e) => {
    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);

    /** @type {string | undefined} */
    const organizationId = e.record?.get("organization");
    /** @type {string | undefined} */
    const userId = e.record?.get("user");

    const authorization = utils.findFirstRecordByFilter(
        "orgAuthorizations",
        `organization.id = "${organizationId}" && user.id = "${userId}"`
    );

    if (authorization)
        throw new BadRequestError(utils.errors.user_is_already_member);
}, "orgJoinRequests");

// onRecordAfterUpdateRequest(e => {
//     const organizationId = e.record?.get("organization")
// }, "orgAuthorizations")

/* Email hooks - Notifications to Admins */

onRecordAfterCreateRequest((e) => {
    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);

    if (!e.record) throw utils.createMissingDataError("orgJoinRequest");

    const organization = utils.getExpanded(e.record, "organization");
    if (!organization)
        throw utils.createMissingDataError("organization of orgJoinRequest");

    const organizationId = organization.getId();
    const organizationName = organization.get("name");
    const membersUrl = utils.getOrganizationMembersPageUrl(organizationId);
    const a = `<a href="${membersUrl}">Manage organization join requests</a>`;

    const recipients = utils.getOrganizationAdminsAddresses(organizationId);

    const res = utils.sendEmail({
        to: recipients,
        subject: `${organizationName} | New join request`,
        html: `Your organization receved a new join request<br />${a}`,
    });
    if (res instanceof Error) {
        console.error("Email send error");
    }
}, "orgJoinRequests");

cronAdd("remind admins about join requests", "0 9 * * 1", () => {
    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);

    const organizations = utils.findRecordsByFilter(
        "organizations",
        "id != null"
    );

    organizations
        .map((organization) => ({
            organization,
            requests: utils
                .findRecordsByFilter(
                    "orgJoinRequests",
                    `organization.id = "${organization.getId()}"`
                )
                .filter((r) => r.get("status") == "pending"),
        }))
        .filter(({ requests }) => requests.length > 0)
        .forEach(({ organization, requests }) => {
            const organizationId = organization.getId();
            const organizationName = organization.get("name");
            const recipients =
                utils.getOrganizationAdminsAddresses(organizationId);
            const membersUrl =
                utils.getOrganizationMembersPageUrl(organizationId);
            const a = `<a href="${membersUrl}">Manage membership requests</a>`;

            const res = utils.sendEmail({
                to: recipients,
                subject: `${organizationName} | Pending membership requests`,
                html: `Your organization has ${requests.length} pending membership requests<br />${a}`,
            });
            if (res instanceof Error) {
                console.error("Email send error");
            }
        });
});

/* Email hooks - Notifications to Users */

onRecordAfterUpdateRequest((e) => {
    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);

    if (!e.record) throw utils.createMissingDataError("orgJoinRequest");

    /** @type {string} */
    const status = e.record.get("status");

    const isRelevantChange = status == "accepted" || status == "rejected";
    if (!isRelevantChange) return;

    const organization = utils.getExpanded(e.record, "organization");
    if (!organization)
        throw utils.createMissingDataError("organization of orgJoinRequest");
    const user = utils.getExpanded(e.record, "user");
    if (!user) throw utils.createMissingDataError("user of orgJoinRequest");

    /** @type {string} */
    const organizationName = organization.get("name");
    const userAddress = utils.getUserEmailAddressData(user);

    /**
     * @typedef {Object} EmailContent
     * @property {string} subject
     * @property {string} html
     */

    /** @type {EmailContent} */
    const successEmail = {
        subject: `${organizationName} | Membership request accepted`,
        html: `Welcome to ${organizationName}! Your request has been accepted!`,
    };
    /** @type {EmailContent} */
    const rejectEmail = {
        subject: `${organizationName} | Membership request declined`,
        html: "Your join request has been declined.",
    };

    const emailContent = status == "accepted" ? successEmail : rejectEmail;
    utils.sendEmail({ to: [userAddress], ...emailContent });

    $app.dao().deleteRecord(e.record);
}, "orgJoinRequests");
