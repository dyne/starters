/// <reference path="../pb_data/types.d.ts" />

module.exports = {
    /**
     * @param {core.RecordCreateEvent} e
     * @returns {models.Record | undefined}
     */
    getUserFromEvent: (e) => {
        return $apis.requestInfo(e.httpContext).authRecord;
    },
    /**
     * @returns {models.Record | undefined}
     */
    getAdminRole: () => {
        const adminRole = $app
            .dao()
            .findFirstRecordByData("orgRoles", "name", "admin");
        if (!adminRole) throw new Error("missing admin role!");
        return adminRole;
    },
};
