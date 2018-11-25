//example app.js used for mongo/mongoose
//this file is just an example not a good way to do this.

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const dishRouter = require('./routes/dishes');
const dboper = require('./dboperations');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


//MongoDb
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27017/';
const dbname = 'test';

MongoClient.connect(url).then((client) => {

    console.log('Connected correctly to server');
    const db = client.db(dbname);

    dboper.insertDocument(db, { name: "Vadonut", description: "Test"},
        "test")
        .then((result) => {
            console.log("Mongodb Insert Document:\n", result);

            return dboper.findDocuments(db, "dishes");
        })
        .then((docs) => {
            console.log("Mongodb Found Documents:\n", docs);

            return dboper.updateDocument(db, { name: "Vadonut" },
                    { description: "Updated Test" }, "test");

        })
        .then((result) => {
            console.log("Mongodb Updated Document:\n", result.result);

            return dboper.findDocuments(db, "test");
        })
        .then((docs) => {
            console.log("Mongodb Found Updated Documents:\n", docs);
                            
            return client.close();
        })
        .catch((err) => console.log(err));

})
.catch((err) => console.log(err));

//Mongoose Example
const mongoose = require('mongoose');
const Dishes = require('./models/dishes');
const mgs_url = 'mongodb://localhost:27017/test';
const connect = mongoose.connect(mgs_url);

connect.then((db) => {

    console.log('Mongoose Connected correctly to server');//this file is just an example not a good way to do this.
    //Use Models and inove find, create, remove, etc..

    Dishes.create({
        name: 'Uthappizza from mongoose',
        description: 'test from mongoose'
    })

        .then((dish) => {
            console.log(dish);

            return Dishes.find({}).exec();
        })
        .then(() => {
            console.log("mongoose closed connection")
            return mongoose.connection.close();
        })
        .catch((err) => {
            console.log(err);
        });
    
        //Use of a more complex Mongoose ODM
    Dishes.create({
        name: 'new_pizza',
        description: 'test_new_pizza'
    })
        .then((dish) => {
            console.log(dish);
            return Dishes.findByIdAndUpdate(dish._id, {
            $set: { description: 'Updated test'}
        },{ 
            new: true 
        })
        .exec();
    })
    .then((dish) => {
        console.log(dish);
        dish.comments.push({
        rating: 5,
        comment: 'I\'m getting a sinking feeling!',
        author: 'Leonardo di Carpaccio'
    });
    return dish.save();
    })
    .then(() => {
        return mongoose.connection.close();
    })
    .catch((err) => {
        console.log(err);
    });

    }).catch((err) => {
        console.log(err);
    });


    





module.exports = app;
