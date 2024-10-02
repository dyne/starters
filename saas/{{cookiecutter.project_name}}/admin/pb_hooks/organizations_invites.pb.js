// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

// @ts-check

/// <reference path="../pb_data/types.d.ts" />
/** @typedef {import('./utils.js')} Utils */
/** @typedef {import('./auditLogger.js')} AuditLogger */

routerAdd("POST", "/organizations/invites/accept", (c) => {
    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);
    /** @type {AuditLogger} */
    const auditLogger = require(`${__hooks}/auditLogger.js`);

    /* -- Guards -- */

    const { invite, userId } = utils.runOrganizationInviteEndpointChecks(c);

    /* -- Logic -- */

    const orgAuthorizationsCollection = $app
        .dao()
        .findCollectionByNameOrId("orgAuthorizations");

    const organizationId = invite.get("organization");

    const authorization = new Record(orgAuthorizationsCollection);
    authorization.set("user", userId);
    authorization.set("role", utils.getRoleByName("member")?.getId());
    authorization.set("organization", organizationId);

    $app.dao().saveRecord(authorization);
    $app.dao().deleteRecord(invite);

    auditLogger(c).info(
        "user_accepted_invite",
        "organizationId",
        organizationId
    );
});

routerAdd("POST", "/organizations/invites/decline", (c) => {
    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);
    /** @type {AuditLogger} */
    const auditLogger = require(`${__hooks}/auditLogger.js`);

    const { invite } = utils.runOrganizationInviteEndpointChecks(c);

    invite.markAsNotNew();
    invite.set("declined", true);
    $app.dao().saveRecord(invite);

    auditLogger(c).info(
        "user_accepted_invite",
        "organizationId",
        invite.get("organization")
    );
});

//

routerAdd("POST", "/organizations/invite", (c) => {
    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);
    /** @type {AuditLogger} */
    const auditLogger = require(`${__hooks}/auditLogger.js`);

    /* -- Guards -- */

    /** @type {{organizationId: string | undefined, emails: string[] | undefined}} */
    // @ts-ignore
    const data = $apis.requestInfo(c).data;
    const { emails, organizationId } = data;
    if (!organizationId || !emails)
        throw utils.createMissingDataError("organizationId", "emails");

    const userId = utils.getUserFromContext(c)?.getId();
    if (!userId) throw utils.createMissingDataError("userId");

    const role = utils.getUserRole(userId, organizationId);
    const roleName = role?.get("name");
    if (roleName != "admin" && roleName != "owner")
        throw new UnauthorizedError();

    /* -- Logic -- */

    const orgInvitesCollection = $app
        .dao()
        .findCollectionByNameOrId("org_invites");

    const organization = $app
        .dao()
        .findRecordById("organizations", organizationId);
    const organizationName = organization.get("name");

    for (const email of emails) {
        // Checking if user is already member

        const user = utils.findFirstRecordByFilter(
            "users",
            `email = "${email}"`
        );
        if (user) {
            const userRole = utils.getUserRole(user.getId(), organizationId);
            if (userRole) continue;
        }

        // Checking if invite already exists

        const invite = utils.findFirstRecordByFilter(
            "org_invites",
            `user_email = "${email}"`
        );
        if (invite) continue;

        // Otherwise, create invite

        const record = new Record(orgInvitesCollection);
        record.set("organization", organizationId);
        record.set("user_email", email);
        if (user) record.set("user", user.getId());

        $app.dao().saveRecord(record);

        const organizationsUrl = `${utils.getAppUrl()}/my/organizations`;
        const a = `<a href="${organizationsUrl}">Manage your invitation</a>`;

        const err = utils.sendEmail({
            to: { address: email, name: "" },
            subject: `You have been invited to join ${organizationName}`,
            html: a,
        });

        if (!err) {
            auditLogger(c).info(
                "invited_person_to_organization",
                "organizationId",
                organizationId,
                "personEmail",
                email,
                "userId",
                user?.getId()
            );
        } else {
            record.markAsNotNew();
            record.set("failed_email_send", true);
            $app.dao().saveRecord(record);

            auditLogger(c).info(
                "failed_to_send_organization_invite",
                "organizationId",
                organizationId,
                "email",
                email,
                "userId",
                user?.getId(),
                "errorMessage",
                err.message
            );
        }
    }
});
