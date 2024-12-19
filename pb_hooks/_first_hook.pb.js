// Hook that runs after a user is created
onRecordAfterCreateRequest(async (e) => {
    const { collection, record } = e;

    // Only run for users collection
    if (collection.name !== "users") {
        return;
    }

    try {
        // Get all courses
        const courses = await $app.dao().findRecordsByFilter(
            'courses',
            'created >= "2000-01-01 00:00:00"'
        );

        // Create course progress records
        for (const course of courses) {
            await $app.dao().saveRecord($app.dao().findCollectionByNameOrId('course_progress').newRecord({
                user: record.id,
                course: course.id,
                completed: false
            }));

            // Get all tutorials for this course
            const tutorials = await $app.dao().findRecordsByFilter(
                'tutorials',
                `course = "${course.id}"`
            );

            // Create tutorial progress records
            for (const tutorial of tutorials) {
                await $app.dao().saveRecord($app.dao().findCollectionByNameOrId('tutorial_progress').newRecord({
                    user: record.id,
                    tutorial: tutorial.id,
                    completed: false
                }));
            }
        }
    } catch (error) {
        console.error('Error in user creation hook:', error);
    }
}, 'users');