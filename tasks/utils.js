const gulp = require('gulp')
const jetpack = require('fs-jetpack')

const destDir = jetpack.cwd('./lib')

gulp.task('clean', () => destDir.dir('.', { empty: true }))
