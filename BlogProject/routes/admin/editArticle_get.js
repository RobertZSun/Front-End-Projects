// import the article collection of the database
const Article = require('../../model/article').Article;

async function editArticleForGet(req, res) {

    // req.app.locals.currentLink = 'article';
    res.locals.currentLink = 'article';

    let articleID = req.query.id;

    await Article.findById(articleID, (err, data) => {
        if (err) {
            next(err);
        }
        res.render('admin/article-edit', {
            taskInfo: 'Edit Article',
            articleTitle: data.title,
            articleID: articleID,
            actionLink: '/admin/article-edition',
            articleDate: data.publishedDate,
            articleImgDir: data.coverImage,
            articleContent: data.content,
            buttonText: 'Update',
        });
        return;
    });
}

module.exports.editArticleForGet = editArticleForGet;