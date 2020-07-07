// import the article collection of the database
const Article = require('../../model/article').Article;
const Comment = require('../../model/comment').Comment;



async function readOneArticleForGet(req, res, next) {
    let articleID = req.query.id;
    let queriedData = null;
    let commentData = null;

    if (articleID) {
        await Article.findOne({
                '_id': articleID
            })
            .populate('author', 'username')
            .then(data => {
                queriedData = data;
            }).catch(err => {
                next(err);
            });

        await Comment.find({
                'articleID': articleID
            })
            .sort('-time')
            .populate('userID', 'username')
            .then(data => {
                commentData = data;
            }).catch(err => {
                next(err);
            });

        res.render('home/article', {
            articleTitle: queriedData.title,
            articleID: articleID,
            articleAuthor: queriedData.author.username,
            articleDate: queriedData.publishedDate,
            articleContent: queriedData.content,
            commentData: commentData,
            pageTitle: queriedData.title,
        });
    } else {
        res.redirect('/home');
    }

}
module.exports.readOneArticleForGet = readOneArticleForGet;