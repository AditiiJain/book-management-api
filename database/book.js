const mongoose = require("mongoose");

//creating new book schema
const BookSchema = mongoose.Schema({
    ISBN: String,
    title: String,
    authors: [Number],
    language: String,
    pubDate: String,
    numOfPages: Number,
    category: [String],
    publications: [Number],
});

//create a book model
const BookModel = mongoose.model("books",BookSchema); //first argument = document name in mongoDB

//exporting BookModel
module.exports = BookModel;
