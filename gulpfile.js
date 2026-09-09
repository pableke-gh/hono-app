
import fs from "fs";
import gulp from "gulp";
import concat from "gulp-concat";
import terser from "gulp-terser";
import htmlmin from "gulp-htmlmin";
import cssnano from "gulp-cssnano";
import transform from "gulp-transform";

const VIEW_FILES = "src/views/**/*";
const VIEW_CV_CM = "C:/CampusVirtualV2/workspaceGIT/campusvirtual/modules/cv-cm/src/main/resources/META-INF/resources/modules/**/*";
const TPLS_CV_CM = "C:/CampusVirtualV2/workspaceGIT/campusvirtual/modules/cv-cm/src/main/resources/templates/**/*";
const VIEW_CV_IRSE = "C:/CampusVirtualV2/workspaceGIT/campusvirtual/modules/cv-irse/src/main/resources/META-INF/resources/modules/**/*";
const TPLS_CV_IRSE = "C:/CampusVirtualV2/workspaceGIT/campusvirtual/modules/cv-irse/src/main/resources/templates/**/*";
const VIEW_OPTION = {
	caseSensitive: true,
	sortClassName: true,
	minifyJS: true, // inline js (<script> tag)
	minifyCSS: true, // inline css (<style> tag)
	keepClosingSlash: true, // not to remove /> close tag
	collapseWhitespace: true, // remove extra white spaces
	removeComments: true, // removeComments => remove CDATA
	removeRedundantAttributes: false // remove attr with default value
};

const JS_FILES = "src/public/js/**/*.js*"; // .js, .jsm or .json
const JS_FILES_CV = "C:/CampusVirtualV2/workspaceGIT/campusvirtual/applications/uae/src/main/webapp/resources/js/**/*.js";
const JS_ROOT = "src/public/js/*.js";

const CSS_FILES = "src/public/css/**/*.css";
const CSS_CV = [
	"C:/CampusVirtualV2/workspaceGIT/campusvirtual/applications/uae/src/main/webapp/resources/css/**/*.css", // Select all CSS files
	"!C:/CampusVirtualV2/workspaceGIT/campusvirtual/applications/uae/src/main/webapp/resources/css/**/*-min.css" // Exclude minified files
];

const TS_FILES = [ "src/**/*.ts", "src/**/*.tsx" ];
const JS_SRC = [ "src/*.js", "src/dao/**/*", "src/data/**/*", "src/i18n/**/*", "src/lib/**/*", "src/routes/**/*" ];
const JS_DIST = [ "dist", "dist/dao", "dist/data", "dist/i18n", "dist/lib", "dist/routes" ];
const SYM_LINKS = [ "dist", "dist/controllers", "dist/dao", "dist/data", "dist/lib", "dist/public/js" ];

// Tasks to copy all ts / tsx
gulp.task("copy-ts", done => {
	gulp.src(TS_FILES).pipe(gulp.dest("dist")).on("end", done);
});

// Task to minify all views HTML
gulp.task("minify-views", done => {
	const VIEW_DEST = "dist/views"; // Remove previous unused files
	fs.rmSync(VIEW_DEST, { recursive: true, force: true }); // remove obsolete files
	gulp.src("dist/public").pipe(gulp.symlink("dist/views")); // static server links
	gulp.src(VIEW_FILES).pipe(htmlmin(VIEW_OPTION)).pipe(gulp.dest(VIEW_DEST)).on("end", done);
});
gulp.task("minify-views-cv-cm", done => {
	const VIEW_DEST = "C:/CampusVirtualV2/workspaceGIT/campusvirtual/modules/cv-cm/target/classes/META-INF/resources/modules";
	fs.rmSync(VIEW_DEST, { recursive: true, force: true }); // remove obsolete files
	gulp.src(VIEW_CV_CM).pipe(htmlmin(VIEW_OPTION)).pipe(gulp.dest(VIEW_DEST)).on("end", done);
});
gulp.task("minify-templates-cv-cm", done => {
	const VIEW_DEST = "C:/CampusVirtualV2/workspaceGIT/campusvirtual/modules/cv-cm/target/classes/templates";
	fs.rmSync(VIEW_DEST, { recursive: true, force: true }); // remove obsolete files
	gulp.src(TPLS_CV_CM).pipe(htmlmin(VIEW_OPTION)).pipe(gulp.dest(VIEW_DEST)).on("end", done);
});
gulp.task("minify-views-cv-irse", done => {
	const VIEW_DEST = "C:/CampusVirtualV2/workspaceGIT/campusvirtual/modules/cv-irse/target/classes/META-INF/resources/modules";
	fs.rmSync(VIEW_DEST, { recursive: true, force: true }); // remove obsolete files
	gulp.src(VIEW_CV_IRSE).pipe(htmlmin(VIEW_OPTION)).pipe(gulp.dest(VIEW_DEST)).on("end", done);
});
gulp.task("minify-templates-cv-irse", done => {
	const VIEW_DEST = "C:/CampusVirtualV2/workspaceGIT/campusvirtual/modules/cv-irse/target/classes/templates";
	fs.rmSync(VIEW_DEST, { recursive: true, force: true }); // remove obsolete files
	gulp.src(TPLS_CV_IRSE).pipe(htmlmin(VIEW_OPTION)).pipe(gulp.dest(VIEW_DEST)).on("end", done);
});

// Tasks to minify all CSS
gulp.task("minify-css", done => {
	const CSS_DEST = "dist/public/css";
	//fs.rmSync(CSS_DEST, { recursive: true, force: true }); // Remove previous unused files
	gulp.src(CSS_FILES).pipe(concat("styles-min.css")).pipe(cssnano({ reduceIdents: false })).pipe(gulp.dest(CSS_DEST)).on("end", done);
});
gulp.task("minify-css-cv", done => {
	const RESOURCE ="C:/CampusVirtualV2/workspaceGIT/campusvirtual/applications/uae/src/main/webapp/resources/css";
	const TARGET = "C:/CampusVirtualV2/workspaceGIT/campusvirtual/applications/uae/target/uae/resources/css";

	fs.rmSync(TARGET, { recursive: true, force: true }); // remove previous css files
	fs.mkdirSync(TARGET, { recursive: true }); // restore css root
	gulp.src(CSS_CV).pipe(concat("styles-min.css")).pipe(cssnano({ reduceIdents: false }))
		.pipe(gulp.dest(RESOURCE)).pipe(gulp.dest(TARGET)).on("end", done);
});

// Tasks to minify all JS
gulp.task("minify-js", done => {
	const JS_DEST = "dist/public/js";
	const fnRemoveWhitespace = contents => new Buffer(contents.toString().replace(/\s+/g, " "), "utf8"); // remove all whitespace   

	fs.rmSync(JS_DEST, { recursive: true, force: true }); // Remove previous unused files
	gulp.src(JS_FILES).pipe(terser()).pipe(transform(fnRemoveWhitespace)).pipe(gulp.dest(JS_DEST)).on("end", done);
});
gulp.task("minify-js-cv", done => {
	const JS_DEST = "C:/CampusVirtualV2/workspaceGIT/campusvirtual/applications/uae/target/uae/resources/js";
	const fnRemoveWhitespace = contents => new Buffer(contents.toString().replace(/\s+/g, " "), "utf8"); // remove all whitespace   

	fs.rmSync(JS_DEST, { recursive: true, force: true }); // Remove previous unused files
	gulp.src(JS_FILES_CV).pipe(terser()).pipe(transform(fnRemoveWhitespace)).pipe(gulp.dest(JS_DEST)).on("end", done);
});
gulp.task("minify-js-root", done => { // root js's
	gulp.src(JS_ROOT).pipe(terser()).pipe(gulp.dest("dist/public/js")).on("end", done);
});

// Tasks to create js modules
gulp.task("modules", done => {
	JS_SRC.forEach((mod, i) => gulp.src(mod).pipe(gulp.dest(JS_DIST[i])));
	setTimeout(done, 100);
});

// Tasks to create static data
gulp.task("static", done => {
	gulp.src(SYM_LINKS).pipe(gulp.symlink("node_modules/app")); // dynamic links

	gulp.src("src/public/img/**/*").pipe(gulp.dest("dist/public/img"));
	gulp.src("src/public/files/**/*").pipe(gulp.dest("dist/public/files")).on("end", done);
});

// Task to build dist when deployment on server
gulp.task("deploy", gulp.series("modules", "minify-views", "minify-css", "copy-ts", "minify-js"));

// Task to build dist in Campus Virtual
gulp.task("cv", gulp.series(
	"minify-views-cv-cm", "minify-templates-cv-cm", "minify-views-cv-irse", "minify-templates-cv-irse",
	"minify-js-cv", "minify-css-cv"
));

gulp.task("watch", () => {
	// Gulp views minifies
	gulp.watch(VIEW_FILES, gulp.series("minify-views"));
	gulp.watch(VIEW_CV_CM, gulp.series("minify-views-cv-cm"));
	gulp.watch(TPLS_CV_CM, gulp.series("minify-templates-cv-cm"));
	gulp.watch(VIEW_CV_IRSE, gulp.series("minify-views-cv-irse"));
	gulp.watch(TPLS_CV_IRSE, gulp.series("minify-templates-cv-irse"));

	// Gulp JS minifies
	gulp.watch(JS_FILES, gulp.series("minify-js"));
	gulp.watch(JS_FILES_CV, gulp.series("minify-js-cv"));
	gulp.watch(JS_ROOT, gulp.series("minify-js-root"));

	gulp.watch(CSS_FILES, gulp.series("minify-css"));
	gulp.watch(CSS_CV, gulp.series("minify-css-cv"));

	gulp.watch(TS_FILES, gulp.series("copy-ts"));
	gulp.watch(JS_SRC, gulp.series("modules"));
	// Other watchers ...
});

gulp.task("default", gulp.series(
	"minify-views", "minify-views-cv-cm", "minify-templates-cv-cm", "minify-views-cv-irse", "minify-templates-cv-irse",
	"minify-js", "minify-js-cv",
	"minify-css", "minify-css-cv",
	//"copy-ts", "modules", "static",
	"watch"
));
