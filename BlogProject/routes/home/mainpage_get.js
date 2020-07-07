// import the article collection of the database
const Article = require('../../model/article').Article;
const pagination = require('mongoose-sex-page');

async function homepageForGet(req, res) {

    let requestedPage = req.query.page || 1;
    let articlesPerPage = 6;
    let indexesPerPage = 5;
    let pageNow = null;
    // let sumOfArticles = null;
    let totalPageNum = null;
    let pageNums = null;;


    await pagination(Article).find().page(requestedPage).size(articlesPerPage).display(indexesPerPage).populate('author', 'username _id').exec()
        .then((result) => {
            allArticlesInfo = result.records;
            pageNow = result.page;
            totalPageNum = result.pages;
            pageNums = result.display;
            // console.log(result);
            // console.log(allArticlesInfo);
        }).catch((err) => {
            console.log(err);
        });

    console.log("at main page");

    res.render('home/default', {
        pageTitle: 'Welcome to My Blog',
        articleList: allArticlesInfo,
        currentPage: pageNow,
        totalPageNum: totalPageNum,
        currentPageNumRange: pageNums,
    });
}

module.exports.homepageForGet = homepageForGet;