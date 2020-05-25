window.onload = function () {
    var categories_on_left = document.querySelector(".categories_on_left");
    var divCategoryHeight = categories_on_left.offsetHeight;
    var ulsForCategory = categories_on_left.querySelector("ul:first-child");
    var lisForCategory = ulsForCategory.querySelectorAll("li");
    var ulsHeight = ulsForCategory.offsetHeight;
    var minTop = divCategoryHeight - ulsHeight;
    var maxTop = 0;

    var beginningY = 0;
    var offsetY = 0;
    var distanceY = 0;
    var lastTimeDistanceY = 0;
    var finalDistanceY = 0;

    ulsForCategory.addEventListener("touchstart", function (e) {
        beginningY = e.targetTouches[0].clientY;
    });

    ulsForCategory.addEventListener("touchmove", function (e) {
        offsetY = e.targetTouches[0].clientY;
        distanceY = offsetY - beginningY;
        ulsForCategory.style.transition = "none";

        if ((lastTimeDistanceY + distanceY) < maxTop && (lastTimeDistanceY + distanceY) > minTop) {
            finalDistanceY = lastTimeDistanceY + distanceY
        } else if ((lastTimeDistanceY + distanceY) < minTop) {
            finalDistanceY = minTop;
        } else if ((lastTimeDistanceY + distanceY) > maxTop) {
            finalDistanceY = maxTop;
        }
        ulsForCategory.style.top = finalDistanceY + "px";
    });

    ulsForCategory.addEventListener("touchend", function (e) {
        lastTimeDistanceY = finalDistanceY;
    });

    // add index to the lis for categories
    for (let i = 0; i < lisForCategory.length; i++) {
        lisForCategory[i].index = i;
    }

    // **********************************
    // method one implement the tap func using wrapped method
    // **********************************
    // itcast.tap(ulsForCategory, function (e) {
    //     let goUpDistance = 0;
    //     for (let i = 0; i < lisForCategory.length; i++) {
    //         lisForCategory[i].classList.remove("active");
    //     }
    //     var tappedLi = e.target.parentNode;
    //     var heightOfLi = tappedLi.offsetHeight;

    //     tappedLi.classList.add("active");

    //     // extract the index property
    //     var index = tappedLi.index;

    //     ulsForCategory.style.transition = "top 0.5s"
    //     goUpDistance = (-index *heightOfLi) < minTop ? minTop : (-index *heightOfLi);

    //     ulsForCategory.style.top = goUpDistance +"px"
    //     lastTimeDistanceY = goUpDistance;
    //  });

    // **********************************
    // method two adopted the zepto package to implement the tap func
    // **********************************
    // $(ulsForCategory).on("tap", function(e) {
    //     let goUpDistance = 0;
    //         for (let i = 0; i < lisForCategory.length; i++) {
    //             lisForCategory[i].classList.remove("active");
    //         }
    //         var tappedLi = e.target.parentNode;
    //         var heightOfLi = tappedLi.offsetHeight;

    //         tappedLi.classList.add("active");

    //         // extract the index property
    //         var index = tappedLi.index;

    //         ulsForCategory.style.transition = "top 0.5s"
    //         goUpDistance = (-index *heightOfLi) < minTop ? minTop : (-index *heightOfLi);

    //         ulsForCategory.style.top = goUpDistance +"px"
    //         lastTimeDistanceY = goUpDistance;
    // });


    // using fastClick to fix the tap and click occurs at the same time issue
    $(function () {
        FastClick.attach(document.body);
    });
    ulsForCategory.addEventListener("click", function (e) {
        let goUpDistance = 0;
        for (let i = 0; i < lisForCategory.length; i++) {
            lisForCategory[i].classList.remove("active");
        }  
        var tappedLi = e.target.parentNode;
        var heightOfLi = tappedLi.offsetHeight;

        tappedLi.classList.add("active");

        // extract the index property
        var index = tappedLi.index;

        ulsForCategory.style.transition = "top 0.5s"
        goUpDistance = (-index * heightOfLi) < minTop ? minTop : (-index * heightOfLi);

        ulsForCategory.style.top = goUpDistance + "px"
        lastTimeDistanceY = goUpDistance;
    });


    

}