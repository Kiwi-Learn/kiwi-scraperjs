'use strict';
let KiwiScraper = require('../index.js');

let opts = {
  forceUpdate: true,
};

let ks = new KiwiScraper(opts);

// Show all courses list
ks.listCourses((err, courses) => {
  console.log(courses);
});

// Fuzzy search for courses object. return courses objects
ks.searchCourse('program', (err, res) => {
  console.log(res);
});

// Courses ID to courses name. return a course name
ks.getCourseNameByID('EE62002', (err, res) => {
  console.log(res);
});

// Courses ID to courses object. return a course object
ks.getCourseObjectByID('EE62002', (err, res) => {
  console.log(res);
});
