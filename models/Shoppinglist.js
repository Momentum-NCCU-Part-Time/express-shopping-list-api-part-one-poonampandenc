const mongoose = require('mongoose')

const shoppingListSchema = new mongoose.Schema({
    title: String,
    createdAt: Date,
    updatedAt: Date,
})

module.exports = mongoose.model('Shoppinglist', shoppingListSchema)