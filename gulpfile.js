//dependencies
var gulp = require('gulp');
var util = require('gulp-util');
var SystemBuilder = require('systemjs-builder');
var watch = require('gulp-watch');
var ts = require('gulp-typescript');
var tsConfig = require('./tsconfig.json');
var connect = require('gulp-connect');
var rimraf = require('gulp-rimraf');
var tslint = require('gulp-tslint');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var annotate = require('gulp-ng-annotate');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var jshintfileoutput = require('gulp-jshint-html-reporter');

var onError = function (err) {
  console.log(err);
};

//Typescript Config;
var tsProject = ts.createProject(tsConfig.compilerOptions);


gulp.task('jshint', function () {
  //gulp.task('jshint', ['copy', 'tscompile'], function () {
  return gulp.src(['./dist/**/*.js'])
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('gulp-jshint-html-reporter', {filename: 'jshint-output.html'}))
    ;
});


//copy dependencies to dist folder
gulp.task('copy:deps', function(){
  return gulp.src([
    'node_modules/angular2/bundles/angular2-polyfills.js',
    'node_modules/angular2/bundles/angular2.dev.js',
    'node_modules/angular2/bundles/http.js',
    'node_modules/angular2/bundles/router.js',
    'node_modules/rxjs/bundles/Rx.js',
    'node_modules/systemjs/dist/system.js',
    'node_modules/systemjs/dist/system.js.map',
    'node_modules/tether/dist/js/tether.min.js'
  ]).pipe(gulp.dest('dist/vendor'));
});

//copy html/css/js files
gulp.task('copy:src', function(){
  return gulp.src([
    'src/app/assets/**/*.*',
    'src/bootstrap.js',
    'src/index.html',
    'src/**/*.html',
    'src/**/*.css'
  ])
    // .pipe(plumber({
    //   errorHandler: onError
    // }))
    // .pipe(ngAnnotate())
    // .pipe(imagemin({ progressive: true, optimizationLevel: 7, use: [pngquant()] }))
    .pipe(gulp.dest('dist'))
  .pipe(connect.reload());
});

//clean the dist folder
gulp.task('clean', function(cb){
  rimraf('./dist', cb);
})

//compile app typescript files
gulp.task('compile:app', function(){
  return gulp.src('src/**/*.ts')
    .pipe(ts(tsProject))
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload());
});

//live reload server
gulp.task('server', ['copy:deps', 'copy:src','compile:app'], function() {
  connect.server({
    root: 'dist',
    livereload: true,
    fallback: 'dist/index.html'
  });
});

// linting
gulp.task('tslint', function() {
  return gulp.src('app/**/*.ts')
    .pipe(tslint())
    .pipe(tslint.report('verbose'));
});

//default task
gulp.task('default', ['server'], function(){
  gulp.watch(['src/**/*.ts'], ['compile:app']);
  gulp.watch(['src/**/.js', 'src/**/*.html'], ['copy:src']);
  gulp.watch(['src/**/.js'], ['jshint:src']);
});


