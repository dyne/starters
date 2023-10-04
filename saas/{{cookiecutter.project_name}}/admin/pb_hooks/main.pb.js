/// <reference path="../pb_data/types.d.ts" />

onRecordAfterCreateRequest((e) => {
    console.log("Hook - Creating admin role for new organization");

    const userId = $apis.requestInfo(e.httpContext).authRecord.id;
    const organizationId = e.record.id;

    const adminRole = $app
        .dao()
        .findFirstRecordByData("organizationRoles", "name", "admin");
    if (!adminRole) throw new Error("missing admin role!");
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
