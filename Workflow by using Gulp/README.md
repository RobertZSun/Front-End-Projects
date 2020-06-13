# Managing the workflow by using Gulp and plugins
Author:  Robert Z.Sun

***

adopted **browser-sync** & **watch** to generate and auto reload the webpage and sync when any of the html/css/scss/js file has changed

used **gulp-babel** to deal with the js using ES6 so that some old browser could use the js file

used **autoprefixer** to handle the compatibility of different browser

used **cssnano** and **gulp-sourcemaps** to minimize the css file and let the debug much easier by having a sourcemap file

used **del** to clear the destination(mine is build) folder, and then write those processed files





## How to run the project


 ##### First
```
	npm install
```
##### Second
```
	gulp
```



##### Then these info will show up and you are good to go

```
PS D:\myWeb\ajax\Gulp> gulp
[19:24:40] Using gulpfile D:\myWeb\ajax\Gulp\gulpfile.js
[19:24:40] Starting 'default'...
[19:24:40] Starting 'clean'...
[19:24:40] Finished 'clean' after 19 ms
[19:24:40] Starting 'html'...
[19:24:40] Starting 'css'...
[19:24:40] Starting 'js'...
[19:24:40] Finished 'html' after 11 ms
[19:24:40] Finished 'css' after 18 ms 
[19:24:40] Finished 'js' after 20 ms  
[19:24:40] Starting 'server'...       
[19:24:40] Finished 'server' after 10 ms
[19:24:40] Starting 'watcher'...        
[19:24:40] Finished 'watcher' after 15 ms
[19:24:40] Finished 'default' after 69 ms
[Browsersync] Access URLs:
 --------------------------------------  
       Local: http://localhost:3000      
    External: http://192.168.2.182:3000  
 --------------------------------------  
          UI: http://localhost:3001      
 UI External: http://localhost:3001      
 --------------------------------------  
[Browsersync] Serving files from: ./build
```



##### Any changes to the *.html, *.scss, *.css, *.js will auto rebuild the project including processing those files and sync those changes to the webpage and reload automatically





##### PS： my   gulpfile.js for reference

```javascript
// import APIs from gulp
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

// ***************************
//  Please define your destination and origin these two directories first
// ***************************
const origin = './src';
const destination = './build';

async function clean(cb) {
    await del(destination);
    cb();
}


function html(cb) {
    src(`${origin}/**/*.html`).pipe(dest(`${destination}`));
    cb();
}

function css(cb) {
   
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

function js(cb) {

    src(`${origin}/js/lib/**/*.js`).pipe(dest(`${destination}/js/lib`));
    src(`${origin}/js/script.js`)
        .pipe(babel({
            // compact: false,  // if you want to key the file structure without compaction please uncomment this
            presets: ['@babel/preset-env']
        }))
        // .pipe(concat('build.js'))    // if you want to compress all the js files into one uncomment this
        .pipe(dest(`${destination}/js`));
    cb();
}

function watcher(cb) {    
    // change below could be all which is to audit all the modification or adjustment including del and add
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
        notify: false, // if you want the notification at the beginning when loading the webpage set to true
        open: false, //if you want to open browser automatically after run gulp command then set to true
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
```



