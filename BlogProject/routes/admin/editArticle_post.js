// import the article collection of the database
const Article = require('../../model/article').Article;
const path = require('path');
const formidable = require('formidable');

function editArticleForPost(req, res, next) {
    
    const form = new formidable.IncomingForm();
    let uploadDir = path.join(__dirname, '../../public/uploads');
    // console.log(uploadDir);
    form.uploadDir = uploadDir;
    form.keepExtensions = true;
    
    form.parse(req, async (err, fields, files) => {
        // console.log(fields);
        // err: error message if parsed failed
        // fields: regular form data
        // files: uploaded file
        let uploadedFileDir = files.coverImage.path.split('public')[1];
        if (err) {
            console.log(err);
        }

        await Article.findByIdAndUpdate(
            fields.articleID, {
                title: fields.title,
                author: fields.author,
                publishedDate: fields.publishedDate,
                coverImage: uploadedFileDir,
                content: fields.content,
            }, {
                new: true
            }, (err, result) => {
                if (err) {
                    next(err);
                }
                console.log('article: "' + result.title + '" updated successfully');
            });

        res.redirect('/admin/articles');
    });
}





module.exports.editArticleForPost = editArticleForPost;


