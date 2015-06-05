'use strict';

var gulp = require('gulp');
var bower = require('main-bower-files');
var gulpFilter = require('gulp-filter');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var babel = require('gulp-babel');
var clean = require('gulp-rimraf');
//var debug = require('gulp-debug');


var getDist = function(vendor) {
  var publicDir = 'public';
  var dist = vendor ? publicDir + '/vendor' : publicDir;
  return {
    dir: dist,
    css: dist + '/css/',
    js: dist + '/js/',
    fonts: dist + '/fonts/',
    images: dist + '/images/'
  };
};

gulp.task('clean', function() {
  return gulp.src(getDist().dir, {read: false})
    .pipe(clean({force: true}));
});

gulp.task('bower', function() {
  var dist = getDist(true);
  var jsFilter = gulpFilter('**/*.js');
  var cssFilter = gulpFilter('**/*.css');
  var fontsFilter = gulpFilter(['**/*.woff*', '**/*.eot', '**/*.svg', '**/*.ttf']);
  return gulp.src(bower())
    .pipe(fontsFilter)
    .pipe(gulp.dest(dist.fonts))
    .pipe(fontsFilter.restore())
    .pipe(jsFilter)
    .pipe(gulp.dest(dist.js))
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe(gulp.dest(dist.css))
    .pipe(cssFilter.restore());
});

gulp.task('client', function() {
  var dist = getDist();
  var jsFilter = gulpFilter('**/*.js');
  var cssFilter = gulpFilter('**/*.css');
  var imageFilter = gulpFilter('**/images/*');

  gulp.src('client/**')
    .pipe(jsFilter)
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest(dist.dir))
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe(minifyCSS())
    .pipe(gulp.dest(dist.dir))
    .pipe(cssFilter.restore())
    .pipe(imageFilter)
    .pipe(gulp.dest(dist.dir));
});

gulp.task('default', ['clean'], function() {
  return gulp.start(['client', 'bower']);
});
