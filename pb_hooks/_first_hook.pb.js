/// <reference path="../pb_data/types.d.ts" />

// This hook runs after a user is successfully created
onRecordAfterCreateSuccess((e) => {
    const userId = e.record.get("id");

    // Fetch all courses
    const courses = $app.findRecordsByFilter("courses", "", []);
    for (let i = 0; i < courses.length; i++) {
        const course = courses[i];

        // Create a user_course_progress entry
        const collection = $app.findCollectionByNameOrId("user_course_progress");
        const ucProgress = new Record(collection);
        ucProgress.set("user", userId);
        ucProgress.set("course", course.get("id"));
        ucProgress.set("completed", false);

        $app.dao().saveRecord(ucProgress);
    }

    // Fetch all tutorials
    const tutorials = $app.findRecordsByFilter("tutorials", "", []);
    for (let i = 0; i < tutorials.length; i++) {
        const tutorial = tutorials[i];

        // Create a user_tutorial_progress entry
        const tutorialCollection = $app.findCollectionByNameOrId("user_tutorial_progress");
        const utProgress = new Record(tutorialCollection);
        utProgress.set("user", userId);
        utProgress.set("tutorial", tutorial.get("id"));
        utProgress.set("completed", false);

        $app.dao().saveRecord(utProgress);
    }

    // Call e.next() to continue the execution chain
    e.next();
}, "users");