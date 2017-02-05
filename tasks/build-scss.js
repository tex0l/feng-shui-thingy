const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const jetpack = require('fs-jetpack')
const postCSS = require('gulp-postcss')
const gulp = require('gulp')
const sass = require('gulp-sass')
const sourcemaps = require('gulp-sourcemaps')

require('./utils')

const srcDir = jetpack.cwd('src/css')
const destDir = jetpack.cwd('lib/css')

gulp.task('build-scss', ['clean'], () =>
  gulp.src(srcDir.path('*.scss'))
    .pipe(sourcemaps.init())
    .pipe(sass({noCache: true}))
    .pipe(postCSS([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(destDir.path()))
)
