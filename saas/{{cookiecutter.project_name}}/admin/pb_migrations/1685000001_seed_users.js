/// <reference path="../pb_data/types.d.ts" />

const USERS_COLLECTION_NAME = "users";

/**
 * @param {string} letter
 */
function createSampleUserData(letter) {
    const name = `user${letter}`;
    return {
        email: `user${letter}@example.org`,
        username: name,
        password: `user${letter}user${letter}`,
        name: name,
    };
}

/**
 *
 * @param {Dao} dao
 * @param {string} letter
 * @returns
 */
function addSampleUser(dao, letter) {
    const { email, username, password, name } = createSampleUserData(letter);
    const collection = dao.findCollectionByNameOrId(USERS_COLLECTION_NAME);

    /** @type {models.Record} */
    let record;

    try {
        record = dao.findAuthRecordByEmail(collection.name, email);
    } catch (e) {
        record = new Record(collection);
    }

    record.setUsername(username);
    record.setEmail(email);
    record.setPassword(password);
    record.setVerified(true);
    record.set("name", name);
    record.set("emailVisibility", true);

    dao.saveRecord(record);

    return record;
}

migrate(
    (db) => {
        const dao = new Dao(db);

        /* Users */
        const userA = addSampleUser(dao, "A");
        const userB = addSampleUser(dao, "B");
        const userC = addSampleUser(dao, "C");

        // /* AuthorizationExample */
        // const authorizationsExamples = dao.findCollectionByNameOrId(
        //     "authorizationsExamples"
        // );
        // const authorizationExample = new Record(authorizationsExamples);
        // authorizationExample.set("name", "authorizationExample");
        // authorizationExample.set("owner", userA.id);
        // dao.saveRecord(authorizationExample);

        // /* Authorization */
        // const authorizations = dao.findCollectionByNameOrId("authorizations");
        // const authorization = new Record(authorizations);
        // authorization.set("owner", userA.id);
        // authorization.set("users", [userB.id]);
        // authorization.set("collection_id", authorizationsExamples.id);
        // authorization.set("record_id", authorizationExample.id);
        // dao.saveRecord(authorization);

        return;
    },
    (db) => {
        return;
    }
);
