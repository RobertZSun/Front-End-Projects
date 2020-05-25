$(function () {
    var banner = $(".jd_gallery");
    var bannerWidth = banner.width()


    var imgBox = banner.find("ul:first-child");

    var indicators = banner.find("ul:last-child").find("li");

    var firstImg = imgBox.find("li:first");
    var lastImg = imgBox.find("li:last");

    imgBox.append(firstImg.clone());
    imgBox.prepend(lastImg.clone());

    var lis = imgBox.find("li");
    var numOflis = lis.length;

    imgBox.width(numOflis * bannerWidth);

    lis.css("width", bannerWidth + "px");

    var index = 1;
    var loopID = setInterval(animationForSlides, 2000);

    function animationForSlides() {
        index++;
        $(".gallery_pictures").css("transition", "left 0.5s");
        imgBox.animate({
            "left": -index * bannerWidth,
        }, 200, "ease-in-out", function () {
            if (index == numOflis - 1) {
                index = 1;
            } else if (index == 0) {
                index = numOflis - 2;
            }
            $(".gallery_pictures").css("transition", "none");
            imgBox.css("left", -index * bannerWidth);

            indicators.removeClass("chosen");
            indicators.eq(index - 1).addClass("chosen");
        });
    }

    slideEvent();
    // Add slide event
    function slideEvent() {
        // Swipe left
        imgBox.on("swipeLeft", function () {
            clearInterval(loopID);
            index++;
            moveSlide();
            loopID = setInterval(animationForSlides, 2000);
        });

        // Swipe right
        imgBox.on("swipeRight", function () {
            clearInterval(loopID);
            index--;
            moveSlide();
            loopID = setInterval(animationForSlides, 2000);
        });
        // loopID = setInterval(animationForSlides, 2000);
    }

    function moveSlide() {
        imgBox.animate({
            "left": -index * bannerWidth,
        }, 200, "ease-in-out", function () {
            if (index == numOflis - 1) {
                index = 1;
            } else if (index == 0) {
                index = numOflis - 2;
            }
            $(".gallery_pictures").css("transition", "none");
            imgBox.css("left", -index * bannerWidth);

            indicators.removeClass("chosen");
            indicators.eq(index - 1).addClass("chosen");
        });
    }
});