const gulp = require('gulp')
const jetpack = require('fs-jetpack')
const stylefmt = require('gulp-stylefmt')

const cssDir = jetpack.cwd('src/css')

gulp.task('stylefmt', () =>
  gulp.src(cssDir.path('*.scss'))
    .pipe(stylefmt())
    .pipe(gulp.dest(cssDir.path()))
)
