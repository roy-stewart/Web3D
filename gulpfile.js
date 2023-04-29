const { series, parallel, src, dest, watch } = require('gulp')
const gulpClean = require('gulp-clean')
const webpack = require('webpack-stream')
const minifyHTML = require('gulp-htmlmin')
const cleanCSS = require('gulp-clean-css')
const browserSync = require('browser-sync').create()

const clean = () => {
    return src('build/', { allowEmpty: true }).pipe(gulpClean())
}

const buildStyles = () => {
    return src('src/styles/styles.css')
        .pipe(cleanCSS())
        .pipe(dest('build/styles'))
}

const buildScripts = () => {
    return src('src/scripts/main.js')
        .pipe(
            webpack({
                mode: 'production',
            })
        )
        .pipe(dest('build/scripts'))
}

const buildHtml = () => {
    return src('src/index.html')
        .pipe(minifyHTML({ collapseWhitespace: true }))
        .pipe(dest('build/'))
}

const build = parallel(buildStyles, buildScripts, buildHtml)

exports.clean = clean

exports.build = build

exports.serve = () => {
    browserSync.init({
        server: {
            baseDir: './build/',
        },
        watch: true,
    })

    watch('src/**/*.css', { ignoreInitial: false }, buildStyles)

    watch('src/**/*.js', { ignoreInitial: false }, buildScripts)

    watch('src/**/*.html', { ignoreInitial: false }, buildHtml)
}

exports.default = series(gulpClean, build)
