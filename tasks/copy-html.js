const gulp = require('gulp')
const jetpack = require('fs-jetpack')

require('./utils')

const srcDir = jetpack.cwd('./src')
const destDir = jetpack.cwd('./lib')

gulp.task('copy-html', ['clean'], () => {
  srcDir.copy('.', destDir.path(), {
    overwrite: true,
    matching: '**/*.html'
  })
})
