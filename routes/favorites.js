const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const favoriteRouter = express.Router();
const Favorites = require('../models/favorites');
const authenticate = require('../authenticate');

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.get(authenticate.verifyUser, (req,res,next) => {
    Favorites.find({})
    .populate('user')
    .populate('dishes')
    .then((favs) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favs);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((fav) => {
        if(fav){
            console.log(typeof(req.body[0]["_id"]))
            console.log(typeof(fav.dishes[0]["_id"]))
            for(let i=0; i < req.body.length; i++){
                let is_empty = fav.dishes.filter((item) => item["_id"] == req.body[i]["_id"])
                if(is_empty === undefined || is_empty.length == 0){
                        fav.dishes.push(req.body[i]["_id"]);
                }
            }
            fav.save();
        }else{
            Favorites.create({"user" : req.user._id, "dishes" : req.body});
        }
    })
    .then((fav) => {
        console.log('Favorites created', fav);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(fav);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Favorites.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

favoriteRouter.route('/:dishId')
.get((req,res,next) => {
    res.statusCode = 403;
    res.end('Get operation not supported on /favorites/' + req.params.dishId);
})
.post(authenticate.verifyUser,  (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((fav) => {
        if(fav){
            console.log(req.params.dishId)
            let is_empty = fav.dishes.filter((item) => item["_id"] == req.params.dishId)
            console.log(is_empty)
            if(is_empty === undefined || is_empty.length == 0){
                    console.log('creating')
                    fav.dishes.push(req.params.dishId);
                    fav.save();
            }
        }else{
            Favorites.create({"user" : req.user._id, "dishes" : [req.params.dishId]});
        }
    })
    .then((fav) => {
        console.log('Favorites created', fav);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(fav);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser,  (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites/'+ req.params.dishId);
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((fav) => {
        if(fav){
            fav.dishes = fav.dishes.filter(item => item["_id"] != req.params.dishId)
            console.log("the filter is: ", fav.dishes)
            fav.save()
            .then((fav) =>{
                console.log('Favorite Deleted', fav)
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(fav);
            });
        }else{
            err = new Error('Favorites not found for user');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = favoriteRouter;