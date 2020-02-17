const { parallel, series, src, dest, watch } = require("gulp"),
  prefixer = require("gulp-autoprefixer"),
  uglify = require("gulp-uglify"),
  sass = require("gulp-sass"),
  cssmin = require("gulp-minify-css"),
  cleaner = require("gulp-clean"),
  browserSync = require("browser-sync"),
  terser = require("gulp-terser"),
  path = {
    build: {
      html: "build/",
      js: "build/js/",
      css: "build/css/",
      img: "build/img/"
    },
    src: {
      html: "src/*.html",
      js: "src/js/*.js",
      style: "src/style/*.scss",
      img: "src/img/*.{png,jpg,svg}"
    },
    watch: {
      html: "src/**/*.html",
      js: "src/js/**/*.js",
      style: "src/style/**/*.scss",
      img: "src/img/*.{png,jpg,svg}"
    },
    clean: "./build"
  };

function html() {
  return src(path.src.html).pipe(dest(path.build.html));
}
function css() {
  return src(path.src.style)
    .pipe(sass())
    .pipe(prefixer())
    .pipe(cssmin())
    .pipe(dest(path.build.css));
}
function js() {
  return src(path.src.js, { sourcemaps: true })
    .pipe(terser())
    .pipe(dest(path.build.js, { sourcemaps: true }));
}
function img() {
  return src(path.src.img).pipe(dest(path.build.img));
}
function clean() {
  return src(path.clean, { allowEmpty: true }).pipe(cleaner());
}
function dev() {
  browserSync.init({
    server: {
      baseDir: "./build"
    },
    notify: true
  });
  watch(path.watch.html, html).on("change", browserSync.reload);
  watch(path.watch.style, css).on("change", browserSync.reload);
  watch(path.watch.js, js).on("change", browserSync.reload);
  watch(path.watch.img, img);
}

exports.js = js;
exports.css = css;
exports.html = html;
exports.img = img;
exports.clean = clean;
exports.dev = dev;

exports.default = series(clean, parallel(html, js, css, img));
