/**
 * Created by projo on 2017-08-20.
 */
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

// gulp.task(name, deps, func)
// name - task의 이름을 지정하고, 이름에는 공백이 포함되어서는 안됩니다.
// deps - 현재 선언하고 있는 task를 수행하기 전에 먼저 실행되어야하는 task들의 배열 목록을 작성할 수 있습니다. 위의 예제에서는 JavaScript 파일을 병합하는 task를 진행하기 전에 JavaScript Lint(자바스크립트 문법 검사)를 먼저 수행하도록 정의되어 있습니다. (물론 그 전에 lint-js task를 이 task보다 앞에 작성해주어야 먼저 수행할 수 있을 것입니다.)
// func - 실제 수행할 업무 프로세스를 정의하는 function 입니다.(처리해야할 일을 정의)

// stripDebug는 모든 console.log 들과 alert 들을 제거해주는 gulp 모듈 패키지입니다.
// concat('scriptAll.js') 로 파이핑해주는데, 이건 console.log와 alert이 제거되고 압축된 모든 파일들을 scriptAll.js 파일 하나로 병합해 줄 것입니다.

var src = {
    sass : 'src/sass/*.scss'
};
var dest = {
    sass : 'public/stylesheets'
}

gulp.task('bulid-sass', function(){
    return gulp
        .src(src.sass)
        // .sass 빌드
        .pipe(concat('style_test.css'))
        .pipe(gulp.dest(dest.sass))

        .pipe(uglify)
        .pipe(rename('style_test.min.css'))
        .pipe(gulp.dest(dest.sass))
});

gulp.task('watch', function(){

    gulp.watch(src.sass,['build-sass', 'watch']);

});

gulp.task('default', ['build-sass']);