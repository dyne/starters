/// <reference path="../pb_data/types.d.ts" />

const roles = ["owner", "admin", "member"];

migrate((db) => {
    const dao = new Dao(db);
    const collection = dao.findCollectionByNameOrId("orgRoles");

    for (const role of roles) {
        const record = new Record(collection, { name: role });

        dao.saveRecord(record);
    }
});
