window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'UA-176939797-1'); 

(function ($) {
    "use strict";

    var prevScrollpos = $(window).scrollTop();


    $(window).on('load', function () {
        stopAnimateOnScroll();
        setPortfolio();
        setTotalPageNumber();
        setDataNumberForSections();
        setActiveMenuItem();
        setSlowScroll();
        setMenu();
        skillFill();
        portfolioItemContentLoadOnClick();
        setParallax();
        sendMail();
        imageSliderSetUp();
        setHash();
        $('.doc-loader').fadeOut();
    });

    $(window).on('resize', function () {
        skillFill();
        setActiveMenuItem();
    });

    $(window).on('scroll', function () {
        skillFill();
        setActiveMenuItem();
    });


//------------------------------------------------------------------------
//Helper Methods -->
//------------------------------------------------------------------------


    function stopAnimateOnScroll() {
        $("html, body").on("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove", function () {
            $("html, body").stop();
        });
    }

    function setPortfolio() {
        var grid = $('.grid').imagesLoaded(function () {
            grid.isotope({
                percentPosition: true,
                itemSelector: '.grid-item',
                masonry: {
                    columnWidth: '.grid-sizer'
                }
            });
        });
    }

    function setHash() {
        var hash = location.hash;
        if ((hash !== '') && ($(hash).length)) {
            $('html, body').animate({scrollTop: $(hash).offset().top}, 1);
            $('html, body').animate({scrollTop: $(hash).offset().top}, 1);
        } else {
            $(window).scrollTop(1);
            $(window).scrollTop(0);
        }
    }

    function setTotalPageNumber() {
        $('.total-pages-num').html(('0' + $('.page-wrapper .section').length).slice(-2));
    }

    function setDataNumberForSections() {
        var k = 1;
        $('.page-wrapper .section').each(function () {
            $(this).data('num', ('0' + k).slice(-2));
            k++;
        });
    }

    function setActiveMenuItem() {
        var currentSection = null;
        var c = $('.page-wrapper .section.section-active').data("num");
        $('.section').each(function () {
            var element = $(this).attr('id');
            if ($('#' + element).is('*')) {
                if ($(window).scrollTop() >= $('#' + element).offset().top - 150) {
                    currentSection = element;
                }
            }
        });
        $('.nav-menu ul li').removeClass('current').find('a[href*="#' + currentSection + '"]').parent().addClass('current');
        $('.page-wrapper .section').removeClass('section-active');
        $('#' + currentSection).addClass('section-active');
        if (c !== $('#' + currentSection).data("num")) {
            c = $('#' + currentSection).data("num");
            $('.current-num span').animate({"opacity": '0', "left": "-5px"}, 150, function () {
                $(this).text(c).animate({"opacity": '1', "left": "0"}, 150);
            });
        }
    }

    function setSlowScroll() {
        $('.nav-menu ul li a[href^="#"], a.button, .slow-scroll').on("click", function (e) {
            if ($(this).attr('href') === '#') {
                e.preventDefault();
            } else {
                gtag('event', 'entrar', {'event_category': 'Página', 'event_label':$(this).data('titulo')});
                $('html, body').animate({scrollTop: $(this.hash).offset().top}, 1500);
                return false;
            }
        });
    }

    function skillFill() {
        if ($('.skill-fill')[0]) {
            $(".skill-fill:not(.animation-done").each(function (i) {
                var top_of_object = $(this).offset().top;
                var bottom_of_window = $(window).scrollTop() + $(window).height();
                if ((bottom_of_window - 70) > top_of_object) {
                    $(this).width($(this).data("fill"));
                    $(this).addClass('animation-done');
                }
            });
        }
    }

    function setMenu() {

        $('.nav-btn').on('click', function () {
            $('.nav-btn, .s-nav').toggleClass('active');
            return false;
        });

        if ($(window).width() > 1200) {
            $('.dropdown').on('mouseenter', function () {
                $(this).find('ul').show('ease');
            });
            $('.nav-list').on('mouseleave', function () {
                $('.dropdown ul').hide('ease');
            });
        } else {
            $('.dropdown').on('click', function () {
                $(this).find('ul').toggle('ease');
            });

        }

        $('.nav-list>li>a').on('click', function () {
            if ($(window).width() < 1200) {
                $('.s-nav, .nav-btn').toggleClass('active');
            }
        });
    }

    function portfolioItemContentLoadOnClick() {
        $('.ajax-portfolio').on('click', function (e) {
            e.preventDefault();
            var portfolioItemID = $(this).data('id');
            $(this).closest('.grid-item').addClass('portfolio-content-loading');
            $('#portfolio-grid').addClass('portfoio-items-mask');
            if ($("#pcw-" + portfolioItemID).length) {
                $('html, body').animate({scrollTop: $('#portfolio-wrapper').offset().top - 150}, 400);
                setTimeout(function () {
                    $('#portfolio-grid').addClass('hide');
                    setTimeout(function () {
                        $("#pcw-" + portfolioItemID).addClass('show');
                        $('.portfolio-load-content-holder').addClass('show');
                        $('.grid-item').removeClass('portfolio-content-loading');
                        $('#portfolio-grid').hide().removeClass('portfoio-items-mask');
                    }, 300);
                }, 500);
            } else {
                loadPortfolioItemContent(portfolioItemID);
            }
        });
    }

    function loadPortfolioItemContent(portfolioItemID) {
        $.ajax({
            url: $('.ajax-portfolio[data-id="' + portfolioItemID + '"]').attr('href'),
            type: 'GET',
            success: function (html) {
                var getPortfolioItemHtml = $(html).find(".portfolio-item-wrapper").html();
                $('.portfolio-load-content-holder').append('<div id="pcw-' + portfolioItemID + '" class="portfolio-content-wrapper">' + getPortfolioItemHtml + '</div>');
                if (!$("#pcw-" + portfolioItemID + " .close-icon").length) {
                    $("#pcw-" + portfolioItemID).prepend('<div class="close-icon"></div>');
                }
                $('html, body').animate({scrollTop: $('#portfolio-wrapper').offset().top - 150}, 400);
                setTimeout(function () {
                    $("#pcw-" + portfolioItemID).imagesLoaded(function () {
                        imageSliderSetUp();
                        setSlowScroll();
                        $('#portfolio-grid').addClass('hide');
                        setTimeout(function () {
                            $("#pcw-" + portfolioItemID).addClass('show');
                            $('.portfolio-load-content-holder').addClass('show');
                            $('.grid-item').removeClass('portfolio-content-loading');
                            $('#portfolio-grid').hide().removeClass('portfoio-items-mask');
                        }, 300);
                        $('.close-icon').on('click', function (e) {
                            var portfolioReturnItemID = $(this).closest('.portfolio-content-wrapper').attr("id").split("-")[1];
                            $('.portfolio-load-content-holder').addClass("viceversa");
                            $('#portfolio-grid').css('display', 'block');
                            setTimeout(function () {
                                $('#pcw-' + portfolioReturnItemID).removeClass('show');
                                $('.portfolio-load-content-holder').removeClass('viceversa show');
                                $('#portfolio-grid').removeClass('hide');
                            }, 300);
                            setTimeout(function () {
                                $('html, body').animate({scrollTop: $('#p-item-' + portfolioReturnItemID).offset().top - 150}, 400);
                            }, 500);
                        });
                    });
                }, 500);
            }
        });
        return false;
    }

    function imageSliderSetUp() {
        $(".image-slider").each(function () {
            var speed_value = $(this).data('speed');
            var auto_value = $(this).data('auto');
            var hover_pause = $(this).data('hover');
            if (auto_value === true) {
                $(this).owlCarousel({
                    loop: true,
                    autoHeight: true,
                    smartSpeed: 1000,
                    autoplay: auto_value,
                    autoplayHoverPause: hover_pause,
                    autoplayTimeout: speed_value,
                    responsiveClass: true,
                    items: 1
                });
                $(this).on('mouseleave', function () {
                    $(this).trigger('stop.owl.autoplay');
                    $(this).trigger('play.owl.autoplay', [auto_value]);
                });
            } else {
                $(this).owlCarousel({
                    loop: true,
                    autoHeight: true,
                    smartSpeed: 1000,
                    autoplay: false,
                    responsiveClass: true,
                    items: 1
                });
            }
        });
    }

    function setParallax() {
        $('[data-jarallax-element]').jarallax({
            speed: 0.2
        });
    }

    function isValidEmailAddress(emailAddress) {
        var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        return pattern.test(emailAddress);
    }

    function sendMail() {
        $('.contact-form [type="submit"]').on('click', function () {

            var emailVal = $('#contact-email').val();

            if (isValidEmailAddress(emailVal)) {
                var params = {
                    'action': 'SendMessage',
                    'name': $('#name').val(),
                    'email': $('#contact-email').val(),
                    'subject': $('#subject').val(),
                    'message': $('#message').val()
                };
                $.ajax({
                    type: "POST",
                    url: "https://osborn.cl/pmasquiaran/php/sendMail.php",
                    data: params,
                    beforeSend: function(xhr) {
                        $('#alerta').css({'visibility':'visible'});
                    },
                    success: function (response) {
                        if (response) {
                            var responseObj = $.parseJSON(response);
                            if (responseObj.ResponseData) {
                                gtag('event', 'enviar', { 'event_category': 'Contacto', 'event_label': $('#subject').val()});
                                $('input[name=your-name]').val('');
                                $('input[name=your-email]').val('');
                                $('input[name=your-subject]').val('');
                                $('textarea').val('');
                                $('input[name=your-name]').focus();
                                $('#alerta').text(responseObj.ResponseData).fadeIn(900);
                                setTimeout(function(){
                                    $('#alerta').fadeOut(900, function(){
                                        $(this).empty();
                                    });
                                }, 3600);
                            }
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        //xhr.status : 404, 303, 501...
                        var error = null;
                        switch (xhr.status)
                        {
                            case "301":
                                error = "¡Error de redirección!";
                                break;
                            case "307":
                                error = "¡Error, redirección temporal del servidor!";
                                break;
                            case "400":
                                error = "¡Solicitud incorrecta!";
                                break;
                            case "404":
                                error = "¡Página no encontrada!";
                                break;
                            case "500":
                                error = "¡El servidor actualmente no está disponible!";
                                break;
                            default:
                                error = "Error inesperado. Vuelve a intentarlo más tarde.";
                        }
                        if (error) {
                            $('#alerta').text(error).fadeIn(900);
                            setTimeout(function(){
                                $('#alerta').fadeOut(900, function(){
                                    $(this).empty();
                                });
                            }, 3600);
                        }
                    }
                });
            } else {
                $('#alerta').text('Tu email no tiene un formato válido.').fadeIn(900);
                setTimeout(function() {
                    $('#alerta').fadeOut(900, function(){
                        $(this).empty();
                    });
                }, 3600);
            }

        });
    }

}(jQuery));
