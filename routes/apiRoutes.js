var express = require("express");
var router = express.Router();

var cheerio = require("cheerio");
var axios = require("axios");

var db = require("../models");
var mongojs = require('mongojs');


router.get("/scrape",function(req,res){
   
    axios.get("https://www.economist.com/latest/").then(function(response){
        var $ = cheerio.load(response.data);
      
        var articles = [];
      
        $(".teaser__group-text").each(function(i,element){
            var article = {
                title: $(this).attr("title"),
                description:$(this).children(".teaser__text").text(),
                link: "https://www.economist.com"+ $(this).parent(".teaser__link").attr("href")
            };
      
            articles.push(article)
        })
       

        return db.Article.create(articles)
       })
       .then(function(dbArtcles){
           res.json(true)
       }). catch (function(err){
           res.json(false)
       })
    });

router.get("/clear",function(req,res){
    db.Article.deleteMany({}).then(function(){
        return db.Note.deleteMany({})
    }).then(function(){
        res.json(true)
    })
});

router.get("/", function(req,res){
  db.Article.find({}).then(function(dbArtcles){
      res.render("home", {Articles:dbArtcles})
  })
});

router.get("/saved",function(req,res){
  db.Article.find({})
  .populate("notes")
  .then(function(dbArtcles){
        res.render("saved", {Articles:dbArtcles})
  })
});

router.put("/api/saved/:id",function(req,res){
 db.Article.findOneAndUpdate({_id:mongojs.ObjectId(req.params.id)},{$set:{saved:true}},{new:true})
 .then(function(){
    res.json(true)
})
.catch(function(err){
    console.log(err);
    res.json(false)
})
});

router.put("/api/delete/:id",function(req,res){
    db.Article.findOneAndUpdate({_id:mongojs.ObjectId(req.params.id)},{$set:{saved:false}},{new:true})
    .then(function(){
       res.json(true)
   })
   .catch(function(err){
       console.log(err);
       res.json(false)
   })

});

router.put("/api/addNote/:id",function(req,res){
   db.Note.create(req.body).then(function(dbNote){
       return db.Article.findOneAndUpdate({_id:mongojs.ObjectId(req.params.id)},{$push:{notes:dbNote._id}},{new:true})
   }).then(function(){
       res.json(true)
   }).catch(function(err){
       console.log(err);
       res.json(false)
   })
})
module.exports = router; 
