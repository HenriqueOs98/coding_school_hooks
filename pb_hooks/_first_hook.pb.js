/// <reference path="../types.d.ts" />

onRecordAfterCreateRequest((e) => {
    try {
        const user = e.record;
        if (!user) return e.next();

        $app.runInTransaction((txApp) => {
            // Get all courses
            const courses = txApp.findRecordsByFilter(
                "courses",
                "",  // empty filter to get all
                null, // no sorting
                100   // limit to 100 courses
            );

            // For each course, create a progress record
            courses.forEach((course) => {
                try {
                    // Create course progress
                    const collection = txApp.findCollectionByNameOrId("user_course_progress");
                    const courseProgress = new Record(collection);
                    courseProgress.set("user", user.id);
                    courseProgress.set("course", course.id);
                    courseProgress.set("completed", false);
                    txApp.save(courseProgress);

                    // Get tutorials for this course
                    const tutorials = txApp.findRecordsByFilter(
                        "tutorials",
                        `course = "${course.id}"`,
                        null,
                        100
                    );

                    // Create tutorial progress
                    tutorials.forEach((tutorial) => {
                        const tutorialCollection = txApp.findCollectionByNameOrId("user_tutorial_progress");
                        const tutorialProgress = new Record(tutorialCollection);
                        tutorialProgress.set("user", user.id);
                        tutorialProgress.set("tutorial", tutorial.id);
                        tutorialProgress.set("completed", false);
                        txApp.save(tutorialProgress);
                    });
                } catch (err) {
                    console.error("Error creating progress for course:", course.id, err);
                    throw err; // Re-throw to rollback transaction
                }
            });
        });

        return e.next();
    } catch (err) {
        console.error("Error in user creation hook:", err);
        return e.next();
    }
}, "users");
