// import the article collection of the database
const Article = require('../../model/article').Article;
const pagination = require('mongoose-sex-page');


async function listArticlesForGet(req, res) {

    // req.app.locals.currentLink = 'article';
    res.locals.currentLink = 'article';


    let requestedPage = req.query.page || 1;
    let articlesPerPage = 5;
    let indexesPerPage = 5;
    let pageNow = null;
    let sumOfArticles = null;
    // let sumOfArticles = await Article.countDocuments();
    let totalPageNum = null;
    let pageNums = null;;


    let allArticlesInfo = null;
    // await Article.find().limit(itemNumInPerPage).skip(pastItems).then((result) => {
    await pagination(Article).find().page(requestedPage).size(articlesPerPage).display(indexesPerPage).populate('author', 'username _id').exec()
        .then((result) => {
            allArticlesInfo = result.records;
            sumOfArticles = result.total;
            pageNow = result.page;
            totalPageNum = result.pages;
            pageNums = result.display;
            // console.log(allArticlesInfo);
        }).catch((err) => {
            console.log(err);
        });
    res.render('admin/article', {
        articleList: allArticlesInfo,
        sumOfArticles: sumOfArticles,
        currentPage: pageNow,
        totalPageNum: totalPageNum,
        currentPageNumRange: pageNums,
        pageTitle: 'Welcome to My Blog',
    });
    console.log("welcome to list articles page ");

}

module.exports.listArticlesForGet = listArticlesForGet;