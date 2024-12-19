// Fires before the record is created
onRecordCreateRequest((e) => {
    console.log("Hello, World!");
    return e.next();
});

// Fires before the record is updated
onRecordUpdateRequest((e) => {
    console.log("Hello, World!");
    return e.next();
});