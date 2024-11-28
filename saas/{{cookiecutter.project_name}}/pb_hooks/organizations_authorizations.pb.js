// @ts-check

/// <reference path="../pb_data/types.d.ts" />
/** @typedef {import('./utils.js')} Utils */
/** @typedef {import('./auditLogger.js')} AuditLogger */
/** @typedef {import("../../webapp/src/modules/pocketbase/types").OrgAuthorizationsRecord} OrgAuthorization */
/** @typedef {import("../../webapp/src/modules/pocketbase/types").OrgRolesResponse} OrgRole */

/**
 * INDEX
 * - guard hooks (protecting orgAuthorizations from invalid CRUD operations)
 * - audit + email hooks
 */

/* Guard hooks */

// [CREATE] Cannot create an authorization with a level higher than or equal to your permissions

onRecordBeforeCreateRequest((e) => {
    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);

    if (utils.isAdminContext(e.httpContext)) return;

    const { isSelf, userRoleLevel } =
        utils.getUserContextInOrgAuthorizationHookEvent(e);

    if (isSelf)
        throw new BadRequestError(
            utils.errors.cant_create_an_authorization_for_yourself
        );

    // Getting requested role level

    if (!e.record) throw utils.createMissingDataError("orgAuthorization");
    const requestedRole = utils.getExpanded(e.record, "role");
    if (!requestedRole) throw utils.createMissingDataError("requestedRole");
    const requestedRoleLevel = utils.getRoleLevel(requestedRole);

    // Matching

    if (requestedRoleLevel <= userRoleLevel) {
        throw new BadRequestError(
            utils.errors.cant_create_role_higher_than_or_equal_to_yours
        );
    }
}, "orgAuthorizations");

// [UPDATE] Removing fields not needed

onRecordBeforeUpdateRequest((e) => {
    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);

    const originalCopy = e.record?.originalCopy();
    if (!e.record || !originalCopy)
        throw utils.createMissingDataError("orgAuth");

    e.record.set("user", originalCopy.get("user"));
    e.record.set("organization", originalCopy.get("organization"));
}, "orgAuthorizations");

// [UPDATE] Cannot update to/from a role higher than the user

onRecordBeforeUpdateRequest((e) => {
    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);

    if (utils.isAdminContext(e.httpContext)) return;

    const { isSelf, userRoleLevel: requestingUserRoleLevel } =
        utils.getUserContextInOrgAuthorizationHookEvent(e);

    // Getting role before edit (unmodified)

    const originalAuthorization = e.record?.originalCopy();
    if (!originalAuthorization)
        throw utils.createMissingDataError("originalAuthorization");

    const originalRole = utils.getExpanded(originalAuthorization, "role");
    if (!originalRole) throw utils.createMissingDataError("previousRole");

    const originalRoleLevel = utils.getRoleLevel(originalRole);

    // First check

    if (originalRoleLevel <= requestingUserRoleLevel && !isSelf)
        throw new ForbiddenError(
            utils.errors.cant_edit_role_higher_than_or_equal_to_yours
        );

    // Getting requested role

    /** @type {Partial<OrgAuthorization>} */
    const { role: newRoleId } = $apis.requestInfo(e.httpContext).data;

    if (!newRoleId) throw utils.createMissingDataError("newRoleId");
    const newRole = $app.dao().findRecordById("orgRoles", newRoleId);

    const newRoleLevel = utils.getRoleLevel(newRole);

    // Second check

    if (newRoleLevel <= requestingUserRoleLevel)
        throw new ForbiddenError(
            utils.errors.cant_edit_role_higher_than_or_equal_to_yours
        );
}, "orgAuthorizations");

// [DELETE] Cannot delete an authorization with a level higher than or equal to yours

onRecordBeforeDeleteRequest((e) => {
    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);

    if (utils.isAdminContext(e.httpContext)) return;

    const { isSelf, userRoleLevel: requestingUserRoleLevel } =
        utils.getUserContextInOrgAuthorizationHookEvent(e);

    // If user requests delete for itself, it's fine
    if (isSelf) return;

    // Getting role of authorization to delete

    if (!e.record) throw utils.createMissingDataError("originalAuthorization");

    const roleToDelete = utils.getExpanded(e.record, "role");
    if (!roleToDelete) throw utils.createMissingDataError("roleToDelete");

    const roleToDeleteLevel = utils.getRoleLevel(roleToDelete);

    // Comparing levels

    if (roleToDeleteLevel <= requestingUserRoleLevel)
        throw new ForbiddenError(
            utils.errors.cant_delete_role_higher_than_or_equal_to_yours
        );
}, "orgAuthorizations");

// [DELETE] Cannot delete last owner role

onRecordBeforeDeleteRequest((e) => {
    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);

    if (utils.isAdminContext(e.httpContext)) return;

    if (e.record && utils.isLastOwnerAuthorization(e.record)) {
        throw new BadRequestError(utils.errors.cant_edit_last_owner_role);
    }
}, "orgAuthorizations");

// [UPDATE] Cannot edit last owner role

onRecordBeforeUpdateRequest((e) => {
    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);

    if (utils.isAdminContext(e.httpContext)) return;

    const originalRecord = e.record?.originalCopy();
    // e.record is already the "modified" version, so it is not a "owner" role anymore
    // to check if it's the last one, we need to get the "original" record

    if (originalRecord && utils.isLastOwnerAuthorization(originalRecord)) {
        throw new BadRequestError(utils.errors.cant_delete_last_owner_role);
    }
}, "orgAuthorizations");

/* Audit + Email hooks */

onRecordAfterCreateRequest((e) => {
    /** @type {AuditLogger} */
    const auditLogger = require(`${__hooks}/auditLogger.js`);

    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);

    if (!e.record) return;

    const organization = utils.getExpanded(e.record, "organization");
    const user = utils.getExpanded(e.record, "user");
    const role = utils.getExpanded(e.record, "role");

    auditLogger(e.httpContext).info(
        "Created organization authorization",
        "organizationId",
        organization?.getId(),
        "organizationName",
        organization?.get("name"),
        "userId",
        user?.getId(),
        "userName",
        user?.get("name"),
        "roleId",
        role?.getId(),
        "roleName",
        role?.get("name")
    );
}, "orgAuthorizations");

onRecordAfterUpdateRequest((e) => {
    /** @type {AuditLogger} */
    const auditLogger = require(`${__hooks}/auditLogger.js`);

    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);

    if (!e.record) return;

    const organization = utils.getExpanded(e.record, "organization");
    const organizationName = organization?.get("name");

    const user = utils.getExpanded(e.record, "user");
    if (!user) throw utils.createMissingDataError("user of orgAuthorization");

    const previousRole = utils.getExpanded(e.record.originalCopy(), "role");
    const role = utils.getExpanded(e.record, "role");

    auditLogger(e.httpContext).info(
        "Updated organization authorization",
        "organizationId",
        organization?.getId(),
        "organizationName",
        organizationName,
        "userId",
        user?.getId(),
        "userName",
        user?.get("name"),
        "previousRoleId",
        previousRole?.getId(),
        "previousRoleName",
        previousRole?.get("name"),
        "newRoleId",
        role?.getId(),
        "newRoleName",
        role?.get("name")
    );

    const res = utils.sendEmail({
        to: utils.getUserEmailAddressData(user),
        subject: `${organizationName} | Your organization role has changed"`,
        html: "",
    });
    if (res instanceof Error) {
        console.error(res);
    }
}, "orgAuthorizations");

onRecordAfterDeleteRequest((e) => {
    /** @type {AuditLogger} */
    const auditLogger = require(`${__hooks}/auditLogger.js`);

    /** @type {Utils} */
    const utils = require(`${__hooks}/utils.js`);

    if (!e.record) return;

    const record = e.record.originalCopy();

    const organization = utils.getExpanded(record, "organization");
    const organizationName = organization?.get("name");

    const user = utils.getExpanded(record, "user");
    const role = utils.getExpanded(record, "role");

    if (!user) throw utils.createMissingDataError("user of orgAuthorization");

    auditLogger(e.httpContext).info(
        "Deleted organization authorization",
        "organizationId",
        organization?.getId(),
        "organizationName",
        organizationName,
        "userId",
        user?.getId(),
        "userName",
        user?.get("name"),
        "roleId",
        role?.getId(),
        "roleName",
        role?.get("name")
    );

    const res = utils.sendEmail({
        to: utils.getUserEmailAddressData(user),
        subject: `${organizationName} | Your organization role has been deleted"`,
        html: "",
    });
    if (res instanceof Error) {
        console.error(res);
    }
}, "orgAuthorizations");
