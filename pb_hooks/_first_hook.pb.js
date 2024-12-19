/// <reference path="../types.d.ts" />

onRecordCreateRequest((e) => {
    try {
        const record = e.record;
        if (!record) return e.next();

        // Get all courses
        const courses = $app.collection('courses').getFullList();

        // For each course, create a progress record
        courses.forEach(async (course) => {
            try {
                await $app.collection('user_course_progress').create({
                    user: record.id,
                    course: course.id,
                    completed: false
                });

                // Get tutorials for this course
                const tutorials = await $app.collection('tutorials').getFullList({
                    filter: `course = "${course.id}"`
                });

                // Create progress for each tutorial
                tutorials.forEach(async (tutorial) => {
                    await $app.collection('user_tutorial_progress').create({
                        user: record.id,
                        tutorial: tutorial.id,
                        completed: false
                    });
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
