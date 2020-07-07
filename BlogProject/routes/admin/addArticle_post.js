// import the article collection of the database
const Article = require('../../model/article').Article;
const path = require('path');
const formidable = require('formidable');


function addArticleForPost(req, res, next) {
    const form = new formidable.IncomingForm();
    let uploadDir = path.join(__dirname, '../../public/uploads');
    // console.log(uploadDir);
    form.uploadDir = uploadDir;
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
        // err: error message if parsed failed
        // fields: regular form data
        // files: uploaded file
        let uploadedFileDir = files.coverImage.path.split('public')[1];

        await Article.create({
            title: fields.title,
            author: fields.author,
            publishedDate: fields.publishedDate,
            coverImage: uploadedFileDir,
            content: fields.content,
        }).then(result => {
            console.log('article: "' + result.title + '" published successfully');
        }).catch(error => {
            console.log(error);
        });

        res.redirect('/admin/articles');
    });

}






module.exports.addArticleForPost = addArticleForPost;