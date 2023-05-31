const FEATURES_COLLECTION_NAME = "features";

/**
    type Feature = {
        name: string;
        envVariables: Record<string, unknown>;
    }
*/
const features = [
    {
        name: "keypairoom",
        envVariables: {
            SALT: "bWltbW8K",
        },
    },
    {
        name: "DID",
        envVariables: {
            DID_URL: "url",
            DID_SPEC: "string",
            DID_SIGNER_SPEC: "string",
            DID_IDENTITY: "string",
            DID_KEYRING: "json, currently passed base64 encoded",
        },
    },
];

migrate(
    (db) => {
        const dao = new Dao(db);
        const collection = dao.findCollectionByNameOrId(
            FEATURES_COLLECTION_NAME
        );

        for (const feature of features) {
            const record = new Record(collection, {
                name: feature.name,
                envVariables: feature.envVariables,
                active: false,
            });

            dao.saveRecord(record);
        }
    },
    (db) => {
        const dao = new Dao(db);

        // delete the previously created record (if exists)
        for (const feature of features) {
            try {
                const record = dao.findFirstRecordByData(
                    FEATURES_COLLECTION_NAME,
                    "name",
                    feature.name
                );

                dao.deleteRecord(record);
            } catch {}
        }
    }
);
