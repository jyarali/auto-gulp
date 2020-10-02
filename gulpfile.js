var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')({
        pattern: '*'
    });
var autoprefixerOptions = {
    browsers: ['last 2 versions', 'ie >= 9', 'and_chr >= 2.3']
};
gulp.task('sass', async function () {
    gulp.src('./src/scss/*.scss')
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass())
        .pipe(plugins.autoprefixer(autoprefixerOptions))
        .pipe(plugins.cleanCss())
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest('./dist/css/'))
        .pipe(plugins.browserSync.stream());
});

gulp.task('js', async function () {
    gulp.src('./src/js/*.js')
        .pipe(plugins.uglify())
        .pipe(gulp.dest('./dist/js/'))
        .pipe(plugins.browserSync.stream());
});

gulp.task('index', async function () {
    var target = gulp.src('./index.html');
    // It's not necessary to read the files (will speed up things), we're only after their paths:
    var sources = gulp.src(['./dist/**/*.js', './dist/**/*.css'], {
        read: false
    });

    target.pipe(plugins.inject(sources))
        .pipe(gulp.dest('./'))
        .pipe(plugins.browserSync.stream());
});

gulp.task('serve', gulp.series(['sass', 'js', 'index']), function () {
    plugins.browserSync.init({
        server: "./"
    });
    gulp.watch("./src/scss/*.scss", gulp.parallel(['sass']));
    gulp.watch("./src/js/*.js", gulp.parallel(['js']));
    gulp.watch("./*.html", gulp.parallel(['index']));
});
gulp.task('default', gulp.parallel(['serve']));