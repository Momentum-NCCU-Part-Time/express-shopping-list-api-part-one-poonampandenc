const mongoose = require('mongoose')

const shoppingListSchema = new mongoose.Schema(
    {
    title: String,
    items: [{ name: String,
    quantity: Number,
purchased: Boolean }]},
    { timestamps: true }
    )

module.exports = mongoose.model('Shoppinglist', shoppingListSchema)