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
        notify: false
    })
}

function html() {
    return src(paths.html.src)
        .pipe(include(
          {
            context: {
                navItems: [
                    {
                        text: "Новинки",
                        link: "/catalog/new/",
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
                        link: "/catalog/bestseller/",
                    },
                    {
                        text: "Sale",
                        link: "/catalog/sale/",
                    },
                    {
                        text: "Обувь",
                        link: "/catalog/shoes/",
                        child: [
                            {text: "Туфли", link: "/catalog/shoes/slippers/"},
                            {text: "Ботинки", link: "/catalog/shoes/boots/"},
                            {text: "Кроссовки", link: "/catalog/shoes/sneakers/"},
                        ],
                    },
                    {
                        text: "Аксессуары",
                        link: "/catalog/accessories/",
                        child: [
                            {text: "Головные уборы", link: "/catalog/accessories/hats/"},
                            {text: "Сумки", link: "/catalog/accessories/bags/"},
                            {text: "Ремни", link: "/catalog/accessories/belts/"},
                            {text: "Шарфы", link: "/catalog/accessories/scarves/"},
                            {text: "Подарочные сертификаты", link: "/catalog/accessories/certificates/"},
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
                        link: "/catalog/new/",
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
                        link: "/catalog/bestseller/",
                    },
                    {
                        text: "Sale",
                        link: "/catalog/sale/",
                    },
                    {
                        text: "Обувь",
                        link: "/catalog/shoes/",
                    },
                    {
                        text: "Аксессуары",
                        link: "/catalog/accessories/",
                    },
                ],
                sitemap: [
                    {
                        name: "Покупателям",
                        items: [
                            {text: "Оплата", link: "/about/payment/"},
                            {text: "Доставка", link: "/about/delivery/"},
                            {text: "Возврат", link: "/about/return/"},
                            {text: "Подарочные сертификаты", link: "/certificates/"},
                        ],
                    },
                    {
                        name: "Компания",
                        items: [
                            {text: "О бренде", link: "/about/"},
                            {text: "Наши магазины", link: "/about/stores/"},
                            {text: "Связаться с нами", link: "/about/feedback/"},
                        ],
                    },
                    {
                        name: "Социальные сети",
                        social: true,
                        items: [
                            {text: "Instagram", link: "https://instagram.com"},
                            {text: "Telegram", link: "https://t.me"},
                            {text: "Whatsapp", link: "https://wa.me"},
                        ],
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
