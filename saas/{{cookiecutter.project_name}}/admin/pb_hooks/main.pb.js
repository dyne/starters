/// <reference path="../pb_data/types.d.ts" />
/**
 * @typedef {import('./utils.js')} Utils
 */

onRecordAfterCreateRequest((e) => {
    console.log("Hook - Creating admin role for new organization");

    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);

    const userId = utils.getUserFromEvent(e).id;
    const organizationId = e.record.id;

    const adminRole = utils.getAdminRole();
    const adminRoleId = adminRole.id;

    const collection = $app
        .dao()
        .findCollectionByNameOrId("organizationAuthorizations");
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
            "organizationAuthorizations",
            `organization="${organizationId}" && role="${adminRoleId}"`
        );

    if (adminAuthorizations.length > 1) return;

    throw new Error("Can't remove the last admin role!");
}, "organizationAuthorizations");
