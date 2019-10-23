'use strict';

/* Подключаемые модули */
const gulp = require("gulp");
const sass = require("gulp-sass");
const plumber = require("gulp-plumber");
const include = require('gulp-file-include');
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const minify = require("gulp-csso");
const minifyJS = require('gulp-uglify');
const rename = require("gulp-rename");
const server = require("browser-sync").create();
const imagemin = require("gulp-imagemin");
const svgssprite = require("gulp-svgstore");
const spriteSmith = require("gulp.spritesmith");
const merge = require('merge-stream');
const del = require("del");
const debug = require("gulp-debug");
const newer = require("gulp-newer");
const cache = require('gulp-cache');
const sourcemaps = require("gulp-sourcemaps");

// const run = require("run-sequence");

// const path = {
//   build: 'build/',
//   source: 'source/',
// };

/* HTML */
gulp.task('html', function () {
  return gulp.src('source/*.html')                 //
    .pipe(plumber())                                    //
    .pipe(include())                                    //
    .pipe(gulp.dest('build'))                        //
});

/* STYLES */
gulp.task('styles', function () {
  return gulp.src('source/sass/style.scss')      //
    .pipe(sourcemaps.init())                            // Инициализация карты кода
    .pipe(plumber())                                    //
    .pipe(sass({                                        //
      outputStyle: 'expanded'                           //
    }).on('error', sass.logError))                      //
    .pipe(postcss([                                     //
      autoprefixer({                                    //
        cascade: false
      })
    ]))
    .pipe(gulp.dest('build/css'))                //
    .pipe(minify())                                     //
    .pipe(rename('style.min.css'))                      //
    .pipe(sourcemaps.write('.'))                        //
    .pipe(gulp.dest('build/css'))                //
    .pipe(server.stream());                             //
});

/* JAVASCRIPT */
gulp.task('js', function () {
  return gulp.src('source/js/all.js')           //
    .pipe(plumber())                                    //
    .pipe(include())                                    //
    .pipe(rename('main.js'))                            //
    .pipe(gulp.dest('build/js'))                 //
    .pipe(minifyJS())                                   //
    .pipe(rename('main.min.js'))                        //
    .pipe(gulp.dest('build/js'))                 //
});

/* SERVER */
gulp.task('server', function () {
  server.init({
    server: 'build/',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  /* Следим за файлами и перезагружаем страницу если были изменения */
  gulp.watch('source/**/*.html', gulp.series('html')).on('change', server.reload);
  gulp.watch('source/js/**/*.js', gulp.series('js')).on('change', server.reload);
  gulp.watch('source/sass/**/*.{scss,sass}', gulp.series('styles'));                                // Обновление страницы браузера в задаче 'styles'
  gulp.watch('source/images/**/*.{png,jpg,svg}', gulp.series('images')).on('change', server.reload);
  gulp.watch('source/svg/**/*.svg', gulp.series('svgsprite')).on('change', server.reload);
  gulp.watch('source/fonts/**/*.*', gulp.series('copy')).on('change', server.reload);
});

/* PNG SPRITES */
gulp.task('pngsprite', function () {
  const spriteData = gulp.src('source/images/icons/**/*.png').pipe(spriteSmith({
    imgName: 'sprite.png',
    imgPath: "../images/sprite.png",
    retinaImgName: 'sprite@2x.png',
    retinaSrcFilter: 'source/images/icons/**/*/*@2x.png',
    retinaImgPath: "../images/sprites/sprite@2x.png",
    cssName: 'sprite.scss',
    algorithm: 'binary-tree',
    padding: 8
  }));

  const cssStream = spriteData.css.pipe(gulp.dest('source/sass/mixins'));
  const imgStream = spriteData.img.pipe(gulp.dest('build/images'));

  return merge(imgStream, cssStream);
});


/* SVG SPRITES */
gulp.task("svgsprite", function () {
  return gulp.src("source/svg/**/*.svg")
    .pipe(svgssprite({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("source/images"));
});


/* MINIFY IMAGES */
gulp.task("imagesmin", function () {
  return gulp.src("source/images/**/*.{png,jpg,svg}")
    .pipe(newer("build/img"))
    // (cache
    .pipe(imagemin([
        imagemin.optipng({
          optimizationLevel: 3
        }),
        imagemin.jpegtran({
          progressive: true
        }),
        imagemin.svgo({
          plugins: [{
              removeViewBox: false
            },
            {
              cleanupIDs: false
            }]
          })
        ]))
      // )
    .pipe(debug({title: 'imagesmin'}))
    .pipe(gulp.dest("build/img"))
    // .pipe(server.stream());
});


/* IMAGES */
gulp.task('images', gulp.series('pngsprite', 'imagesmin', function (done) {
  done();
}));

/* COPY FILES FROM SOURCE */
gulp.task('copy', function () {
  return gulp.src([
      'source/fonts/**/*.{woff,woff2,otf,ttf}',
      'source/*.ico'
    ], {
      base: 'source'
    }, {
      since: gulp.lastRun('copy')
    })
    .pipe(newer('build'))
    .pipe(debug({
      title: 'copy'
    }))
    .pipe(gulp.dest('build'));
});

/* REMOVE OLD BUILD */
gulp.task('clean', function () {
  return del('build');
});


/* TASKS */
gulp.task('build', gulp.series('clean', 'styles', 'svgsprite', 'copy', 'html', 'js', 'images', 'server'));
gulp.task('dev', gulp.series('styles', 'copy', 'html', 'js', 'images', 'server'));
