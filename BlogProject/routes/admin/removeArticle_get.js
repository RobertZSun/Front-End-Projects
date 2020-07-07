// import the article collection of the database
const Article = require('../../model/article').Article;

async function removeArticleForGet(req,res) {
    let articleID = req.query.id;
    console.log(articleID);
    
    await Article.findByIdAndDelete(articleID, (err, result) => {
        if (err) {
            next(err);
        }
        console.log("删除成功！",result.title);
    });
    res.redirect('/admin/articles');
}


module.exports.removeArticleForGet = removeArticleForGet;