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
      this.initTabs();
      this.initForm();
    }).bind(this));
  }

  initForm() {
    const radioButtons = document.querySelectorAll('[data-deliveryId]');

    if (radioButtons.length) {
      radioButtons.forEach(el => {
        const content = document.getElementById(el.dataset.deliverycontent);
        if (content) {
          const inputs = document.getElementById(el.dataset.deliveryid);

          if (inputs && el.checked) {
            content.innerHTML = inputs.innerHTML;
          }

          el.addEventListener('change', function () {
            if (inputs && this.checked) {
              content.innerHTML = inputs.innerHTML;
            }
          })
        }
      })
    }

    const formBlockButtons = document.querySelectorAll('.form-block-title');

    if (formBlockButtons.length) {
      formBlockButtons.forEach(el => {
        el.addEventListener('click', function () {
          if (!this.classList.contains('selected')) {
            return
          }
          formBlockButtons.forEach(btn => {
            btn.classList.remove('active')
          })
          const parent = this.closest('.form-right');

          if (parent) {
            parent.classList.toggle('open')
          }
          this.classList.toggle('active');
          customScroll(this)
        })
      })
    }

    function customScroll(nextBlock) {
      const header = document.querySelector('header');
      let headerH = null;
      if (header) {
        headerH = header.getBoundingClientRect().height;
      }
      const yOffset = headerH ? -headerH : -200;
      const y = nextBlock.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: 'auto' });
    }

    const nextButtons = document.querySelectorAll('[data-nextformid]');

    if (nextButtons.length) {
      nextButtons.forEach(el => {
        el.addEventListener('click', function () {
          const parent = this.closest('.form-block');

          if (parent) {
            const btn = parent.querySelector('.form-block-title');

            const inputs = parent.querySelectorAll('input[required], input[type="email"]');
            let validate = true;
            if (inputs.length) {
              inputs.forEach(inp => {
                if (inp.value.trim() === '' && inp.type !== 'email') {
                  const wrapper = inp.closest('.input-wrapper');
                  validate = false;
                  if (wrapper) {
                    wrapper.classList.add('error')
                  }
                } else if (inp.dataset.pattern) {
                  const regExp = new RegExp(inp.dataset.pattern)
                  if (!regExp.test(inp.value.trim())) {
                    const wrapper = inp.closest('.input-wrapper');
                    validate = false;
                    if (wrapper) {
                      wrapper.classList.add('error')
                    }
                  }
                } else if (inp.type === 'email' && inp.value.trim() !== '') {
                  const regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');

                  if (!regex.test(inp.value)) {
                    const wrapper = inp.closest('.input-wrapper');
                    validate = false;
                    if (wrapper) {
                      wrapper.classList.add('error')
                    }
                  }
                }
              })

              if (validate === false) {
                customScroll(parent)
              }
            }

            if (this.classList.contains('prev')) {
              validate = true;
            }

            if (btn && validate) {
              btn.classList.remove('active');
              btn.classList.add('selected');

              const selected = parent.querySelector('.form-block-selected');

              const inputsNew = parent.querySelectorAll('input, textarea')

              if (selected && inputsNew.length) {
                selected.innerHTML = '';
                inputsNew.forEach(inp => {
                  if (inp.dataset.sprintf) {
                    selected.insertAdjacentHTML('beforeend', inp.dataset.sprintf.replace('%s', inp.value))
                  } else {

                    if (inp.type === 'radio' || inp.type === 'checkbox') {
                      if (inp.checked) {
                        const div = document.createElement('div');
                        div.innerHTML = inp.value;
                        selected.appendChild(div)
                      }
                    } else {
                      const div = document.createElement('div');
                      div.innerHTML = inp.value;
                      selected.appendChild(div)

                    }

                  }
                })
              }

              const nextBlock = document.getElementById(this.dataset.nextformid);

              if (nextBlock) {
                const nextBtn = nextBlock.querySelector('.form-block-title');

                if (nextBtn) {
                  nextBtn.classList.add('active');
                  const parentBlock = nextBtn.closest('.form-right');

                  if (parentBlock) {
                    parentBlock.classList.add('open')
                  }
                  setTimeout(() => {
                    customScroll(nextBlock)
                  }, 0)
                }
              }
            }
          }
        })
      })
    }

  }

  initTabs() {
    let tab = document.querySelectorAll('.filt-tab'),
      header = document.querySelector('.filt'),
      tabContent = document.querySelectorAll('.tabcontent');

    if (tab.length && header && tabContent.length) {

      let activeTab = null;


      for (let i = 0; i < tab.length; i++) {
        if (tab[i].classList.contains('active')) {
          activeTab = i;
          break;
        }
      }
      hideTabContent(activeTab);


      header.addEventListener('click', function (event) {
        let target = event.target;
        if (target && target.classList.contains('active')) {
          for (let j = 0; j < tab.length; j++) {
            tab[j].classList.remove('active');
          }
          hideTabContent(null)
          return;
        }
        if (target && target.classList.contains('filt-tab')) {
          for (let j = 0; j < tab.length; j++) {
            tab[j].classList.remove('active');
          }
          target.classList.add('active');
          for (let i = 0; i < tab.length; i++) {
            if (target == tab[i]) {
              hideTabContent(i);
              break;
            }
          }
        }

      });
    }

    function hideTabContent(a) {
      if (a !== null) {
        for (let i = 0; i < tabContent.length; i++) {
          if (i === a) {
            tabContent[i].classList.add('show');
            tabContent[i].classList.remove('hide');
            continue;
          }
          tabContent[i].classList.remove('show');
          tabContent[i].classList.add('hide');
        }
      } else {
        for (let i = 0; i < tabContent.length; i++) {
          tabContent[i].classList.remove('show');
          tabContent[i].classList.add('hide');
        }
      }
    }




    function showTabContent(b) {
      if (tabContent[b].classList.contains('hide')) {
        tabContent[b].classList.remove('hide');
        tabContent[b].classList.add('show');
      }
    }



    const buttons = document.querySelectorAll('[data-modal]');

    if (buttons.length) {
      buttons.forEach(el => {
        el.addEventListener('click', function () {
          const modal = document.getElementById(this.dataset.modal);
          if (modal) {
            modal.classList.add('open')
          }
        })


      })
    }

    const buttons2 = document.querySelectorAll('[data-submit]');

    if (buttons2.length) {
      buttons2.forEach(el => {
        el.addEventListener('click', function () {
          const modal = document.getElementById(this.dataset.submit);
          if (modal) {
            modal.click()
          }
        })


      })
    }

    const closeButtons = document.querySelectorAll('.newModal-close');

    if (closeButtons.length) {
      closeButtons.forEach(el => {
        el.addEventListener('click', function () {
          const modal = this.closest('.newModal');
          if (modal) {
            modal.classList.remove('open')
          }
        })
      })
    }

    function addMask() {
      [].forEach.call(document.querySelectorAll('input[type="tel"]'), function (input) {
        let keyCode;
        function mask(event) {
          event.keyCode && (keyCode = event.keyCode);
          let pos = this.selectionStart;
          if (pos < 3) event.preventDefault();
          let matrix = "+7 (___) ___-__-__",
            i = 0,
            def = matrix.replace(/\D/g, ""),
            val = this.value.replace(/\D/g, ""),
            new_value = matrix.replace(/[_\d]/g, function (a) {
              return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
            });
          i = new_value.indexOf("_");
          if (i != -1) {
            i < 5 && (i = 3);
            new_value = new_value.slice(0, i);
          };
          let reg = matrix.substr(0, this.value.length).replace(/_+/g,
            function (a) {
              return "\\d{1," + a.length + "}"
            }).replace(/[+()]/g, "\\$&");
          reg = new RegExp("^" + reg + "$");
          this.parentElement.classList.remove('error');
          if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
          if (event.type == "blur" && this.value.length < 5) this.value = ""
        };

        input.addEventListener("input", mask, false);
        input.addEventListener("focus", mask, false);
        input.addEventListener("blur", mask, false);
        input.addEventListener("keydown", mask, false);

      });

    };
    addMask();

    document.addEventListener('click', function () {
      const error = event.target.closest('.error');
      if (error) {
        error.classList.remove('error')
      }
    })
  }

  initEvents() {
    window.addEventListener('load', this.onLoad.bind(this));
    window.addEventListener('resize', this.onResize.bind(this), { passive: true });
    window.addEventListener('scroll', this.onScroll.bind(this), { passive: true });
    this.addEventListener('.header__nav-link', 'mouseover', this.headerNavHoverHandler, true, { passive: true });
    this.addEventListener('.header', 'mouseleave', this.headerCloseSubmenu, false, { passive: true });
    this.addEventListener('.header__mobile_menu-btn', 'click', this.openMobileMenu.bind(this));
    this.addEventListener('input, select, textarea', 'focusin', this.disableZoom.bind(this), true, { passive: true });
    this.addEventListener('input, select, textarea', 'focusout', this.enableZoom.bind(this), true, { passive: true });
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
          slidesPerView: 'auto',
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

    new Swiper('.directory-swiper', {
      loop: true,
      slidesPerView: 'auto',
      speed: 400,
    })
    // const wrapper = document.querySelector('.bestSell-swiper-wrapper');

    // if (wrapper) {
    //   const swiper = wrapper.querySelector('.bestSell-swiper');
    //   const pagination = wrapper.querySelector('.swiper-pagination')
    //   if (swiper) {
    //     new Swiper(swiper, {
    //       loop: true,
    //       slidesPerView: 'auto',
    //       speed: 400,
    //       pagination: {
    //         el: pagination,
    //         clickable: true,
    //       },
    //     })
    //   }

    // }


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
          // autoHeight: true,
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

    let orderProducts = document.querySelectorAll('.profile-orders__item-products');
    if (orderProducts.length > 0) {
      for (let orderProduct of orderProducts) {
        let swiper = orderProduct.querySelector('.swiper'),
          prev = orderProduct.querySelector('.swiper-button-prev'),
          next = orderProduct.querySelector('.swiper-button-next');

        swiper.swiper && swiper.swiper.destroy();

        new Swiper(swiper, {
          slidesPerView: 5,
          loop: false,
          navigation: {
            prevEl: prev,
            nextEl: next,
          },
          enabled: false,
          breakpoints: {
            1200: {
              enabled: true,
            },
          },
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

        let modals = document.querySelectorAll('.modal._active');
        if (modals && modals.length > 0) {
          modals.forEach(function (modal) {
            modal.classList.remove('_active');
          });
        }

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

  deleteBasketItem(basketId) {
    let basketItem = document.querySelector('[data-basket-item-id="' + basketId + '"]');
    if (basketItem) {
      basketItem.remove();
    }
  }

  decreaseBasketItem(basketId) {
    let basketItem = document.querySelector('[data-basket-item-id="' + basketId + '"]');
    if (basketItem) {
      let quantity = basketItem.querySelector('input[name="quantity"]');
      if (quantity) {
        quantity.value = Math.max(~~quantity.value - 1, 1);
      }
    }
  }

  increaseBasketItem(basketId) {
    let basketItem = document.querySelector('[data-basket-item-id="' + basketId + '"]');
    if (basketItem) {
      let quantity = basketItem.querySelector('input[name="quantity"]');
      if (quantity) {
        quantity.value = Math.max(~~quantity.value + 1, 1);
      }
    }
  }
}


window.Indress = new Indress();