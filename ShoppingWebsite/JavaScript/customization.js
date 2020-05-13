$(document).ready(function () {
    // get the height of the window
    var windowHeight = $(window).height();

    var thirdSlideAnimationStart = false;
    var switchOnSec2 = true;

    $('#fullpage').fullpage({
        //options here
        autoScrolling: true,
        scrollHorizontally: true,
        scrollingSpeed: 700,

        navigation: true,
        navigationPosition: 'right',
        navigationTooltips: ['firstSlide', 'secondSlide', 'thirdSlide', 'fourthSlide', 'fifthSlide', 'sixthSlide', 'sevenSlide', 'eighthSlide'],
        keyboardScrolling: true,
        loopBottom: true,
        loopTop: true,
        loopHorizontal: true,
        sectionsColor: ['#fadd67', '#84a2d4', '#ef674d', '#fed', '#d04759', '#84d9ed ', '#8ac060', 'whitesmoke'],
        // licenseKey: '',

        afterLoad: function (anchorLink, index) {
            // enter section 2
            // if (index.index == 1 && !thirdSlideAnimationStart) {
            if (index.index == 1 && switchOnSec2) {
                $(".nextSec").fadeOut();
                $("#searchBox").show().animate({
                    "right": 370,
                }, 1500, function () {
                    $("#searchContent").animate({
                        "opacity": 1
                    }, 500, function () {
                        $("#searchBox").hide();

                        $("#wrappedSearchBox").show().animate({
                            "height": 30,
                            "right": 220,
                            "bottom": 450,
                        }, 1000);

                        $("#goodsForSofas").show().animate({
                            "height": 218,
                        }, 1000);

                        $("#wordsWhite").animate({
                            "opacity": 1,
                        }, 1000, function () {
                            $(".nextSec").fadeIn();
                        });
                    });
                    switchOnSec2 = false;
                });
                // enter section 7
            } else if (index.index == 6) {
                $(".nextSec").fadeOut();
                $(".stars").animate({
                    "width": 100,
                }, 600, function () {
                    $(".greatComment").show();
                    $(".nextSec").fadeIn();
                });
                // enter section 8
            } else if (index.index == 7) {
                $(".nextSec").fadeOut();
                $(".goToShopping").hover(function () {
                    $(".gifPic").toggle();
                });

                $(document).mousemove(function (e) {
                    var x = e.pageX;
                    var y = (e.pageY + 10) < (windowHeight - 449) ? (windowHeight - 449) : (e.pageY + 10);
                    $(".handPic").css({
                        "left": x,
                        "top": y
                    });

                });

                $(".playbackLink").click(function () {
                    $.fn.fullpage.moveTo(1);
                    switchOnSec2 = true;
                });
            }


        },

        onLeave: function (origin, destination, direction) {
            var leavingSection = this;

            //离开第二个section后
            // if (origin.index == 1 && direction == 'down' && thirdSlideAnimationStart) {
            if (origin.index == 1 && direction == 'down') {
                $(".nextSec").fadeOut();
                $(".brownSofaFormer").show().animate({
                    // "bottom": 0,
                    "bottom": -(windowHeight - 317),
                    "height": 166,
                    "left": 260,
                }, 2000, function () {
                    $(".optionsSelected").animate({
                        "opacity": 1
                    }, 500, function () {
                        $(".shoppingCart-button-Selected").animate({
                            "opacity": 1
                        }, 500, function (){
                            $(".nextSec").fadeIn();
                        });
                    })
                });
                $(".whiteCover").show();
            }

            //离开第三个section后
            if (origin.index == 2 && direction == 'down') {
                $(".nextSec").fadeOut();
                $(".brownSofaFormer").hide();
                console.log("start to set up");

                $(".inclinedBrownSofa").show().animate({
                    "bottom": -(windowHeight * 0.65 + 110),
                    "left": 350,
                }, 1000, function () {
                    $(this).hide();
                    $(".sofaInCart").show();
                    $(".shoppingcart").animate({
                        "left": "130%",
                    }, 3000, function () {
                        $(".receipt").show();
                        $(".receipt img:nth-child(1), .wordsOnPageFour-b").animate({
                            "opacity": 1,
                        }, 1000, function () {
                            $(".nextSec").fadeIn();
                        });
                    });
                });
            }

            //离开第四个section后
            if (origin.index == 3 && direction == 'down') {
                $(".nextSec").fadeOut();
                $(".hand").animate({
                    "bottom": "1%",
                }, 2000, function () {
                    $(".mouseBeforeClick").hide();
                    $(".mouseAfterClick").show();
                });
                $(".sofaOnPageFive").animate({
                    "z-index": 0,
                }, 0);

                $(".sofaOnPageFive").animate({
                    "bottom": "12%",
                }, 2200, function () {
                    $(".creditCardBill").animate({
                        "bottom": "47%",
                    }, 800, function () {
                        $(".wordsOnPageFive").addClass("wordsOnPageFiveAnimation");
                        $(".nextSec").fadeIn();
                    });
                });
            }

            //离开第五个section后
            if (origin.index == 4 && direction == 'down') {
                $(".nextSec").fadeOut();
                $(".boxOnPageSix").animate({
                    "left": "32%",
                }, 1500, function () {
                    $(".sofaOnPageSix").animate({
                        "top": "23%",
                        "left": "34%",
                        "height": 70,
                    }, 2000, function () {
                        $(".sofaOnPageSix").hide();
                        $(".boxOnPageSix").animate({
                            "bottom": "6%",
                        }, 1500, function () {
                            $(".boxOnPageSix").hide();
                            $(".addressSign").show();
                            $(".section6").animate({
                                "backgroundPositionX": "100%",
                            }, 4000, function () {
                                $(".porter").show().animate({
                                    "left": "44%",
                                }, 500);
                                $(".openDoor").show();
                                $(".receiver").show().animate({
                                    "left": "63%",
                                }, 500, function () {
                                    $(".adv").show().animate({
                                        "left": "25%",
                                    }, 2000, function() {
                                        $(".nextSec").fadeIn();
                                    });
                                    $(".greeting").show();
                                });
                            });
                        });
                    });
                });
            }
        },
    })
    //methods
    $.fn.fullpage.setAllowScrolling(true);
    $(".nextSec").click(function (e) {
        $.fn.fullpage.moveSectionDown();
    });
});
05