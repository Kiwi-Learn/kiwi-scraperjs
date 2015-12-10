# kiwi-scraperjs

This is `Node.js` implementation for [kiwi-scraper](https://github.com/Kiwi-Learn/kiwi-scraper)

# Installation

```sh
npm install kiwi-scraperjs
```

# Example Usage

```javascript
'use strict';
let KiwiScraper = require('kiwi-scraperjs');

let ks = new KiwiScraper();

// Get Courses list
ks.getCourses((err, res) => {console.log(res);});

// fuzzy search Object return object
console.log(ks.searchCourseName('program'));

// Courses ID to Courses Object return object
console.log(ks.coursesIDtoObject);

// Get Course Name by Course ID return string
console.log(ks.getCourseNameByID('EE62002'));
```
