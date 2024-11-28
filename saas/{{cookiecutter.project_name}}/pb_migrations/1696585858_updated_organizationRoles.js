/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("pgsh9x4x20kdgjd")

  collection.name = "orgRoles"
  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_IXVrGSd` ON `orgRoles` (\n  `name`,\n  `label`\n)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("pgsh9x4x20kdgjd")

  collection.name = "organizationRoles"
  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_IXVrGSd` ON `organizationRoles` (\n  `name`,\n  `label`\n)"
  ]

  return dao.saveCollection(collection)
})
