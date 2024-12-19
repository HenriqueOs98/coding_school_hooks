onRecordCreateRequest((e) => {
    const record = e.record
    
    console.log("New user creation request:")
    console.log("Email:", record.email)
    console.log("Username:", record.username)
    
    // You can modify the record before creation if needed
    // For example, add a default role or status
    record.set("status", "active")
    
    e.next()
}, "users")
