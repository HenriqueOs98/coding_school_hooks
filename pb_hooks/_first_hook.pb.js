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
                // Create course progress
                const collection = $app.findCollectionByNameOrId("user_course_progress");
                const courseProgress = new Record(collection, {
                    user: record.id,
                    course: course.id,
                    completed: false
                });
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
                    const tutorialProgress = new Record(
                        $app.findCollectionByNameOrId("user_tutorial_progress"), 
                        {
                            user: record.id,
                            tutorial: tutorial.id,
                            completed: false
                        }
                    );
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
