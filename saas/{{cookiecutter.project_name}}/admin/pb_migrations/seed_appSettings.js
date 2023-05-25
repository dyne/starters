const FEATURE_FLAG_COLLECTION_NAME = "featureFlags";

const featureList = ["DID", "keypairoom"];

migrate(
    (db) => {
        const dao = new Dao(db);
        const settings = dao.findSettings();

        settings.meta.appName = "{{cookiecutter.project_name}}";
        settings.meta.senderName = "{{cookiecutter.admin_email_sender_name}}";
        settings.meta.senderAddress = "{{cookiecutter.admin_email_address}}";

        return dao.saveSettings(settings);
    },
    (db) => {}
);
