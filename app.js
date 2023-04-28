const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
 
const app = express();
 
app.set('view engine', 'ejs');
 
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
 
//TODO
main().catch(err => console.log(err));
 
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/WikiDB');
}  
// mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser:true});
 
const articleSchema=new mongoose.Schema({
    title: String,
    content:String
});
 
const Article= mongoose.model("Article",articleSchema);

app.route("/articles")
.get(async(req,res)=>{
    try{
    const foundArticles= await Article.find();
        // console.log(foundArticles);
        res.send(foundArticles);
    }catch(err){
        // console.log(err);
        res.send(err);
    }
})

.post( async (req, res) => {
    const newArticle = new Article ({
        title: req.body.title,
        content: req.body.content
    })
    newArticle.save().then(success => {
        console.log("Succesfully added a new article");
    }).catch(err => {
        console.log(err);
    })
})

.delete(function(req ,res){
Article.deleteMany({}).then(function (){
res.send("successfully deleted all articles");
}) .catch(err =>{
res.send(err);
});
});

// Request Targerting a Specific Article

app.route("/articles/:articleTitle")
 
.get( async(req, res) =>{
    await Article.findOne({title: req.params.articleTitle}) .then(foundArticle =>{
        if(foundArticle){
            res.send(foundArticle);
        } else{
            res.send("No articles matching that title was found.")
        }
    }) .catch(err =>{
        console.log(err);
    });
})

.put((req, res) => {
   Article.replaceOne({title: req.params.articleTitle} , {title: req.body.articleTitle , content: req.body.content} , {overwriteDiscriminatorKey: true})
   .then(() => {
    res.send("Replaced Articles.");
   })
   .catch(err => {
    res.send(err);
   })
  })

.patch((req, res) => {
   Article.updateOne({title: req.params.articleTitle} ,{$set: req.body} , {overwriteDiscriminatorKey: true})
   .then(() => {
    res.send("Patched Articles.");
   })
   .catch(err => {
    res.send(err);
   })
  })

.delete((req, res) => {
   Article.deleteOne({title: req.params.articleTitle})
   .then(() => {
    res.send("Deleted Articles.");
   })
   .catch(err => {
    res.send(err);
   })
  })

app.listen(3000, function() {
    console.log("Server started on port 3000");
});