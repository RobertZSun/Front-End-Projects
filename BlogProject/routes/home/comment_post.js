// import the comment collection of the database
const Comment = require('../../model/comment').Comment;

async function storeCommentForPost(req, res) {

    let articleID = req.body.articleID;
    let userID = req.body.userID;
    let content = req.body.content;

    await Comment.create({
        articleID: articleID,
        userID: userID,
        time: new Date(),
        content: content
    }).then(result => {
        console.log('comment: "' + result.content + '" published successfully');
    }).catch(error => {
        console.log(error);
    });

    res.redirect(`/home/article?id=${articleID}`);
}





module.exports.storeCommentForPost = storeCommentForPost;