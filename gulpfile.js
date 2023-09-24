const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const concatCSS = require('gulp-concat-css');
const clean = require('gulp-clean');
const replace = require('gulp-replace');

function defaultTask(cb) {
  cb();
}

gulp.task('clean', function () {
  return gulp.src(['dist'], { read: false })
    .pipe(clean());
});

gulp.task('copy', () => {
  return gulp.src('src/**/*')
    .pipe(gulp.dest('dist'));
});

gulp.task('static-files', async function () {
  return gulp.src([
    'src/**/*.html',
    'src/**/*',
    '!src/css/**/*',])
    .pipe(gulp.dest('dist'));
})

gulp.task('minify-css', () => {
  return gulp.src('src/css/**/*.css')
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(gulp.dest('dist'));
});

gulp.task('concat-css', () => {
  return gulp.src('src/**/*.css')
    .pipe(concatCSS('css/budles.css'))
    .pipe(gulp.dest('dist'));
});

gulp.task('otimiza-css', () => {
  return gulp.src('src/css/**/*.css')
    .pipe(concatCSS('css/budles.css'))
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(replace(/(\.\.\/)+/g, '../'))
    .pipe(gulp.dest('dist'));
});

gulp.task('replace-css', () => {
  return gulp.src('src/**/*.html')
    .pipe(replace(
      /<!-- build -->([\s\S]*?)<!-- endBuild -->/g, 
      '<link rel="stylesheet" href="./css/budles.css">'))
    .pipe(gulp.dest('dist'));
});

gulp.task('build', gulp.series(
  'clean',
  'static-files',
  'otimiza-css',
  'replace-css',
))

exports.default = defaultTask