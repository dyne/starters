// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

// @ts-check

/// <reference path="../pb_data/types.d.ts" />
/** @typedef {import('./utils.js')} Utils */
/** @typedef {import('./auditLogger.js')} AuditLogger */

/**
 * INDEX
 * - hooks
 * - routes
 */

/* Hooks */

onRecordAfterCreateRequest((e) => {
    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);

    const invites = utils.findRecordsByFilter(
        "org_invites",
        `user_email = "${e.record?.email()}"`
    );
    invites.forEach((invite) => {
        invite.markAsNotNew();
        invite.set("user", e.record?.getId());
        $app.dao().saveRecord(invite);
    });
}, "users");

/* Routes */

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

    const actorId = utils.getUserFromContext(c)?.getId();
    if (!actorId) throw utils.createMissingDataError("userId");

    const actorRole = utils.getUserRole(actorId, organizationId);
    const actorRoleName = actorRole?.get("name");
    if (actorRoleName != "admin" && actorRoleName != "owner")
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

        const existingInvite = utils.findFirstRecordByFilter(
            "org_invites",
            `user_email = "${email}"`
        );
        if (existingInvite) continue;

        // Otherwise, create invite

        const invite = new Record(orgInvitesCollection);
        invite.set("organization", organizationId);
        invite.set("user_email", email);
        if (user) invite.set("user", user.getId());
        $app.dao().saveRecord(invite);

        // Send email

        /** @type {string[]} */
        // Reference: webapp/src/routes/[[lang]]/(nru)/organization-invite-[orgId]-[inviteId]-[email]-[[userId]]
        const routeParams = [
            organizationId,
            invite.getId(),
            encodeURIComponent(email),
            user?.getId() ?? "",
        ];
        const paramsString = routeParams.join("-");
        const emailCtaUrl = `${utils.getAppUrl()}/organization-invite-${paramsString}`;
        const a = `<a href="${emailCtaUrl}">Manage your invitation</a>`;

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
            invite.markAsNotNew();
            invite.set("failed_email_send", true);
            $app.dao().saveRecord(invite);

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
