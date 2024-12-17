// @ts-check

/// <reference path="../pb_data/types.d.ts" />
/** @typedef {import('./utils.js')} Utils */
/** @typedef {import('./auditLogger.js')} AuditLogger */

onMailerBeforeRecordResetPasswordSend((e) => {
    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);

    if (!e.message) throw utils.createMissingDataError("email message");

    /** @type {string|undefined} */
    const token = e.meta["token"];
    if (!token) throw utils.createMissingDataError("token");

    const resetLink = $app.settings().meta.appUrl + `/reset-password-${token}`;

    const emailData = utils.renderEmail("reset-password", {
        username: e.record?.get("name") ?? "User",
        resetLink: resetLink,
        AppName: utils.getAppName(),
    });

    e.message.html = emailData.html;
    e.message.subject = emailData.subject;
}, "users");

onMailerBeforeRecordVerificationSend((e) => {
    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);

    if (!e.message) throw utils.createMissingDataError("email message");

    /** @type {string|undefined} */
    const token = e.meta["token"];
    if (!token) throw utils.createMissingDataError("token");

    const VerificationLink =
        $app.settings().meta.appUrl + `/verify-email-${token}`;

    const emailData = utils.renderEmail("confirm-email", {
        UserName: e.record?.get("name") ?? "User",
        VerificationLink,
        AppName: utils.getAppName(),
    });

    e.message.html = emailData.html;
    e.message.subject = emailData.subject;
}, "users");

onRecordAfterCreateRequest((e) => {
    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);

    if (!e.record) throw utils.createMissingDataError("user");

    const emailData = utils.renderEmail("user-welcome", {
        DashboardLink: utils.getAppUrl() + "/my",
        UserName: e.record.get("name") ?? "User",
        AppName: utils.getAppName(),
    });

    const err = utils.sendEmail({
        to: utils.getUserEmailAddressData(e.record),
        ...emailData,
    });
    if (err instanceof Error) {
        console.log(err);
    }
}, "users");
