/// <reference path="../pb_data/types.d.ts" />

routerAdd("POST", "/organizations/verify-user-membership", (c) => {
    console.log("Route - Checking if user is member of the organization");

    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);

    const userId = utils.getUserFromContext(c)?.getId();

    /** @type {{organizationId: string, roles: string[]}}*/
    const { organizationId } = $apis.requestInfo(c).data;
    if (!organizationId)
        throw utils.createMissingDataError("organizationId", "roles");

    try {
        $app.dao().findFirstRecordByFilter(
            "orgAuthorizations",
            `organization="${organizationId}" && user="${userId}"`
        );
        return c.json(200, { isMember: true });
    } catch {
        return c.json(200, { isMember: false });
    }
});

routerAdd("POST", "/organizations/verify-user-role", (c) => {
    console.log("Route - Checking if user has the required role");

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
