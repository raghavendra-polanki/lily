'use strict';

const gulp = require('gulp');
const eslint = require('gulp-eslint');

gulp.task('js-lint', () => {
  return gulp.src([
    __dirname + '/application/**/*.js',
    '!' + __dirname + '/node_modules{,/**}',
    // TODO(surenderthakran): remove this filter when vidnetserver is deleted.
    '!' + __dirname + '/vidnetserver{,/**}'])
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('watch', () => {
  gulp.watch([
    __dirname + '/application/**/*.js',
    '!' + __dirname + '/node_modules{,/**}',
  ], ['js-lint']);
});
