'use strict';

const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Reality check', function () {

  it('true should be true', function () {
    expect(true).to.be.true;
  });

  it('2 + 2 should equal 4', function () {
    expect(2 + 2).to.equal(4);
  });

});

describe('Express static', function () {

  it('GET request "/" should return the index page', function () {
    return chai.request(app)
      .get('/')
      .then(function (res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.html;
      });
  });

});

describe('404 handler', function () {

  it('should respond with 404 when given a bad path', function () {
    return chai.request(app)
      .get('/DOES/NOT/EXIST')
      .then(res => {
        expect(res).to.have.status(404);
      });
  });

});

describe('GET /api/notes', function () {

  it('should return the default of 10 Notes as an array', function () {
    return chai.request(app)
      .get('/api/notes')
      .then(function (res) {
        expect(res.body.length).equals(10);

      });
  });

  it('should return an array of objects with the id, title and content', function () {
    return chai.request(app)
      .get('/api/notes')
      .then(function (res) {
        for (let i = 0; i < res.body.length; i++){
          expect(res.body[i]).to.include.keys('id', 'title', 'content');
        }
      });
  });

  it('should return correct search results for a valid query', function () {
    const searchTerm = 'government';
    return chai.request(app)
      .get(`/api/notes?searchTerm=${searchTerm}`)
      .then(function (res) {
        res.body.forEach(function(note) {
          expect(note.title).includes(searchTerm);
        });

      });
  });

  it('should return an empty array for an incorrect query', function () {
    const searchTerm = 'gsfgsfgf';
    return chai.request(app)
      .get(`/api/notes?searchTerm=${searchTerm}`)
      .then(function (res) {
        expect(res.body.length).equals(0);
      });
  });

});

describe('GET /api/notes/:id', function () {

  it('should return correct note object with id, title and content for a given id', function () {
    const ID = 1007;
    return chai.request(app)
      .get('/api/notes/:id')
      .then(res => {

        expect(res);
      });
  });


  it('should respond with 404 when given a bad path', function () {
    return chai.request(app)
      .get('/api/notes/doesnotexist')
      .then(function(res) {
        expect(res).to.have.status(404);
      });
  });

});
//////////////////////////////////////////////
describe('POST /api/notes', function() {

  it('should create and return a new item with location header when provided valid data', function () {
    const newItem = {title: 'this is excellent title', content: 'this is content'};
    return chai.request(app)
      .post('/api/notes/')
      .send(newItem)
      .then(function (res) {
        expect(res.headers.location).to.have.string('/api/notes/1010');
      });
  });

  it('should return an object with a message property "Missing title in request body" when missing "title" field', function () {
    const newItem = {content: 'this is content'};
    return chai.request(app)
      .post('/api/notes/')
      .send(newItem)
      .then(function (res) {
        expect(res.body).to.be.a('object');
        expect(res.body.message).to.equal('Missing `title` in request body');
      });
  });

});

describe('PUT /api/notes/:id', function(){
  it('should update and return a note object when given valid data', function(){
    const updateItem = {title: 'this is excellent title', content: 'this is content'};
    return chai.request(app)
      .get('/api/notes/')
      .then(function(res){
        updateItem.id = res.body[0].id;
        return chai.request(app)
          .put(`/api/notes/${updateItem.id}`)
          .send(updateItem);
      })
      .then(function(res) {
        expect(res.body).to.be.a('object');
        expect(res.body).to.deep.equal(updateItem);
      });
  });

  it('should respond with a 404 for an invalid id', function(){
    const updateItem = {title: 'this is excellent title', content: 'this is content'};
    return chai.request(app)
      .put('/api/notes/57')
      .send(updateItem)
      .then(function(res){
        expect(res).to.have.status(404);
      });
  });

  it('should return an object with a message property "Missing title in request body" when missing "title" field', function () {
    const updateItem = {content: 'this is content'};
    return chai.request(app)
      .get('/api/notes/')
      .then(function(res){
        updateItem.id = res.body[0].id;
        return chai.request(app)
          .put(`/api/notes/${updateItem.id}`)
          .send(updateItem);
      })
      .then(function (res) {
        expect(res.body).to.be.a('object');
        expect(res.body.message).to.equal('Missing `title` in request body');
      });
  });


});

describe('DELETE /api/notes/:id', function(){
  it('should delete item by id', function(){
    return chai.request(app)
      .get('/api/notes/')
      .then(function(res){
        return chai.request(app)
          .delete(`/api/notes/${res.body[0].id}`);
      })
      .then(function(res){
        expect(res).to.have.status(204);
      });
  });
});
