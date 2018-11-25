const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;
const dishes = require('./dishes.js');
const dishSchema = dishes.dishSchema;

const favoriteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    favorites:[dishSchema]
},{
    timestamps: true
});

var favorites = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorites;
