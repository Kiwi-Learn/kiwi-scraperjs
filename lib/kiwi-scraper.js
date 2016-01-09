'use strict';
let got = require('got');
let fs = require('fs');
let _ = require('lodash');
let cheerio = require('cheerio');
let tempFilePath = './index.html';
let Fuse = require('fuse.js');

class KiwiScraper {
  constructor(opts) {
    this.URL = 'www.sharecourse.net/sharecourse/course/view/courseList';
    if (opts) {
      this.forceUpdate = opts.forceUpdate || false;
    } else {
      this.forceUpdate = false;
    }

    if (this.forceUpdate) {
      this.OFFLINE_HTML = null;
    } else {
      if (fs.existsSync(tempFilePath)) {
        // console.log('Offline HTTML');
        this.OFFLINE_HTML = fs.readFileSync(tempFilePath);
      } else {
        // console.log('Fire HTTP req to get HTTML');
        this.OFFLINE_HTML = null;
      }
    }
  }

  parseHTML(domTree) {
    let $ = domTree;
    let courses = [];
    let coursesID = [];
    let coursesName = [];
    let coursesDate = [];
    let coursesFees = [];
    let coursesURL = [];
    let coursesInstitution = [];
    let gbmidClassTag = $('.gb_mid p b');
    let coursesNameIDTag = $('#courseName');
    let coursesDateIDTag = $('#courseDate');
    let divOnclickTag = $('div[onclick]');
    let institutionTag = $('.teacher_desc');

    divOnclickTag.each((index, el) => {
      coursesURL.push($(el).attr('onclick').split('=')[1].split('\'')[1]);
    });

    coursesNameIDTag.each((index, el) => {
      coursesName.push($(el).text());
    });

    coursesDateIDTag.each((index, el) => {
      if ($(el).text().startsWith('課程時間')) {
        coursesDate.push($(el).text().split('：')[1]);
      }
    });

    gbmidClassTag.each((index, el) => {
      let courseObj = {};
      if ($(el).text().startsWith('課程編號')) {
        coursesID.push($(el).text().split('：')[1]);
      }
    });

    gbmidClassTag.each((index, el) => {
      let courseObj = {};
      if ($(el).text().startsWith('課程費用')) {
        coursesFees.push($(el).text().split('：')[1]);
      }
    });

    institutionTag.each((index, el) => {
      if ($(el.childNodes[1]).text()) {
        coursesInstitution.push($(el.childNodes[1]).text());
      } else {
        coursesInstitution.push('None');
      }
    });

    let coursesGroup = _.zip(coursesID, coursesDate, coursesName, coursesFees, coursesURL, coursesInstitution);

    for (let i of coursesGroup) {
      let a = _.zipObject([
        'id',
        'date',
        'name',
        'fees',
        'url',
        'institution',
      ], i);
      courses.push(Object.assign({}, a));
    }

    return courses;
  }

  getCourseObjectByID(id, callback) {
    let coursesIDtoObject = {};
    this.listCourses((err, courses) => {
      for (let i of courses) {
        coursesIDtoObject[i.id] = i;
      }

      callback(null, coursesIDtoObject[id]);
    });
  }

  getCourseNameByID(id, callback) {
    this.listCourses((err, courses) => {
      var found = _.result(_.find(courses, (obj) => {
        return obj.id === id;
      }), 'name');
      callback(null, found);
    });

  }

  listCourses(callback) {
    if (this.OFFLINE_HTML) {
      let offlineCourses = this.parseHTML(cheerio.load(this.OFFLINE_HTML));
      callback(null, offlineCourses);
    } else {
      got(this.URL)
        .then(response => {
          let courses = this.parseHTML(cheerio.load(response.body));

          // Save it!
          fs.writeFile(tempFilePath, response.body, (err) => {});
          callback(null, courses);
        }).catch(error => {
          console.error(error.response.body);
        });
    }
  }

  searchCourse(keyword, callback) {
    let coursesIDtoObject = {};
    this.listCourses((err, courses) => {
      for (let i of courses) {
        coursesIDtoObject[i.id] = i;
      }

      let options = { keys: ['name'], id: 'id' };
      let f = new Fuse(courses, options);
      let results = f.search(keyword);
      let foundCoursesArr = [];

      for (let i of results) {
        foundCoursesArr.push(coursesIDtoObject[i]);
      }

      callback(null, foundCoursesArr);
    });
  }

}

module.exports = KiwiScraper;
