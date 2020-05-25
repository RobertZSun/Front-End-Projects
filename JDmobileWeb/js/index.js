$(function () {

    searchBoxFade();

    countDown();

    carousels();

    $(".jd_promotions").click(function (){
        window.open("./category.html", '_blank');
    });
});

// search box fade in or out
function searchBoxFade() {
    var gallery = $(".jd_gallery");
    var heightOfGallery = gallery.height();

    $(document).scroll(function () {
        var offScreenDistance = $(this).scrollTop();

        if (offScreenDistance < heightOfGallery) {
            var opacity = (offScreenDistance / heightOfGallery) <= 1 ? offScreenDistance / heightOfGallery : 1;
            $(".jd_search").css("background-color", "rgba(233, 35, 34," + opacity + ")");
        }
    });
}

// seckilling product time counting down
function countDown(varTime) {
    var generalTimeBox = $(".sk_countdown .bbg");
    varTime = varTime || 3700;
    var hours = Math.floor(varTime / 3600);
    var minutes = Math.floor((varTime % 3600) / 60);
    var seconds = Math.floor(varTime % 60);

    // console.log("h: " + hours + "---- minutes: " + minutes + "------ seconds: " + seconds);

    var countDownID = setInterval(function () {

        if (seconds > 0) {
            seconds -= 1;
        } else {
            if (minutes > 0) {
                minutes -= 1;
                seconds = 59;
            } else {
                if (hours > 0) {
                    hours -= 1;
                    minutes = 59;
                    seconds = 59;
                } else {
                    clearInterval(countDownID);
                    return;
                }
            }
        }

        generalTimeBox.eq(0).text(Math.floor(hours / 10));
        generalTimeBox.eq(1).text(Math.floor(hours % 10));

        generalTimeBox.eq(2).text(Math.floor(minutes / 10));
        generalTimeBox.eq(3).text(Math.floor(minutes % 10));

        generalTimeBox.eq(4).text(Math.floor(seconds / 10));
        generalTimeBox.eq(5).text(Math.floor(seconds % 10));

    }, 1000)
}

// Carousels
function carousels() {

    // add additional first and last image to implement the full function
    var lis = $(".gallery_pictures li");
    $(".gallery_pictures").prepend(lis.eq(lis.length - 1).clone());
    $(".gallery_pictures").append(lis.eq(0).clone());

    // set the correct width of the gallery and each image
    var widthOfGallery = (lis.length + 2) * 100 + "%";
    var widthOfLi = Math.floor((100 / (lis.length + 2)) * 100) / 100 + "%";

    $(".gallery_pictures").css({
        "width": widthOfGallery,
    })
    $(".gallery_pictures li").css({
        "width": widthOfLi,
    })


    // add cordinate dots make it consistent with the number of original images
    var liDotsNum = $(".picture_indexes li").length;
    if (lis.length >= liDotsNum) {
        for (let index = 0; index < lis.length - liDotsNum; index++) {
            $("<li></li>").appendTo($(".picture_indexes"));
        }
    } else {
        for (let index2 = 0; index2 < liDotsNum - lis.length; index2++) {
            $(".picture_indexes li:last-child").remove();
        }
    }

    // carousel actual function
    var imageIndex = 1;
    var widthNow;
    var intervalID = setInterval(loopFunc, 2000);

    function loopFunc() {
        imageIndex++;

        widthNow = "-" + ((imageIndex * 100) + "%");

        $(".gallery_pictures").css("transition", "left 0.5s");
        $(".gallery_pictures").css("left", widthNow);

        setTimeout(function () {
            if (imageIndex == lis.length + 1) {
                $(".gallery_pictures").css("transition", "none");
                widthNow = "-100%";
                $(".gallery_pictures").css("left", widthNow);
                imageIndex = 1;
            }
        }, 500);
        $(".gallery_pictures").css("transform", "translateX(0px)");
    }

    var originalX, translateX, distanceX;
    var transitionDone = true;

    $(".gallery_pictures").on('touchstart', function (e) {
        $(".gallery_pictures").css("transition", "none");
        originalX = e.originalEvent.targetTouches[0].clientX;
        clearInterval(intervalID);
    });

    $(".gallery_pictures").on('touchmove', function (e) {
        if (transitionDone) {
            translateX = e.originalEvent.targetTouches[0].clientX;
            distanceX = translateX - originalX;
            $(".gallery_pictures").css("transform", "translateX(" + distanceX + "px)");
        }
       
    });

    $(".gallery_pictures").on('touchend', function (e) {
        transitionDone =false;
        $(".gallery_pictures").css("transform", "translateX(0px)");
        if (Math.abs(distanceX) > ($(window).width() / 3)) {
            // former slide
            if (distanceX > 0) {
                imageIndex--;
            } else { // latter slide
                imageIndex++;
            }
            widthNow = "-" + ((imageIndex * 100) + "%");
            $(".gallery_pictures").css("left", widthNow);
        } else if (Math.abs(distanceX) > 0) {
            $(".gallery_pictures").css("left", widthNow);
        }
        $(".gallery_pictures").css("transition", "left 0.5s");
        distanceX = 0;
        intervalID = setInterval(loopFunc, 2000);
    });

    // boundary value condition
    $(".gallery_pictures").on('webkitTransitionEnd', function (e) {
        if (imageIndex == 0) {
            imageIndex = lis.length;
            $(".gallery_pictures").css("transition", "none");
            widthNow = "-" + ((imageIndex * 100) + "%");
            $(".gallery_pictures").css("left", widthNow);
        } else if (imageIndex == lis.length + 1) {
            imageIndex = 1;
            $(".gallery_pictures").css("transition", "none");
            widthNow = "-" + ((imageIndex * 100) + "%");
            $(".gallery_pictures").css("left", widthNow);
        }
        setIndexDot(imageIndex);
        transitionDone = true;
    });


    function setIndexDot(index) {
        $(".picture_indexes li").removeClass("chosen");
        $(".picture_indexes li").eq(index-1).addClass("chosen");
    }
    
}