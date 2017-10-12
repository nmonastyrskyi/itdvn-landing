var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var pug = require('gulp-pug');
var gulp = require('gulp');
var sass = require('gulp-sass');
var spritesmith = require('gulp.spritesmith');
var rimraf = require('rimraf');
var rename = require("gulp-rename");
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');


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
  return gulp.src('src/template/index.pug')
  .pipe(pug({
    pretty: true
  }))
  .pipe(gulp.dest('app'))
});

		//CSS BUILD
gulp.task('css:build', function () {
    return gulp.src('src/styles/main.scss')
    
      .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
      .pipe(autoprefixer({
      browsers: ['last 2 versions'], 
      cascade: false
      }))
      .pipe(rename('main.min.css'))
    
    .pipe(gulp.dest('app/css'));
});



		// SPRITE
gulp.task('sprite', function (cb) {
  var spriteData = gulp.src('src/img/icons/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    imgPath: '../img/sprite.png',
    cssName: 'sprite.scss'
  }));
  spriteData.img.pipe(gulp.dest('app/img/'));
  spriteData.css.pipe(gulp.dest('src/styles/global/'));
  cb();
});
 

//DELETE
gulp.task('clean', function del(cb) {
  return rimraf('app', cb);
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
		gulp.watch('src/styles/**/*.scss', gulp.series('css:build'))
})

gulp.task('default', gulp.series(
	'clean',
	gulp.parallel('templates:compile', 'css:build', 'sprite', 'copy'),
	gulp.parallel('watch', 'server')
	)
);