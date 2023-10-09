/// <reference path="../pb_data/types.d.ts" />

//

const roles = ["owner", "admin", "member"];

const ROLES_COLLECTION_NAME = "organizationRoles";

migrate((db) => {
    const dao = new Dao(db);
    const collection = dao.findCollectionByNameOrId("");

    for (const role of roles) {
        const record = new Record(collection, { name: role });

        dao.saveRecord(record);
    }
});
