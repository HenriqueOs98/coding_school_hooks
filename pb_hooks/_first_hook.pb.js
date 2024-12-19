

// Fires only for "users" and "articles" records
onRecordAfterCreateSuccess((e) => {
    // e.app
    // e.record

    if (e.record.collectionName === "users") {
        console.log("User created:", e.record);

        // Add your custom logic for user creation here
        // For example, send a welcome email or log the event
    }

    e.next();
}, "users");