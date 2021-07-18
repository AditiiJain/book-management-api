const mongoose = require("mongoose");

const AuthorSchema = mongoose.Schema({
    authorName: String,
    authorID: String,
    books: [String],
});

const AuthorModel = mongoose.model(AuthorSchema);

module.exports = AuthorSchema;