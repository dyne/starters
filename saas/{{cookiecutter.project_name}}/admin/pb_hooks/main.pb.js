// pb_hooks/test.pb.js
$app.onRecordBeforeCreateRequest("organizationRoles").add((e) => {
    console.log(e)
})
