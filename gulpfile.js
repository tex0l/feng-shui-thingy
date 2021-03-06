const gulp = require('gulp')

require('./tasks/build-js')
require('./tasks/copy-html')
require('./tasks/build-scss')
require('./tasks/copy-resources')
require('./tasks/format-css')

gulp.task('build', ['build-js', 'build-scss', 'copy-html', 'copy-resources'])
