/// <reference path="../types.d.ts" />

/**
 * @typedef {import('./types').Collections} Collections
 * @typedef {import('./types').UserCourseProgressRecord} UserCourseProgressRecord
 * @typedef {import('./types').UserTutorialProgressRecord} UserTutorialProgressRecord
 */

/** @type {Collections} */
const Collections = {
    COURSES: "courses",
    TUTORIALS: "tutorials",
    USER_COURSE_PROGRESS: "user_course_progress",
    USER_TUTORIAL_PROGRESS: "user_tutorial_progress",
    USERS: "users"
};

onRecordCreateRequest((e) => {
    try {
        const user = e.record;
        if (!user) return e.next();

        console.log("Creating progress for user:", user.id);

        // Get first course
        const course = $app.findFirstRecordByFilter(
            Collections.COURSES,
            "" // empty filter to get any course
        );

        if (!course) {
            console.log("No courses found");
            return e.next();
        }

        console.log("Found course:", course.id);

        // Create one course progress record
        const collection = $app.findCollectionByNameOrId(Collections.USER_COURSE_PROGRESS);
        const progress = new Record(collection);

        // Set the fields
        progress.loadData({
            "user": user.id,
            "course": course.id,
            "completed": false
        });

        // Save the record
        $app.save(progress);
        console.log("Created progress record");

        return e.next();
    } catch (err) {
        console.error("Error in user creation hook:", err);
        return e.next();
    }
}, Collections.USERS);
