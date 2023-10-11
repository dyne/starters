/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("2y35btjamfzcr9o")

  collection.name = "orgProtectedPaths"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("2y35btjamfzcr9o")

  collection.name = "protectedPaths"

  return dao.saveCollection(collection)
})
