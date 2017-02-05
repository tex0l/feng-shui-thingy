const gulp = require('gulp')
const jetpack = require('fs-jetpack')

require('./utils')

const srcDir = jetpack.cwd('./src/resources')
const destDir = jetpack.cwd('./lib/resources')

gulp.task('copy-resources', ['clean'], () => {
  srcDir.copy(
    '.',
    destDir.path(),
    {
      overwrite: true,
      matching: '**/*'
    }
  )
})
