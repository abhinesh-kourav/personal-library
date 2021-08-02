'use strict';
const Book = require("../models").Book;

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find({},(err,data)=>{
        if(err || !data){
          res.json([]);
        }else{
          const formatData = data.map((book)=>{
            return {
              _id: book.id,
              title: book.title,
              commentcount: book.comments.length
            }
          })
          res.json(formatData);
        }
      })
    })
    
    .post(function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if(!title){
        res.send("missing required field title");
        return;
      }
      const newBook = new Book({
        title: title,
        comments: []
      })
      newBook.save((err,data)=>{
        if(err||!data){
          res.send("Error! Try again!")
        }else{
          res.json({
            _id: data._id,
            title: data.title
          })
        }
      })
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      Book.deleteMany({},(err,data)=>{
        if(err) console.log(err);
        res.send("complete delete successful");
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      if(!bookid){
        res.send("Enter ID");
        return;
      }
      Book.findById(bookid,(err,data)=>{
        if(err || !data){
          res.send("no book exists")
        }else{
          res.json({
            title: data.title,
            _id: data._id,
            comments: data.comments
          })
        }
      })
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if(!comment){
        res.send("missing required field comment")
        return;
      }
      if(!bookid){
        res.send("Enter ID");
      }
      Book.findById(bookid,(err,data)=>{
        if(err || !data){
          res.send("no book exists")
        }else{
          data.comments.push(comment);
          data.save((err,bookData)=>{
            res.json({
              title: bookData.title,
            _id: bookData._id,
            comments: bookData.comments
            })
          })
        }
      })
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      if(!bookid){
        res.send("Enter ID");
        return;
      }
      Book.findByIdAndRemove(bookid,(err,data)=>{
        if(err || !data){
          res.send("no book exists")
        }else{
          res.send("delete successful");
        }
      })
    });
  
};
