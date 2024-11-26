import fs from "fs";
import gulp from "gulp";
import concat from "gulp-concat";
import uglify from "gulp-uglify";
import htmlmin from "gulp-htmlmin";
import cssnano from "gulp-cssnano";

const HTML_FILES = "src/views/**/*.html";
const HTML_XECO = "src/views/xeco/**/*";
const HTML_IRSE = "src/views/irse/**/*";

const JS_FILES = "src/public/js/**/*.js";
const JS_ROOT = "src/public/js/*.js";

const CSS_FILES = "src/public/css/**/*.css";
const TS_FILES = [ "src/**/*.ts", "src/**/*.tsx" ];
const JS_SRC = [ "src/*.js", "src/dao/**/*", "src/data/**/*", "src/i18n/**/*", "src/lib/**/*", "src/routes/**/*" ];
const JS_DIST = [ "dist", "dist/dao", "dist/data", "dist/i18n", "dist/lib", "dist/routes" ];
const SYM_LINKS = [
	"dist", "dist/controllers", "dist/dao", "dist/data", "dist/lib",
	"dist/public/js", "dist/public/js/i18n", "dist/public/js/model"
];

function deployCV(src, dest, done) {
	fs.access(dest, err => {
		if (err) {
			console.error(`Path does not exist: ${dest}`);
			done(); // path does not exist => close task
		}
		else // deploy sources
			gulp.src(src).pipe(gulp.dest(dest)).on("end", done);
	});
}

// Tasks to copy all ts / tsx
gulp.task("copy-ts", done => {
	gulp.src(TS_FILES).pipe(gulp.dest("dist")).on("end", done);
});

// Task to minify all views HTML
gulp.task("minify-html-views", done => {
	const options = {
		caseSensitive: true,
		sortClassName: true,
		collapseWhitespace: true,
		removeComments: true, //removeComments => remove CDATA
		removeRedundantAttributes: false //remove attr with default value
	};
	gulp.src(HTML_FILES).pipe(htmlmin(options)).pipe(gulp.dest("dist/views")).on("end", done);
});
gulp.task("minify-html-xeco", done => {
	const CV = "C:/CampusVirtualV2/workspaceGIT/campusvirtual/modules/cv-cm/src/main/resources/META-INF/resources/modules/xeco";
	deployCV(HTML_XECO, CV, done); // deploy xeco XHTML in Campus Virtual
});
gulp.task("minify-html-irse", done => {
	const CV = "C:/CampusVirtualV2/workspaceGIT/campusvirtual/modules/cv-irse/src/main/resources/META-INF/resources/modules/irse";
	deployCV(HTML_IRSE, CV, done); // deploy irse XHTML in Campus Virtual
});
gulp.task("minify-html", gulp.series("minify-html-views", "minify-html-xeco", "minify-html-irse"));

// Tasks to minify all CSS
gulp.task("minify-css", done => {
	const CSS_DEST = "dist/public/css";
	const CV = "C:/CampusVirtualV2/workspaceGIT/campusvirtual/applications/uae/src/main/webapp/resources/css";
	fs.rmSync(CSS_DEST, { recursive: true, force: true }); // Remove previous unused files
	gulp.src(CSS_FILES).pipe(cssnano({ reduceIdents: false })).pipe(gulp.dest(CSS_DEST)).on("end", () => { // Minify single files
		gulp.src("dist/public/css/**/*.css").pipe(concat("styles-min.css")).pipe(gulp.dest(CSS_DEST)).on("end", () => {
			deployCV("dist/public/css/styles-min.css", CV, done); // deploy minify css in Campus Virtual
		});
	});
});

// Tasks to minify all JS
gulp.task("minify-js", done => {
	const JS_DEST = "dist/public/js";
	const CV = "C:/CampusVirtualV2/workspaceGIT/campusvirtual/applications/uae/src/main/webapp/resources/js";
	fs.rmSync(JS_DEST, { recursive: true, force: true }); // Remove previous unused files
	gulp.src(JS_FILES).pipe(uglify()).pipe(gulp.dest(JS_DEST)).on("end", () => {
		deployCV("dist/public/js/**/*.js", CV, done); // deploy JS in Campus Virtual
	});
});
gulp.task("minify-js-root", done => { // root js's
	gulp.src(JS_ROOT).pipe(uglify()).pipe(gulp.dest("dist/public/js")).on("end", done);
});

// Tasks to create js modules
gulp.task("modules", done => {
	JS_SRC.forEach((mod, i) => gulp.src(mod).pipe(gulp.dest(JS_DIST[i])));
	setTimeout(done, 100);
});

// Tasks to create static data
gulp.task("static", done => {
	gulp.src("dist/public").pipe(gulp.symlink("dist/views")); // static server links
	gulp.src(SYM_LINKS).pipe(gulp.symlink("node_modules/app")); // dynamic links

	gulp.src("src/public/img/**/*").pipe(gulp.dest("dist/public/img"));
	gulp.src("src/public/files/**/*").pipe(gulp.dest("dist/public/files")).on("end", done);
});

// Task to build dist when deployment on server
gulp.task("deploy", gulp.series("modules", "minify-html", "minify-css", "copy-ts", "minify-js"));

gulp.task("watch", () => {
	// Gulp views minifies
	gulp.watch(HTML_FILES, gulp.series("minify-html-views"));
	gulp.watch(HTML_XECO, gulp.series("minify-html-xeco"));
	gulp.watch(HTML_IRSE, gulp.series("minify-html-irse"));

	// Gulp JS minifies
	gulp.watch(JS_FILES, gulp.series("minify-js"));
	gulp.watch(JS_ROOT, gulp.series("minify-js-root"));

	gulp.watch(CSS_FILES, gulp.series("minify-css"));
	gulp.watch(TS_FILES, gulp.series("copy-ts"));
	gulp.watch(JS_SRC, gulp.series("modules"));
	// Other watchers ...
});

gulp.task("default", gulp.series("copy-ts", "minify-html", "minify-css", "minify-js", "modules", "static", "watch"));
