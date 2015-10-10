require('babel/register');  //allows mocha to pick up babel
var gulp = require('gulp');
var mocha = require('gulp-mocha');
var babel = require('gulp-babel');
var eslint = require('gulp-eslint');
var argv = require('yargs').argv;
var bower = require('main-bower-files');
var gulpFilter = require('gulp-filter');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var babelify = require('babelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var minifyCSS = require('gulp-minify-css');
var clean = require('gulp-rimraf');
var devEnvironment = (process.env.NODE_ENV || 'development') === 'development';
var serverDir = 'src/**/*.js';

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

gulp.task('cleanClient', function() {
  return gulp.src(getDist().dir, {read: false})
    .pipe(clean({force: true}));
});

gulp.task('cleanServer', function() {
  return gulp.src('lib', {read: false})
    .pipe(clean({force: true}));
});

gulp.task('bower', function() {
  var dist = getDist(true);
  var jsFilter = gulpFilter('**/*.js', {restore: true});
  var cssFilter = gulpFilter('**/*.css', {restore: true});
  var fontsFilter = gulpFilter(['**/*.woff*', '**/*.eot', '**/*.svg', '**/*.ttf'], {restore: true});
  return gulp.src(bower())
    .pipe(fontsFilter)
    .pipe(gulp.dest(dist.fonts))
    .pipe(fontsFilter.restore)
    .pipe(jsFilter)
    .pipe(gulp.dest(dist.js))
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe(gulp.dest(dist.css));
});

// gulp.task('compileClient', function() {
//   var dist = getDist();
//   var jsFilter = gulpFilter('**/*.js', {restore: true});
//   var cssFilter = gulpFilter('**/*.css', {restore: true});
//   var imageFilter = gulpFilter('**/images/*', {restore: true});

//   gulp.src('client/**')
//     .pipe(jsFilter)
//     .pipe(babel())
//     .pipe(gulpif(!devEnvironment, uglify()))
//     .pipe(gulp.dest(dist.dir))
//     .pipe(jsFilter.restore)
//     .pipe(cssFilter)
//     .pipe(minifyCSS())
//     .pipe(gulp.dest(dist.dir))
//     .pipe(cssFilter.restore)
//     .pipe(imageFilter)
//     .pipe(gulp.dest(dist.dir));
// });

gulp.task('copyAssets', function() {
  var dist = getDist();
  var jsFilter = gulpFilter('vendor/**/*.js', {restore: true});
  var cssFilter = gulpFilter('**/*.css', {restore: true});
  var imageFilter = gulpFilter('**/images/**', {restore: true});

  gulp.src('client/**')
    .pipe(jsFilter)
    .pipe(gulp.dest(dist.dir))
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe(minifyCSS())
    .pipe(gulp.dest(dist.dir))
    .pipe(cssFilter.restore)
    .pipe(imageFilter)
    .pipe(gulp.dest(dist.dir));
});

gulp.task('compileClient', function() {
  var dist = getDist();
  var entries = ['index.js', 'items.js', 'permissions.js', 'settings.js', 'users.js'];

  entries.forEach(function(entry) {
    browserify('client/js/' + entry, { debug: true })
      .transform(babelify)
      .bundle()
      .pipe(source(entry))
      .on('error', function (err) { console.log('Error : ' + err.message); })
      .pipe(gulp.dest(dist.js));
  });
});

gulp.task('lintServer', function () {
  return gulp.src(serverDir)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('compileServer', function() {
  return gulp.src(serverDir)
    .pipe(babel())
    .pipe(gulp.dest('lib'));
});

gulp.task('server', ['cleanServer'], function() {
  return gulp.start(['lintServer', 'compileServer']);
});

gulp.task('client', ['cleanClient'], function() {
  return gulp.start(['bower', 'compileClient', 'copyAssets']);
});

gulp.task('default', ['client', 'server']);

gulp.task('watch', function() {
  gulp.watch('src/**', ['server']);
});

gulp.task('test', function() {
  var options = {
    timeout: argv.timeout || 2000,
    grep: argv.test
  };
  var stream = argv.file ? 'tests/' + argv.file + '.js' : 'tests/*.js';
  return gulp.src(stream, {read: false})
    .pipe(mocha(options));
});
