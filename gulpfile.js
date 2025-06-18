import fs from "fs";
import gulp from "gulp";
import concat from "gulp-concat";
import uglify from "gulp-uglify";
import htmlmin from "gulp-htmlmin";
import cssnano from "gulp-cssnano";
import transform from "gulp-transform";

const fnNone = () => {};
const VIEW_FILES = "src/views/**/*";

const JS_FILES = "src/public/js/**/*.js";
const JS_ROOT = "src/public/js/*.js";

const CSS_FILES = "src/public/css/**/*.css";
const TS_FILES = [ "src/**/*.ts", "src/**/*.tsx" ];
const JS_SRC = [ "src/*.js", "src/dao/**/*", "src/data/**/*", "src/i18n/**/*", "src/lib/**/*", "src/routes/**/*" ];
const JS_DIST = [ "dist", "dist/dao", "dist/data", "dist/i18n", "dist/lib", "dist/routes" ];
const SYM_LINKS = [
	"dist", "dist/controllers", "dist/dao", "dist/data", "dist/lib", "dist/public/js", "dist/public/js/i18n"
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
gulp.task("minify-views", done => {
	const options = {
		caseSensitive: true,
		sortClassName: true,
		minifyJS: true, // inline js (<script> tag)
		minifyCSS: true, // inline css (<style> tag)
		keepClosingSlash: true, // not to remove /> close tag
		collapseWhitespace: true, // remove extra white spaces
		removeComments: true, // removeComments => remove CDATA
		removeRedundantAttributes: false // remove attr with default value
	};

	const VIEW_DEST = "dist/views"; // Remove previous unused files
	fs.rmSync(VIEW_DEST, { recursive: true, force: true }); // remove obsolete files
	gulp.src("dist/public").pipe(gulp.symlink("dist/views")); // static server links
	gulp.src(VIEW_FILES).pipe(htmlmin(options)).pipe(gulp.dest(VIEW_DEST)).on("end", () => {
		const CV_XECO = "C:/CampusVirtualV2/workspaceGIT/campusvirtual/modules/cv-cm/src/main/resources/META-INF/resources/modules/xeco";
		const CV_XECO_EMAILS = "C:/CampusVirtualV2/workspaceGIT/campusvirtual/modules/cv-cm/src/main/resources/templates/uae/emails";
		deployCV("dist/views/xeco/**/*", CV_XECO, fnNone); // deploy xeco XHTML in Campus Virtual
		deployCV("dist/views/xeco/emails/**/*", CV_XECO_EMAILS, fnNone); // deploy xeco XHTML in CV

		const CV_ISUITE = "C:/CampusVirtualV2/workspaceGIT/campusvirtual/modules/cv-xeco/src/main/resources/META-INF/resources/modules/xecom";
		deployCV("dist/views/isuite/**/*", CV_ISUITE, fnNone); // deploy xeco XHTML in Campus Virtual

		const CV_PRESTO = "C:/CampusVirtualV2/workspaceGIT/campusvirtual/modules/cv-cm/src/main/resources/META-INF/resources/modules/presto";
		const CV_PRESTO_EMAILS = "C:/CampusVirtualV2/workspaceGIT/campusvirtual/modules/cv-cm/src/main/resources/templates/presto/emails";
		deployCV("dist/views/presto/**/*", CV_PRESTO, fnNone); // deploy presto XHTML in Campus Virtual
		deployCV("dist/views/presto/emails/**/*", CV_PRESTO_EMAILS, fnNone); // deploy presto XHTML in CV

		const CV_FACT = "C:/CampusVirtualV2/workspaceGIT/campusvirtual/modules/cv-cm/src/main/resources/META-INF/resources/modules/factura";
		const CV_FACT_EMAILS = "C:/CampusVirtualV2/workspaceGIT/campusvirtual/modules/cv-cm/src/main/resources/templates/factura/emails";
		deployCV("dist/views/factura/**/*", CV_FACT, fnNone); // deploy presto XHTML in Campus Virtual 
		deployCV("dist/views/factura/emails/**/*", CV_FACT_EMAILS, fnNone); // deploy fact XHTML in Campus Virtual

		const CV_BUZON = "C:/CampusVirtualV2/workspaceGIT/campusvirtual/modules/cv-cm/src/main/resources/META-INF/resources/modules/buzon";
		deployCV("dist/views/buzon/**/*", CV_BUZON, fnNone); // deploy presto XHTML in Campus Virtual 

		const CV_IRSE = "C:/CampusVirtualV2/workspaceGIT/campusvirtual/modules/cv-irse/src/main/resources/META-INF/resources/modules/irse";
		deployCV("dist/views/irse/**/*", CV_IRSE, fnNone); // deploy irse XHTML in Campus Virtual

		const CV_IRIS = "C:/CampusVirtualV2/workspaceGIT/campusvirtual/modules/cv-irse/src/main/resources/META-INF/resources/modules/iris";
		const CV_IRIS_EMAILS = "C:/CampusVirtualV2/workspaceGIT/campusvirtual/modules/cv-irse/src/main/resources/templates/emails";
		deployCV("dist/views/iris/**/*", CV_IRIS, fnNone); // deploy irse XHTML in Campus Virtual
		deployCV("dist/views/iris/emails/**/*", CV_IRIS_EMAILS, done); // deploy irse XHTML in Campus Virtual
	});
});

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
	const fnRemoveWhitespace = contents => new Buffer(contents.toString().replace(/\s+/g, " "), "utf8"); // remove all whitespace   

	fs.rmSync(JS_DEST, { recursive: true, force: true }); // Remove previous unused files
	gulp.src(JS_FILES).pipe(uglify()).pipe(transform(fnRemoveWhitespace)).pipe(gulp.dest(JS_DEST)).on("end", () => {
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
	gulp.src(SYM_LINKS).pipe(gulp.symlink("node_modules/app")); // dynamic links

	gulp.src("src/public/img/**/*").pipe(gulp.dest("dist/public/img"));
	gulp.src("src/public/files/**/*").pipe(gulp.dest("dist/public/files")).on("end", done);
});

// Task to build dist when deployment on server
gulp.task("deploy", gulp.series("modules", "minify-views", "minify-css", "copy-ts", "minify-js"));

gulp.task("watch", () => {
	// Gulp views minifies
	gulp.watch(VIEW_FILES, gulp.series("minify-views"));

	// Gulp JS minifies
	gulp.watch(JS_FILES, gulp.series("minify-js"));
	gulp.watch(JS_ROOT, gulp.series("minify-js-root"));

	gulp.watch(CSS_FILES, gulp.series("minify-css"));
	gulp.watch(TS_FILES, gulp.series("copy-ts"));
	gulp.watch(JS_SRC, gulp.series("modules"));
	// Other watchers ...
});

gulp.task("default", gulp.series("copy-ts", "minify-views", "minify-css", "minify-js", "modules", "static", "watch"));
