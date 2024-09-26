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

/* Email hooks */

onRecordAfterCreateRequest((e) => {
    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);
    /** @type {AuditLogUtils} */
    const { auditLogger } = require(`${__hooks}/audit-logs.utils.js`);

    if (!e.record) throw utils.createMissingDataError("orgJoinRequest");

    try {
        const organization = utils.getExpanded(e.record, "organization");
        if (!organization)
            throw utils.createMissingDataError(
                "organization of orgJoinRequest"
            );
        $app.settings().meta.appUrl;

        const basePath = $app.isDebug()
            ? "http://localhost:5173/"
            : "https://beta.signroom.io/";

        const organizationId = organization.getId();
        const organizationName = organization.get("name");
        const acceptanceLink = `<a href="${basePath}my/organizations/${organizationId}/members">Manage organization pending requestes</a>`;

        const recipients = $app
            .dao()
            .findRecordsByFilter(
                "orgAuthorizations",
                `organization.id = "${organizationId}" && ( role.name = "admin" || role.name = "owner" )`
            );
        $app.dao().expandRecords(recipients, ["user"], undefined);

        /**
         * @type {mail.Address[]}
         */
        const recipientsAddresses = recipients
            .map((r) => r.expandedOne("user").get("email"))
            .map((e) => ({ address: e }));

        const message = new MailerMessage({
            from: {
                address: $app.settings().meta.senderAddress,
                name: $app.settings().meta.senderName,
            },
            to: recipientsAddresses,
            subject: `${organizationName} | New join request`,
            html: `Your organization receved a new join request 
            <br />
            ${acceptanceLink}`,
        });
        console.log(message.html);

        $app.newMailClient().send(message);
    } catch (e) {
        console.log(e);
        console.log(JSON.stringify(e));
    }
}, "orgJoinRequests");

onRecordAfterUpdateRequest((e) => {
    try {
        console.log("Hook - orgJoinRequests - Sending email to user");

        const USER_KEY = "user";
        const ORGANIZATION_KEY = "organization";

        const status = e.record.get("status");
        if (status == "pending") return;

        $app.dao().expandRecord(e.record, [USER_KEY, ORGANIZATION_KEY]);

        const userEmail = e.record.expandedOne(USER_KEY).get("email");
        /** @type {mail.Address} */
        const userAddress = { address: userEmail };

        const organizationName = e.record
            .expandedOne(ORGANIZATION_KEY)
            .get("name");

        /**
         * @typedef {Object} EmailContent
         * @property {string} subject
         * @property {string} html
         */

        /** @type {EmailContent} */
        const successEmail = {
            subject: `${organizationName} | Request accepted`,
            html: `Welcome to ${organizationName}! Your request has been accepted!`,
        };
        /** @type {EmailContent} */
        const rejectEmail = {
            subject: `${organizationName} | Request declined`,
            html: "Your join request has been declined.",
        };

        const message = new MailerMessage({
            from: {
                address: $app.settings().meta.senderAddress,
                name: $app.settings().meta.senderName,
            },
            to: [userAddress],
            ...(status == "accepted" ? successEmail : rejectEmail),
        });

        $app.newMailClient().send(message);

        // Deleting orgJoinRequest record once all has been done
        $app.dao().deleteRecord(e.record);
    } catch (e) {
        console.log(e);
        console.log(JSON.stringify(e));
    }
}, "orgJoinRequests");
