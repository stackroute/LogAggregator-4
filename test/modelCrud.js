/**
 * Created by COMP on 12-04-2016.
 */

var mongoose = require('mongoose');



var should = require('should');

var request = require('supertest');

var User = require('../models/querySchema');
var app = require('../app');
//
//describe('Mongoose tests', function() {
//    it('Create Connection', function(done) {
//        require('../database/index');
//        mongoose.connection.on('open', function() {
//            console.log("connected");
//            done();
//        });
//    });
//
//    it('Delete All Users', function(done) {
//        User.remove(function(err) {
//            if(err) { return done(err); }
//            return done();
//        });
//    });
//
//    it('Create User', function(done) {
//        var user = new User({
//            name: 'Neal',
//            age: 25
//        });
//
//        console.log('Creating User');
//        user.save(function(err, createdUser) {
//            console.log('creation complete');
//            if(err) {
//                return done(err);
//            }
//            console.log('user created with id: ' + createdUser._id);
//            done();
//        });
//    });
//
//    it('Delete All Users', function(done) {
//        User.remove(function(err) {
//            if(err) { return done(err); }
//            return done();
//        });
//    });
//});


describe('Test Express Routes for User', function() {
    var query = {name: 'Sagar', age: 26};
    var createdUserId;

    it('Create Query', function(done) {
        console.log(1);
        request(app)
            .post('/saveQuery')
            .send(JSON.stringify(query))
            .expect(201)
         //   .expect('Content-Type', /json/)
            .end(function(err, res) {
                console.log('ERR: ' + JSON.stringify(res.body));
                if(err) { return done(err); }
                console.log('ERR: ' + JSON.stringify(res.body));
                createdUserId = res.body._id;
                done();
            });
    });

    it('Retrieve User', function() {
        request(app)
            .get('/saveQuery/' + createdUserId)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if(err) { return done(err); }
                console.log("response body");

                console.log(res.body);
                res.body.should.have.property('name').and.be.exactly('Sagar');
                res.body.should.have.property('age').and.should.be.exactly(26);
                done();
            });
    });
});

