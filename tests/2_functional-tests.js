
const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  let bookID;

  suite('Routing tests', function() {

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai
        .request(server)
        .post("/api/books")
        .send({title:"testBook"})
        .end((err,res)=>{
          assert.equal(res.status,200);
          bookID = res.body._id;
          assert.equal(res.body.title,"testBook");
          done();
        })
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai
        .request(server)
        .post("/api/books")
        .send({})
        .end((err,res)=>{
          assert.equal(res.status,200);
          assert.equal(res.text,"missing required field title");
          done();
        })
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai
        .request(server)
        .get('/api/books')
        .end((err,res)=>{
          assert.equal(res.status,200);
          assert.isArray(res.body);
          done();
        })
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai
        .request(server)
        .get('/api/books/abcd')
        .end((err,res)=>{
          assert.equal(res.status,200);
          assert.equal(res.text,"no book exists");
          done();
        })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai
        .request(server)
        .get("/api/books/"+bookID)
        .end((err,res)=>{
          assert.equal(res.status,200);
          assert.equal(res.body.title,'testBook');
          done();
        })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai
        .request(server)
        .post("/api/books/"+bookID)
        .send({comment:"good"})
        .end((err,res)=>{
          assert.equal(res.status,200);
          assert.equal(res.body.comments[0],'good');
          done();
        })
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai
        .request(server)
        .post("/api/books/"+bookID)
        .send({})
        .end((err,res)=>{
          assert.equal(res.status,200);
          assert.equal(res.text,"missing required field comment");
          done();
        })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai
        .request(server)
        .post("/api/books/abcdef")
        .send({comment:"bad"})
        .end((err,res)=>{
          assert.equal(res.status,200);
          assert.equal(res.text,"no book exists");
          done();
        })
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai
        .request(server)
        .delete('/api/books/'+bookID)
        .end((err,res)=>{
          assert.equal(res.status,200);
          assert.equal(res.text,"delete successful");
          done();
        })
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai
        .request(server)
        .delete('/api/books/abcdefg')
        .end((err,res)=>{
          assert.equal(res.status,200);
          assert.equal(res.text,"no book exists");
          done();
        })
      });

    });

  });

});
