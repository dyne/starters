/// <reference path="../pb_data/types.d.ts" />

//

/** @type {import("../../webapp/src/lib/pocketbase/types").OrganizationRolesRecord[]} */
const roles = [
    {
        name: "admin",
        label: "Admin",
        level: 0,
    },
    {
        name: "member",
        label: "Member",
        level: 1,
    },
];

const ROLES_COLLECTION_NAME = "organizationRoles";

migrate((db) => {
    const dao = new Dao(db);
    const collection = dao.findCollectionByNameOrId(ROLES_COLLECTION_NAME);

    for (const role of roles) {
        const record = new Record(collection, role);

        dao.saveRecord(record);
    }
});
