const chai = require('chai');

const expect = chai.expect;
const should = chai.should();
const chaiHTTP = require('chai-http');
const faker = require("faker");
const server = require("./../server");
const questions = require('./../app/dataStore/questionsTable');

chai.use(chaiHTTP);

describe('QuestionsController', () => {

    describe("/api/v1/questions", function() {
        it("should return all questions", function(done) {
            chai.request(server)
                .get("/api/v1/questions")
                .end(function(err, res) {
                    res.status.should.be.eql(200);
                    res.body.data.should.be.a("array");
                    res.body.data.length.should.be.eql(2);
                })
            done();
        });
    });

    // create
    describe("/api/v1/questions", function() {
        it("should create a question with valid question ", function(done) {
            const validQuestion = {
                createdOn: faker.date.recent(),
                userID: 1,
                meetupID: 1,
                title: faker.lorem.sentence(),
                body: faker.lorem.words(),
                upvotes: faker.random.number(),
                downvotes: faker.random.number()
            };


            chai.request(server)
                .post("/api/v1/questions")
                .send(validQuestion)
                .end(function(err, res) {
                    res.status.should.be.eql(201);
                })
            done();
        });

        it("should trigger validation erros when passed an invalid question ", function(done) {
            const invalidQuestion = {
                createdOn: faker.date.recent(),
                userID: 1,
                meetupID: 1,
                title: faker.lorem.sentence(),
                body: '',
                upvotes: faker.random.number(),
                downvotes: faker.random.number()
            };


            chai.request(server)
                .post("/api/v1/questions")
                .send(invalidQuestion)
                .end(function(err, res) {
                    res.status.should.be.eql(400);
                })
            done();
        });
    });

    // show
    describe('api/v1/questions/{questionID}', function() {
        it("should return  a question", function(done) {
            let questionID = 1;
            chai.request(server)
                .get(`/api/v1/questions/${questionID}`)
                .end(function(err, res) {
                    res.status.should.be.eql(200);
                })
            done();
        });

        it("should return error if question does not exist", function(done) {
            chai.request(server)
                .get("/api/v1/questions/90")
                .end(function(err, res) {
                    res.should.have.status(404);
                    res.body.error.should.be.eql("Question does not exist");
                });
            done();

        });
    });


    // upvotes
    describe('api/v1/questions/{questionID}/upvote', function() {
        it("should return upvotes of a question", function(done) {
            let questionID = 1;
            let questionUpvotes = questions[questionID - 1].upvotes;
            chai.request(server)
                .patch(`/api/v1/questions/${questionID}/upvote`)
                .end(function(err, res) {
                    res.status.should.be.eql(200);
                    expect(res.body.data.upvotes - questionUpvotes).to.eql(1);
                })
            done();
        });

        it("should return error if question does not exist", function(done) {
            chai.request(server)
                .patch("/api/v1/questions/90/upvote")
                .end(function(err, res) {
                    res.should.have.status(404);
                    res.body.error.should.be.eql("Question does not exist");
                });
            done();

        });
    });

    // downvotes
    describe('api/v1/questions/{questionID}/upvote', function() {
        it("should return downvotes of a question", function(done) {
            let questionID = 1;
            let questionDownvotes = questions[questionID - 1].downvotes;
            chai.request(server)
                .patch(`/api/v1/questions/${questionID}/downvote`)
                .end(function(err, res) {
                    res.status.should.be.eql(200);
                    expect(res.body.data.downvotes - questionDownvotes).to.eql(1);
                })
            done();
        });

        it("should return error if question does not exist", function(done) {
            chai.request(server)
                .patch("/api/v1/questions/90/downvote")
                .end(function(err, res) {
                    res.should.have.status(404);
                    res.body.error.should.be.eql("Question does not exist");
                });
            done();

        });
    })

});