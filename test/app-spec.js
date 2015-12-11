'use strict';
let KiwiScraper = require('../index.js');
let should = require('should');

describe('KiwiScraper', function() {
  this.timeout(30000);

  describe('#listCourses()', () => {
    it('should list courses without error', (done) => {
      let ks = new KiwiScraper();
      ks.listCourses((err, courses) => {
        if (err) throw err;
        courses.should.be.a.Array;
        for (let course of courses) {
          course.should.have.property('id');
          course.should.have.property('date');
          course.should.have.property('name');
          course.should.have.property('fees');
          course.should.have.property('url');
        }

        done();
      });
    });
  });

  describe('#searchCourse()', () => {
    it('should search courses without error', (done) => {
      let ks = new KiwiScraper();
      ks.searchCourse('program', (err, courses) => {
        if (err) throw err;
        courses.should.be.a.Array;
        for (let course of courses) {
          course.should.have.property('id');
          course.should.have.property('date');
          course.should.have.property('name');
          course.should.have.property('fees');
          course.should.have.property('url');
        }

        done();
      });
    });

  });

  describe('#getCourseNameByID()', () => {
    it('should get EE62002 course nameby ID', (done) => {
      let ks = new KiwiScraper();
      ks.getCourseNameByID('EE62002', (err, name) => {
        if (err) throw err;
        should(name).eql('小型風力機系統與國際認證 (104 秋季班)');
        done();
      });
    });

  });

  describe('#getCourseObjectByID()', () => {
    it('should get courses object by ID without error', (done) => {
      let ks = new KiwiScraper();
      ks.getCourseObjectByID('EE62002', (err, course) => {
        if (err) throw err;
        course.should.have.property('id');
        course.should.have.property('date');
        course.should.have.property('name');
        course.should.have.property('fees');
        course.should.have.property('url');
        done();
      });
    });

  });

});
