class Indress {

    handlers = [];
    timeouts = [];

    constructor() {
        document.addEventListener('DOMContentLoaded', (function () {
            this.initEvents();
            this.initSliders();
            this.calculateAppHeight();
            this.checkHeaderMenuSize();
            this.checkHeaderDark();
        }).bind(this));
    }

    initEvents() {
        window.addEventListener('load', this.onLoad.bind(this));
        window.addEventListener('resize', this.onResize.bind(this), {passive: true});
        window.addEventListener('scroll', this.onScroll.bind(this), {passive: true});
        this.addEventListener('.header__nav-link', 'mouseover', this.headerNavHoverHandler, true, {passive: true});
        this.addEventListener('.header', 'mouseleave', this.headerCloseSubmenu, false, {passive: true});
        this.addEventListener('.header__mobile_menu-btn', 'click', this.openMobileMenu.bind(this));
        this.addEventListener('input, select, textarea', 'focusin', this.disableZoom.bind(this), true, {passive: true});
        this.addEventListener('input, select, textarea', 'focusout', this.enableZoom.bind(this), true, {passive: true});
        this.addEventListener('.footer__sitemap-name', 'click', this.openFooterGroup, true);
        this.addEventListener('[data-tab-id]', 'click', this.showTab, true);
        this.addEventListener('[data-modal-id]', 'click', this.showModal, true);
        this.addEventListener('.overlay, .modal__close', 'click', this.closeModal, true);
    }

    disableZoom() {
        let meta = document.querySelector('meta[name="viewport"]');
        if (meta) {
            meta.setAttribute('content', 'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no');
        }
    }

    enableZoom() {
        let meta = document.querySelector('meta[name="viewport"]');
        if (meta) {
            meta.setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=no');
        }
    }

    initSliders() {
        let fullwidthBanners = document.querySelectorAll('.fullwidth-banner');
        if (fullwidthBanners.length > 0) {
            for (let banner of fullwidthBanners) {
                let swiper = banner.querySelector('.swiper'),
                    pagination = banner.querySelector('.swiper-pagination');

                swiper.swiper && swiper.swiper.destroy();

                new Swiper(swiper, {
                    slidesPerView: 1,
                    loop: true,
                    pagination: {
                        el: pagination,
                        clickable: true,
                    },
                    autoplay: {
                        delay: 7000,
                    },
                });
            }
        }

        let productLines = document.querySelectorAll('.product-line');
        if (productLines.length > 0) {
            for (let productLine of productLines) {
                let swiper = productLine.querySelector('.swiper');

                swiper.swiper && swiper.swiper.destroy();

                new Swiper(swiper, {
                    slidesPerView: 'auto',
                    loop: false,
                    freeMode: true,
                });

            }
        }

        let categories = document.querySelectorAll('.categories');
        if (categories.length > 0) {
            for (let category of categories) {
                let swiper = category.querySelector('.swiper'),
                    prev = category.querySelector('.categories__prev'),
                    next = category.querySelector('.categories__next');

                swiper.swiper && swiper.swiper.destroy();

                new Swiper(swiper, {
                    slidesPerView: 'auto',
                    loop: false,
                    freeMode: true,
                    enabled: false,
                    navigation: {
                        prevEl: prev,
                        nextEl: next,
                    },
                    breakpoints: {
                        768: {
                            enabled: true,
                        },
                        1200: {
                            enabled: false,
                        }
                    },
                });

            }
        }

        let productDetails = document.querySelectorAll('.product-detail__images');
        if (productDetails.length > 0) {
            for (let productDetail of productDetails) {
                let swiper = productDetail.querySelector('.swiper'),
                    pagination = productDetail.querySelector('.product-detail__slider-pagination'),
                    scrollbar = productDetail.querySelector('.product-detail__slider-scrollbar');

                swiper.swiper && swiper.swiper.destroy();

                new Swiper(swiper, {
                    slidesPerView: 1,
                    autoHeight: true,
                    mousewheel: true,
                    loop: false,
                    zoom: {
                        minRatio: 1,
                        maxRation: 5,
                    },
                    pagination: {
                        el: pagination,
                        clickable: true,
                    },
                    scrollbar: {
                        el: scrollbar,
                        draggable: true,
                    },
                    breakpoints: {
                        768: {
                            slidesPerView: 'auto',
                            direction: 'vertical',
                        }
                    }
                });
            }
        }


    }

    onLoad(event) {
        this.checkHeaderMenuSize();
        this.checkHeaderDark();
    }

    onResize(event) {
        this.checkHeaderMenuSize();
        this.calculateAppHeight();
    }

    onScroll() {
        this.checkHeaderDark();
    }

    checkHeaderDark() {
        try {
            window.observer = new IntersectionObserver((function (entries) {
                entries.forEach((function (entry) {
                    if (this.timeouts['headerDark'] > 0) {
                        window.cancelAnimationFrame(this.timeouts['headerDark']);
                        this.timeouts['headerDark'] = 0;
                    }
                    this.timeouts['headerDark'] = window.requestAnimationFrame((function () {
                        header.classList.toggle(
                            '_dark',
                            entry.isIntersecting
                            && entry.intersectionRect.top <= 5
                            && entry.intersectionRect.bottom >= header.clientHeight
                        );
                    }).bind(this));
                }).bind(this));
            }).bind(this), {
                root: document.querySelector('.wrapper'),
                rootMargin: '0px',
                threshold: 1.0
            });

            let header = document.querySelector('.header'),
                fullwidthBanners = document.querySelectorAll('.fullwidth-banner');
            if (fullwidthBanners.length > 0) {
                for (const fullwidthBanner of fullwidthBanners) {
                    observer.observe(fullwidthBanner);
                }
            }
        } catch (e) {
            console.error(e);
        }
    }

    checkHeaderMenuSize() {
        try {
            if (this.timeouts['menuSize'] > 0) {
                window.cancelAnimationFrame(this.timeouts['menuSize']);
                this.timeouts['menuSize'] = 0;
            }
            this.timeouts['menuSize'] = window.requestAnimationFrame((function () {
                let header = document.querySelector('.header'),
                    menu = header.querySelector('.header__menu'),
                    nav = header.querySelector('.header__nav');
                header.classList.remove('_mobile');
                header.classList.toggle('_mobile', window.innerWidth < 1200 || nav.clientWidth >= menu.clientWidth);
            }).bind(this));
        } catch (e) {
            console.error(e);
        }
    }

    openMobileMenu(event) {
        let mobileMenu = document.querySelector('.header__mobile_menu');
        event.currentTarget.classList.toggle('_active');
        this.disableScroll(mobileMenu.classList.toggle('_open'));
    }

    disableScroll(bool = true) {
        document.body.classList.toggle('scroll-disabled', bool)
    }

    headerNavHoverHandler(event) {
        let submenu;
        if ((submenu = this.parentElement.querySelector('.header__submenu-list'))) {
            document.querySelector('.header').classList.add('_sub-open');
            submenu.classList.add('_active');
        } else {
            document.querySelector('.header').classList.remove('_sub-open');
        }
        document.querySelectorAll('.header__submenu-list._active').forEach(function (el) {
            if (submenu && el !== submenu) {
                el.classList.remove('_active');
            }
        });
    }

    headerCloseSubmenu(event) {
        this.classList.remove('_sub-open');
    }

    addEventListener(selector, event, handler, root = false, options) {
        try {
            if (root && typeof selector === 'string') {
                if (!(this.handlers[event] instanceof Map)) {
                    this.handlers[event] = new Map();
                    document.addEventListener(event, this.rootEventHandler.bind(this), options);
                }
                if (this.handlers[event].has(selector)) {
                    this.handlers[event].get(selector).push(handler)
                } else {
                    this.handlers[event].set(selector, [handler]);
                }
            } else {
                let arr;
                if (typeof selector === 'string') {
                    arr = document.querySelectorAll(selector);
                } else {
                    arr = [selector];
                }
                arr.forEach(function (el) {
                    el.addEventListener(event, handler, options);
                });
            }
        } catch (e) {
            console.error(e);
        }
    }

    rootEventHandler(event) {
        if (this.handlers[event.type]) {
            let el;
            try {
                for (let [selector, handlers] of this.handlers[event.type]) {
                    el = event.target.closest(selector);
                    if (el) {
                        handlers.forEach(function (handler) {
                            handler.call(el, event);
                        });
                    }
                }
            } catch (e) {
                console.error(e);
            }
        }
    }

    calculateAppHeight() {
        document.documentElement.style.setProperty('--app-height', (window.innerHeight / 100) + 'px');
    }

    openFooterGroup(event) {
        if (window.innerWidth < 768) {
            let group = this.closest('.footer__sitemap-col'),
                list = group.querySelector('.footer__sitemap-list');
            if (!group.classList.contains('_open')) {
                list.style.height = 'initial';
                let height = list.offsetHeight + 'px';
                list.style.removeProperty('height');
                window.requestAnimationFrame(function () {
                    list.style.setProperty('height', height);
                });
            } else {
                list.style.removeProperty('height');
            }
            group.classList.toggle('_open');
        }
    }

    showTab(event) {
        event.preventDefault();

        let tabId = this.dataset.tabId;
        if (tabId && tabId.length > 0) {
            let prefix = tabId.substring(0, tabId.search('#'));
            let tabs = document.querySelectorAll('[data-tab^="' + prefix + '#"],[data-tab-id^="' + prefix + '#"]')
            tabs.forEach(function (tab) {
                console.log(tab);
                if (tab.dataset.tab) {
                    tab.classList.toggle('_active', tab.dataset.tab === tabId)
                } else if (tab.dataset.tabId) {
                    tab.classList.toggle('_active', tab.dataset.tabId === tabId)
                }
            });
        }
    }

    showModal(event) {
        if (this.dataset.modalId && this.dataset.modalId.length) {
            let modal = document.querySelector('#' + this.dataset.modalId);
            if (modal) {
                document.body.classList.add('scroll-disabled');

                let overlay = document.querySelector('body > .overlay');
                overlay.classList.add('_active');

                modal.classList.add('_active');

                if (!modal.querySelector('.modal__close')) {
                    let modalClose = document.createElement('div');
                    modalClose.className = 'modal__close';
                    modal.appendChild(modalClose);
                }
            } else {
                console.error('modal ' + this.dataset.modalId + ' not found');
            }
        }
    }

    closeModal(event) {
        document.body.classList.remove('scroll-disabled');

        let overlay = document.querySelector('body > .overlay._active');
        if (overlay) {
            overlay.classList.remove('_active');
        }

        let modals = document.querySelectorAll('.modal._active');
        if (modals && modals.length > 0) {
            modals.forEach(function (modal) {
                modal.classList.remove('_active');
            });
        }
    }

    productLike(event) {
        event.preventDefault();
        this.classList.toggle('_active');
    }

    chooseColor(event) {
        event.preventDefault();
        document.querySelectorAll('[data-name="product-color"]').forEach((function (el) {
            el.classList.toggle('_active', el === this);
        }).bind(this));
    }

    chooseSize(event) {
        event.preventDefault();
        document.querySelectorAll('[data-name="product-size"]').forEach((function (el) {
            el.classList.toggle('_active', el === this);
        }).bind(this));
    }
}


window.Indress = new Indress();