var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var pug = require('gulp-pug');
var gulp = require('gulp');
var sass = require('gulp-sass');
var spritesmith = require('gulp.spritesmith');
var rimraf = require('rimraf');
var rename = require("gulp-rename");

				// SERVER 
gulp.task('server', function() {
    browserSync.init({
        server: {
        	port: 9000,
            baseDir: "app"
        }
    });

    gulp.watch('app/**/*').on('change', browserSync.reload)
});

			// PUG COMPILE
gulp.task('templates:compile', function buildHTML() {
  return gulp.src('src/template/index.pug')/**/
  .pipe(pug({
    pretty: true
  }))
  .pipe(gulp.dest('app'))
});

		// SASS COMPILE
gulp.task('sass', function () {
  return gulp.src('src/styles/main.sass')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename('main.min.css'))
    .pipe(gulp.dest('app/css'))
});

		// SPRITE
gulp.task('sprite', function () {
  var spriteData = gulp.src('src/img/icons/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    imgPath: '../img/sprite.png',
    cssName: 'sprite.sass'
  }));
  spriteData.img.pipe(gulp.dest('app/img/'));
  spriteData.css.pipe(gulp.dest('src/styles/global/'))
  cb();
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./sass/**/*.scss', ['sass']);
});


//DELETE
gulp.task('clean', function (cb) {
   rimraf('app', cb);
});

//COPY FONTS
gulp.task('copy:fonts', function(){
	return gulp.src('./src/fonts/**/*.*')
	.pipe(gulp.dest('app/fonts'))
})

//COPY IMAGES
gulp.task('copy:images', function(){
return gulp.src('./src/img/**/*.*')
.pipe(gulp.dest('app/img'))
})

//COPY
gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'))

//WATCHERS
gulp.task('watch', function(){
	gulp.watch('src/template/**/*.pug', gulp.series('templates:compile'));
		gulp.watch('src/styles/**/*.sass', gulp.series('sass'))
})

gulp.task('default', gulp.series(
	'clean',
	gulp.parallel('templates:compile', 'sass', /*'sprite',*/ 'copy'),
	gulp.parallel('watch', 'server')
	)
);