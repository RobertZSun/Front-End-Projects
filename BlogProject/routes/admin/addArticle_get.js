// import the article collection of the database
const Article = require('../../model/article').Article;

async function addArticleForGet(req, res) {

    // req.app.locals.currentLink = 'article';
    res.locals.currentLink = 'article';

    // let articleID = req.query.id;

    res.render('admin/article-edit.art', {
        taskInfo: 'Publish Article',
        buttonText: 'Submit',
    });

}

module.exports.addArticleForGet = addArticleForGet;