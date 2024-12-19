/// <reference path="../types.d.ts" />

onRecordCreateRequest((e) => {
    try {
        const record = e.record;
        if (!record) return e.next();

        // Get all courses
        const courses = $app.findRecordsByFilter(
            "courses",
            "",  // empty filter to get all
            null, // no sorting
            100   // limit to 100 courses
        );

        // For each course, create a progress record
        courses.forEach((course) => {
            try {
                const collection = $app.findCollectionByNameOrId("user_course_progress");
                const courseProgress = new Record(collection);
                courseProgress.set("user", record.id);
                courseProgress.set("course", course.id);
                courseProgress.set("completed", false);
                $app.dao().saveRecord(courseProgress);

                // Get tutorials for this course
                const tutorials = $app.findRecordsByFilter(
                    "tutorials",
                    `course = "${course.id}"`,
                    null,
                    100
                );

                // Create tutorial progress
                tutorials.forEach((tutorial) => {
                    const tutorialCollection = $app.findCollectionByNameOrId("user_tutorial_progress");
                    const tutorialProgress = new Record(tutorialCollection);
                    tutorialProgress.set("user", record.id);
                    tutorialProgress.set("tutorial", tutorial.id);
                    tutorialProgress.set("completed", false);
                    $app.dao().saveRecord(tutorialProgress);
                });
            } catch (err) {
                console.error("Error creating progress for course:", course.id, err);
            }
        });

        return e.next();
    } catch (err) {
        console.error("Error in user creation hook:", err);
        return e.next();
    }
}, "users")
