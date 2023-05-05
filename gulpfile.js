// VARIABLES & PATHS
let preprocessor = 'sass', // Preprocessor
    imageswatch = 'png|jpg|jpeg|gif|svg|ico', // List of images extensions for watching & compression (comma separated)
    baseDir = 'src', // Base directory path without «/» at the end
    buildDir = 'docs' // Build directory
;

let paths = {
    html: {
        src: [
            baseDir + '/**/*.html',
            '!' + baseDir + '/components/**/*.html'
        ],
        dest: buildDir,
    },
    styles: {
        src: [
            baseDir + '/styles/**/*.scss',
        ],
        dest: [buildDir + '/css'],
    },
    scripts: {
        src: baseDir + '/js/*.js',
        dest: [buildDir + '/js'],
    },
    libs: {
        src: [
            'node_modules/swiper/swiper-bundle.min.js',
        ],
        dest: [buildDir + '/js'],
    },
    images: {
        src: [
            baseDir + '/img/**/*.+(' + imageswatch + ')',
            '!' + baseDir + '/img/sprite/*.svg',
        ],
        dest: [buildDir + '/img'],
    },
    sprites: {
        src: baseDir + '/img/sprite/*.svg',
        dest: [buildDir + '/img'],
    },
    fonts: {
        src: [
            baseDir + '/fonts/**/*',
        ],
        dest: [buildDir + '/fonts'],
    },
    deploy: {
        dest: './' + buildDir + '**/*',
    },
    jsOutputName: 'app.min.js',
    libsOutputName: 'vendor.min.js'
}

let options = {
    "indent_with_tabs": true,
    "max_preserve_newlines": 0,
};

// LOGIC
const browserSync = require('browser-sync').create();
const del = require('del');
const {src, dest, parallel, series, watch} = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const include = require('gulp-file-include');
const htmlbeautify = require('gulp-html-beautify');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));
const sassglob = require('gulp-sass-glob');
const svgSprite = require('gulp-svg-sprite');
const uglify = require('gulp-uglify-es').default;

function browsersync() {
    browserSync.init({
        server: {baseDir: buildDir + '/'},
        browser: "Yandex",
        notify: false
    })
}

function html() {
    return src(paths.html.src)
        .pipe(include({
            context: {
                navItems: [
                    {
                        text: "Новинки",
                        link: "/new/",
                    },
                    {
                        text: "Каталог",
                        link: "/catalog/",
                        child: [
                            {text: "Платья", link: "/catalog/dress/"},
                            {text: "Костюмы", link: "/catalog/suit/"},
                            {text: "Жакеты", link: "/catalog/jacket/"},
                            {text: "Рубашки", link: "/catalog/shirts/"},
                            {text: "Шорты", link: "/catalog/shorts/"},
                            {text: "Юбки", link: "/catalog/skirts/"},
                            {text: "Деним", link: "/catalog/denim/"},
                            {text: "Брюки", link: "/catalog/trousers/"},
                            {text: "Свитер, Джемпер", link: "/catalog/sweater/"},
                            {text: "Топ, Футболка и Лонгслив", link: "/catalog/t-shirt/"},
                        ],
                    },
                    {
                        text: "Bestseller",
                        link: "/bestseller/",
                    },
                    {
                        text: "Sale",
                        link: "/sale/",
                    },
                    {
                        text: "Обувь",
                        link: "/shoes/",
                        child: [
                            {text: "Туфли", link: "/shoes/slippers/"},
                            {text: "Ботинки", link: "/shoes/boots/"},
                            {text: "Кроссовки", link: "/shoes/sneakers/"},
                        ],
                    },
                    {
                        text: "Аксессуары",
                        link: "/accessories/",
                        child: [
                            {text: "Головные уборы", link: "/accessories/hats/"},
                            {text: "Сумки", link: "/accessories/bags/"},
                            {text: "Ремни", link: "/accessories/belts/"},
                            {text: "Шарфы", link: "/accessories/scarves/"},
                            {text: "Подарочные сертификаты", link: "/accessories/certificates/"},
                        ],
                    },
                ],
                mobileMenuItems: [
                    {
                        text: "Все",
                        link: "/catalog/",
                    },
                    {
                        text: "Новинки",
                        link: "/new/",
                    },
                    {
                        text: "Платья",
                        link: "/catalog/dress/"
                    },
                    {
                        text: "Костюмы",
                        link: "/catalog/suit/"
                    },
                    {
                        text: "Жакеты",
                        link: "/catalog/jacket/"
                    },
                    {
                        text: "Рубашки",
                        link: "/catalog/shirts/"
                    },
                    {
                        text: "Шорты",
                        link: "/catalog/shorts/"
                    },
                    {
                        text: "Юбки",
                        link: "/catalog/skirts/"
                    },
                    {
                        text: "Деним",
                        link: "/catalog/denim/"
                    },
                    {
                        text: "Брюки",
                        link: "/catalog/trousers/"
                    },
                    {
                        text: "Свитер, Джемпер",
                        link: "/catalog/sweater/"
                    },
                    {
                        text: "Топ, Футболка и Лонгслив",
                        link: "/catalog/t-shirt/"
                    },
                    {
                        text: "Bestseller",
                        link: "/bestseller/",
                    },
                    {
                        text: "Sale",
                        link: "/sale/",
                    },
                    {
                        text: "Обувь",
                        link: "/shoes/",
                    },
                    {
                        text: "Аксессуары",
                        link: "/accessories/",
                    },
                ],
            }
        }))
        .pipe(htmlbeautify(options))
        .pipe(dest(paths.html.dest))
        .pipe(browserSync.stream())
}

function styles() {
    return src(paths.styles.src)
        .pipe(eval(`${preprocessor}glob`)())
        .pipe(eval(preprocessor)({outputStyle: 'compressed'}))
        .pipe(autoprefixer({overrideBrowserslist: ['last 8 versions'], grid: true}))
        .pipe(rename({suffix: '.min'}))
        .pipe(dest(paths.styles.dest[0]))
        .pipe(browserSync.stream())
}

function scripts() {
    return src(paths.scripts.src)
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(dest(paths.scripts.dest[0]))
        .pipe(browserSync.stream())
}

function libs() {
    return src(paths.libs.src, {allowEmpty: true})
        .pipe(concat(paths.libsOutputName))
        .pipe(uglify())
        .pipe(dest(paths.libs.dest[0]))
        .pipe(browserSync.stream())
}

function images() {
    return src(paths.images.src)
        .pipe(newer(paths.images.dest[0]))
        .pipe(imagemin())
        .pipe(dest(paths.images.dest[0]))
        .pipe(browserSync.stream())
}

function sprites() {
    return src(paths.sprites.src)
        .pipe(svgSprite({
                mode: {
                    stack: {
                        sprite: "../sprite.svg"
                    }
                },
            }
        ))
        .pipe(dest(paths.sprites.dest[0]))
        .pipe(browserSync.stream())
}

function fonts() {
    return src(paths.fonts.src)
        .pipe(dest(paths.fonts.dest[0]))
        .pipe(browserSync.stream())
}

function cleaningimages() {
    return del('' + paths.images.dest[0] + '/**/*', {force: true})
}

function cleaningfonts() {
    return del('' + paths.fonts.dest[0] + '/**/*', {force: true})
}

function startwatch() {
    watch(baseDir + '/**/*.html', html);
    watch(baseDir + '/components/**/*.scss', styles);
    watch(baseDir + '/styles/**/*.scss', styles);
    watch(baseDir + '/js/**/*.js', scripts);
    watch(baseDir + '/img/**/*.+(' + imageswatch + ')', images);
    watch(baseDir + '/img/sprite/*.svg', sprites);
    watch(baseDir + '/fonts/**/*', fonts);
}

exports.cleaningimages = cleaningimages;
exports.cleaningfonts = cleaningfonts;
exports.sprites = sprites;
exports.images = images;
exports.libs = libs;
exports.scripts = scripts;
exports.styles = styles;
exports.html = html;
exports.browsersync = browsersync;
exports.fonts = fonts;

exports.default = parallel(html, styles, scripts, libs, images, sprites, browsersync, startwatch, fonts);
