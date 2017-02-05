const alias = require('rollup-plugin-alias')
const babel = require('rollup-plugin-babel')
const buffer = require('vinyl-buffer')
const commonJs = require('rollup-plugin-commonjs')
const gulp = require('gulp')
const jetpack = require('fs-jetpack')
const merge = require('merge-stream')
const nodeResolve = require('rollup-plugin-node-resolve')
const path = require('path')
const rollup = require('rollup-stream')
const source = require('vinyl-source-stream')
const rollupSourceMaps = require('rollup-plugin-sourcemaps')
const sourceMaps = require('gulp-sourcemaps')
require('./utils')

const srcDir = jetpack.cwd('./src/js')
const destDir = jetpack.cwd('./lib/js')
const nodeModules = jetpack.cwd('./node_modules')

const jsFiles = [
  srcDir.path('index.js')
]

const bundle = (filePath, destPath) =>
  rollup({
    entry: filePath,
    format: 'iife',
    plugins: [
      rollupSourceMaps(),
      alias({
        'vue': nodeModules.path('vue/dist/vue.js')
      }),
      babel({
        exclude: 'node_modules/**',
        plugins: [
          'syntax-async-functions',
          'transform-async-to-generator',
          'transform-runtime'
        ],
        presets: ['es2015-rollup'],
        runtimeHelpers: true
      }),
      nodeResolve({
        browser: true,
        main: true,
        preferBuiltins: false
      }),
      commonJs({
        include: 'node_modules/**'
      })
    ],
    sourceMap: true,
    moduleName: path.basename(filePath, '.js')
  })
    .pipe(source(path.basename(filePath)))
    .pipe(buffer())
    .pipe(sourceMaps.init({loadMaps: true}))
    .pipe(sourceMaps.write('.'))
    .pipe(gulp.dest(destPath))

gulp.task('build-js', ['clean'], () => merge(jsFiles.map(file => bundle(file, destDir.path()))))
