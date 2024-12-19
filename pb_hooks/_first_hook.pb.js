onRecordAfterCreateRequest(async (e) => {
    const user = e.record;
    console.log("New user created:", user.id);

    try {
        // Get all courses
        const courses = await $app.dao().findRecordsByFilter(
            'courses',
            null,
            null,
            null,
            0,
            null
        );

        // Create user_course_progress for each course
        for (const course of courses) {
            await $app.dao().saveRecord($app.dao().newRecord('user_course_progress', {
                user: user.id,
                course: course.id,
                completed: false,
            }));

            // Get all tutorials for this course
            const tutorials = await $app.dao().findRecordsByFilter(
                'tutorials',
                `course = "${course.id}"`,
                null,
                null,
                0,
                null
            );

            // Create user_tutorial_progress for each tutorial
            for (const tutorial of tutorials) {
                await $app.dao().saveRecord($app.dao().newRecord('user_tutorial_progress', {
                    user: user.id,
                    tutorial: tutorial.id,
                    completed: false,
                }));
            }
        }

        console.log("Successfully initialized progress records for user:", user.id);
    } catch (error) {
        console.error("Error initializing progress records:", error);
    }
}, "users")
