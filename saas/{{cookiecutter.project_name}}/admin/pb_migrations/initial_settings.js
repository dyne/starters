migrate((db) => {
    const dao = new Dao(db);

    const settings = dao.findSettings();
    settings.meta.appName = "{{cookiecutter.project_name}}";

    dao.saveSettings(settings);
});
