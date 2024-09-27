// @ts-check

/// <reference path="../pb_data/types.d.ts" />
/** @typedef {import('./utils.js')} Utils */
/** @typedef {import('./auditLogger.js')} AuditLogger */

/**
 * INDEX
 * - Routes
 * - Audit Hooks
 * - Email
 */

/* Routes */

routerAdd("POST", "/organizations/verify-user-membership", (c) => {
    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);
    /** @type {AuditLogger} */
    const auditLogger = require(`${__hooks}/audit-logs.utils.js`);

    const userId = utils.getUserFromContext(c)?.getId();

    /** @type {string | undefined} */
    const organizationId = $apis.requestInfo(c).data["organizationId"];
    if (!organizationId)
        throw utils.createMissingDataError("organizationId", "roles");

    try {
        $app.dao().findFirstRecordByFilter(
            "orgAuthorizations",
            `organization="${organizationId}" && user="${userId}"`
        );
        return c.json(200, { isMember: true });
    } catch {
        auditLogger(c).info(
            "request_from_user_not_member",
            "organizationId",
            organizationId
        );
        return c.json(200, { isMember: false });
    }
});

routerAdd("POST", "/organizations/verify-user-role", (c) => {
    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);

    const userId = utils.getUserFromContext(c)?.getId();

    /** @type {{organizationId: string, roles: string[]}}*/
    // @ts-ignore
    const { organizationId, roles } = $apis.requestInfo(c).data;
    if (!organizationId || !roles || roles.length === 0)
        throw utils.createMissingDataError("organizationId", "roles");

    const roleFilter = `( ${roles
        .map((r) => `role.name="${r}"`)
        .join(" || ")} )`;

    try {
        $app.dao().findFirstRecordByFilter(
            "orgAuthorizations",
            `organization="${organizationId}" && user="${userId}" && ${roleFilter}`
        );
        return c.json(200, { hasRole: true });
    } catch {
        return c.json(200, { hasRole: false });
    }
});

/* Audit hooks */

onRecordAfterCreateRequest((e) => {
    /** @type {AuditLogger} */
    const auditLogger = require(`${__hooks}/audit-logs.utils.js`);

    auditLogger(e.httpContext).info(
        "Created organization",
        "organizationId",
        e.record?.getId(),
        "organizationName",
        e.record?.get("name")
    );
}, "organizations");

onRecordAfterCreateRequest((e) => {
    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);

    if (!e.record) throw utils.createMissingDataError("organization");

    const user = utils.getUserFromContext(e.httpContext);
    if (!user) throw utils.createMissingDataError("user creating organization");

    const userAddress = utils.getUserEmailAddressData(user);
    const organizationName = e.record.get("name");

    const res = utils.sendEmail({
        to: userAddress,
        subject: `Organization "${organizationName}" created successfully!`,
        html: "Your organization has been created!",
    });
    if (res instanceof Error) {
        console.error(res);
    }
}, "organizations");
