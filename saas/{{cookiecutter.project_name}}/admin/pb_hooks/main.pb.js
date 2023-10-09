/// <reference path="../pb_data/types.d.ts" />
/**
 * @typedef {import('./utils.js')} Utils
 */

onRecordAfterCreateRequest((e) => {
    console.log("Hook - Creating admin role for new organization");

    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);

    const userId = utils.getUserFromContext(e.httpContext).id;
    const organizationId = e.record.id;

    const adminRole = utils.getAdminRole();
    const adminRoleId = adminRole.id;

    const collection = $app.dao().findCollectionByNameOrId("orgAuthorizations");
    const record = new Record(collection, {
        organization: organizationId,
        role: adminRoleId,
        user: userId,
    });
    $app.dao().saveRecord(record);
}, "organizations");

onRecordBeforeDeleteRequest((e) => {
    console.log("Hook - Checking if deleting admin role is possible");

    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);

    const organizationId = e.record.get("organization");
    const roleId = e.record.get("role");
    const adminRoleId = utils.getAdminRole().id;

    if (roleId !== adminRoleId) return;

    const adminAuthorizations = $app
        .dao()
        .findRecordsByFilter(
            "orgAuthorizations",
            `organization="${organizationId}" && role="${adminRoleId}"`
        );

    if (adminAuthorizations.length > 1) return;

    throw new Error("Can't remove the last admin role!");
}, "orgAuthorizations");

routerAdd("POST", "/verify-org-authorization", (c) => {
    console.log("Route - Checking if user has the correct org authorization");

    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);

    const userId = utils.getUserFromContext(c).id;

    /**  @type {{organizationId: string, url: string}}*/
    const { organizationId, url } = $apis.requestInfo(c).data;
    if (!organizationId || !url) throw new Error("Missing data in request");

    const organization = $app
        .dao()
        .findRecordById("organizations", organizationId);
    if (!organization) throw new Error("Invalid organization id");

    const userAuthorization = $app
        .dao()
        .findFirstRecordByFilter(
            "orgAuthorizations",
            `organization="${organizationId}" && user="${userId}"`
        );
    // Here we assume that there is only one role for each organization
    // Also enforced by API rules
    if (!userAuthorization) throw new Error("Not authorized");
    const userRole = userAuthorization.get("role");
    console.log("user role", userRole);

    const protectedPaths = $app
        .dao()
        .findRecordsByFilter("orgProtectedPaths", "pathRegex != ''");

    const matchingPaths = protectedPaths.filter((p) => {
        const regex = new RegExp(p.get("pathRegex"));
        return regex.test(url);
    });

    const isAllowed = matchingPaths
        .map((p) => {
            /** @type {string[]} */
            const roles = p.get("roles");
            return roles;
        })
        .every((roles) => roles.includes(userRole));

    if (!isAllowed) throw new Error("Not authorized");
});
