$(document).ready(function () {

  $('.menu__btn').click(function () {
    event.preventDefault();
    $('.menu').toggleClass('active');
    $(this).toggleClass('active');
  });

  $(window).on('scroll', function () {
    if ($(window).scrollTop() >= 200) {
      $('.page-header__wrap').addClass('scrolled');
    } else {
      $('.page-header__wrap').removeClass('scrolled');
    }
  });

  var headerTopHeight = $('.page-header__top-wrap').outerHeight();

  $(window).on('scroll', function () {
    if ($(window).scrollTop() >= headerTopHeight) {
      $('.page-header__bottom-wrap').addClass('scrolled');
    } else {
      $('.page-header__bottom-wrap').removeClass('scrolled');
    }
  });

  // Adding styles to menu links when scrolling
  $(window).scroll(function () {
    var $sections = $('.block');

    $sections.each(function (i, el) {
      var top = $(el).offset().top - 81;
      var bottom = top + $(el).height();
      var scroll = $(window).scrollTop();
      var id = $(el).attr('id');

      if (scroll > top && scroll < bottom) {
        $('a.main-nav__link.active').removeClass('active');
        $('a[href="#' + id + '"]').addClass('active');
      }

    });
  });

  // Scroll to section by menu link and close menu if click on the link
  $('.menu').on('click', 'a', function (event) {
    event.preventDefault();

    if ($(window).width() < 940) {
      $('.menu__btn').removeClass('active');
      $('.menu').removeClass('active');
    }

    var id = $(this).attr('href'),
      top = $(id).offset().top - 80;
    if ($(window).width() >= '1170') {
      top = $(id).offset().top - 80;
    }
    $('body, html').animate({
      scrollTop: top
    }, 300);
  });

  $('.page-footer__nav-link').click(function (evt) {
    evt.preventDefault();

    var id = $(this).attr('href'),
      top = $(id).offset().top - 80;
    if ($(window).width() >= '1170') {
      top = $(id).offset().top - 80;
    }
    $('body, html').animate({
      scrollTop: top
    }, 300);
  });

  $('.open-recall-modal-btn').click(function (evt) {
    evt.preventDefault();
    $('#modal-call-back').addClass('active');
    $('.overlay').addClass('active');
  });

  if ($(window).width() > 940) {
    $('.call-button').click(function (evt) {
      evt.preventDefault();
      $('#modal-call-back').addClass('active');
      $('.overlay').addClass('active');
    })
  }

  $(window).resize(function () {
    if ($(window).width() > 940) {
      $('.call-button').click(function (evt) {
        evt.preventDefault();
        $('#modal-call-back').addClass('active');
        $('.overlay').addClass('active');
      })
    }
  });

  $('.modal-close').click(function (evt) {
    evt.preventDefault();
    $('.modal').removeClass('active');
    $('.overlay').removeClass('active');
  });

  $('.overlay').click(function (evt) {
    $('.modal').removeClass('active');
    $('.overlay').removeClass('active');
    $('.product__details').removeClass('active');
  });

  $('.open-details-btn').click(function (evt) {
    evt.preventDefault();
    $(this).closest('.product').find('.product__details').addClass('active');
    $('.overlay').addClass('active');
  })

  $('.product-details-close').click(function (evt) {
    evt.preventDefault();
    $('.modal-details').removeClass('active');
    $('.overlay').removeClass('active');
  });




  //initialize swiper when document ready
  var heroSlider = new Swiper('.hero-slider', {
    speed: 600,
    parallax: true,
    slidesPerView: 1,
    autoplay: {
      delay: 5000
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });

  var testimonialsSlider = new Swiper('.testimonials-slider', {
    slidesPerView: 1,
    spaceBetween: 20,
    autoplay: {
      delay: 5000
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      750: {
        slidesPerView: 2,
        spaceBetween: 0,
      },
      1024: {
        slidesPerView: 2,
        spaceBetween: 20,
      }
    }
  });

  var parthnersSlider = new Swiper('.parthners-slider', {
    slidesPerView: 1,
    spaceBetween: 20,
    autoplay: {
      delay: 5000
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      400: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      600: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      800: {
        slidesPerView: 4,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 5,
        spaceBetween: 20,
      }
    }

  });



});
