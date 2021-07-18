const mongoose = require("mongoose");

const PublicationSchema = mongoose.Schema({
    pubID: String,
    pubName: String,
    books: [String],
});

const PublicationModel = mongoose.model(PublicationSchema);

module.exports = PublicationSchema;