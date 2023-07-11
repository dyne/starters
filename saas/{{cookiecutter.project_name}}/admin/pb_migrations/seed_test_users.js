const USERS_COLLECTION_NAME = "users";

const users = [
    {
        email: "userA@example.org",
        password: "userAuserA",
    },
    {
        email: "userB@example.org",
        password: "userBuserB",
    },
    {
        email: "userC@example.org",
        password: "userCuserC",
    },
];

function addUser(dao, email, password) {
    const collection = dao.findCollectionByNameOrId(USERS_COLLECTION_NAME);

    const record = new Record(collection);
    record.setUsername(email);
    record.setEmail(email);
    record.setPassword(password);
    record.setVerified(true);

    dao.saveRecord(record);
}

function removeUser(dao, email) {
    const record = dao.findAuthRecordByEmail(USERS_COLLECTION_NAME, email);
    dao.deleteRecord(record);
}

migrate(
    (db) => {
        const dao = new Dao(db);

        for (const { email, password } of users) {
            addUser(dao, email, password);
        }

        return;
    },
    (db) => {
        const dao = new Dao(db);

        for (const { email } of users) {
            removeUser(dao, email);
        }

        return;
    }
);
