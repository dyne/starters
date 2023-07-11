migrate((db) => {
  const collection = new Collection({
    "id": "pfd2c9p7iuvrhqt",
    "created": "2023-07-11 07:17:11.142Z",
    "updated": "2023-07-11 07:17:11.142Z",
    "name": "notify_user",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "3rknryat",
        "name": "owner",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": []
        }
      },
      {
        "system": false,
        "id": "ceulc7uv",
        "name": "message",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("pfd2c9p7iuvrhqt");

  return dao.deleteCollection(collection);
})
