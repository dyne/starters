// @ts-check

/// <reference path="../pb_data/types.d.ts" />

onRecordViewRequest((e) => {
    e.record?.set("envVariables", null);
}, "features");

onRecordsListRequest((e) => {
    e.records.forEach((r) => r?.set("envVariables", null));
}, "features");
