const FEATURE_FLAG_COLLECTION_NAME = "featureFlags";

const featureList = ["DID", "keypairoom"];

migrate(
  (db) => {
    const dao = new Dao(db);
    const collection = dao.findCollectionByNameOrId(
      FEATURE_FLAG_COLLECTION_NAME
    );

    for (const feature of featureList) {
      const record = new Record(collection, {
        name: feature,
        active: true,
      });

      dao.saveRecord(record);
    }
  },
  (db) => {
    const dao = new Dao(db);

    // delete the previously created record (if exists)
    for (const feature of featureList) {
      try {
        const record = dao.findFirstRecordByData(
          FEATURE_FLAG_COLLECTION_NAME,
          "name",
          feature
        );

        dao.deleteRecord(record);
      } catch {}
    }
  }
);
