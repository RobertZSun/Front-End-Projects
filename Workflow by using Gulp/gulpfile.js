const {
    src,
    dest,
    series,
    parallel,
    watch
} = require('gulp');
const del = require('del');
const browserSync = require('browser-sync').create();
const babel = require('gulp-babel');
// const concat = require('gulp-concat');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
var sass = require('gulp-sass');
sass.compiler = require('node-sass');
var cssnano = require('cssnano');



const origin = './src';
const destination = './build';

async function clean(cb) {
    await del(destination);
    cb();
}


function html(cb) {
    // src('./src/*.html').pipe(dest('./build'));
    src(`${origin}/**/*.html`).pipe(dest(`${destination}`));
    cb();
}

function css(cb) {
    // src('./src/*.html').pipe(dest('./build'));
    src(`${origin}/css/animate.css`).pipe(dest(`${destination}/css`));


    src(`${origin}/css/**/*.scss`)
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(sourcemaps.init())
        .pipe(postcss([autoprefixer({overrideBrowserslist: ['last 1 version']}),cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(`${destination}/css`));
    cb();
}

function sass(cb) {

    cb();
}

function js(cb) {
    // src(`${origin}/js/**/*.js`).pipe(dest(`${destination}/js`));
    src(`${origin}/js/lib/**/*.js`).pipe(dest(`${destination}/js/lib`));

    src(`${origin}/js/script.js`)

        .pipe(babel({
            // compact: false,
            presets: ['@babel/preset-env']
        }))
        // .pipe(concat('build.js'))
        .pipe(dest(`${destination}/js`));
    cb();
}

function watcher(cb) {
    // watch(`${origin}/css/**/*.css`, {
    //     events: 'all'
    // }, function (cb) {
    //     // body omitted
    //     cb();
    // });
    watch(`${origin}/*.html`, {
        ignoreInitial: false
    }).on('change', series(html, browserSync.reload));
    watch(`${origin}/css/**/*.scss`, {
        ignoreInitial: false
    }).on('change', series(css, browserSync.reload));
    watch(`${origin}/js/**/*.js`, {
        ignoreInitial: false
    }).on('change', series(js, browserSync.reload));
    cb();
}

function server(cb) {
    browserSync.init({
        notify: false,
        open: false,
        server: {
            baseDir: destination
        }
    })
    cb();
}

exports.clean = clean;
exports.html = html;
exports.css = css;
exports.js = js;

exports.default = series(clean, parallel(html, css, js), server, watcher);