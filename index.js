require("dotenv").config(); //for security purpose
//importing express framework
const express = require("express");
const mongoose = require("mongoose");

//including our own module ->database
const database = require("./database/index");

//including mongoose models
const BookModel = require("./database/book.js");
const AuthorModel = require("./database/author.js");
const PublicationModel = require("./database/publication.js");

//initializing express
const app = express();

// configurations -- server to use json data format
app.use(express.json());

//establish database connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("connection established!"));

/*
Route      :  /
Description:  get all books  
Access     :  PUBLIC
Parameters :  NONE
Method     :  GET
*/
app.get("/", async (request, response) => {
  const getAllBooks = await BookModel.find();
  return response.json({ books: getAllBooks });
});

/*
Route      :  /book
Description:  to get specific book based on ISBN 
Access     :  PUBLIC
Parameters :  isbn
Method     :  GET
*/
app.get("/book/:isbn", async (req, res) => {
  const specificBook = await BookModel.findOne({ ISBN: req.params.isbn });
  if (!specificBook) {
    //findOne() retorns null if key-value not found. Therefore null means false in if statement and !false = true
    return res.json({ error: `book not found with ISBN ${req.params.isbn}` });
  }
  return res.json({ book: specificBook });
});

/*
Route      :  /category/
Description:  to get specific book based on category
Access     :  PUBLIC
Parameters :  category
Method     :  GET
*/
app.get("/category/:category", async (req, res) => {
  const categoryBooks = await BookModel.find({ category: req.params.category });
  //we do not need to add includes or filter method as mongoDB is intelligent enough. It can itself traverse the array and give us the output.
  if (!categoryBooks) {
    return res.json({
      error: `book not found of category ${req.params.category}`,
    });
  }
  return res.json({ books: categoryBooks });
});

/*
Route      :  /book-authors/
Description:  to get specific book based on authors
Access     :  PUBLIC
Parameters :  author
Method     :  GET
*/
app.get("/book-authors/:author", async (req, res) => {
  const getAuthorBooks = await BookModel.find({ authors: req.params.author });
  if (!getAuthorBooks) {
    return res.json({ error: `book not found of author ${req.params.author}` });
  }
  return res.json({ books: getAuthorBooks });
});

/*
Route      :  /authors
Description:  to get all authors
Access     :  PUBLIC
Parameters :  NONE
Method     :  GET
*/
app.get("/authors",async (req, res) => {
  const getAllAuthors = await AuthorModel.find()
  return res.json({ authors: getAllAuthors });
});

/*
Route      :  /authors
Description:  to get specific author
Access     :  PUBLIC
Parameters :  id
Method     :  GET
*/
app.get("/authors/:id",async (req, res) => {
  const getAuthor = await AuthorModel.findOne({authorID:req.params.id});
  if (!getAuthor) {
    return res.json({ error: `author not found of ID ${req.params.id}` });
  }
  return res.json({ authors: getAuthor });
});

/*
Route      :  /authors/bookID
Description:  to get a list of authors based on a book
Access     :  PUBLIC
Parameters :  bookID
Method     :  GET
*/
app.get("/authors/bookID/:bookID",async (req, res) => {
  const getAuthor = await AuthorModel.find({books:req.params.bookID}); 
  //find returns [] when there is no element found
  console.log(getAuthor);
  if (getAuthor.length === 0) {
    return res.json({
      error: `author not found of book ID ${req.params.bookID}`,
    });
  }
  return res.json({ authors: getAuthor });
});

/*
Route      :  /publications
Description:  to get all publications
Access     :  PUBLIC
Parameters :  NONE
Method     :  GET
*/
app.get("/publications", async(req, res) => {
  const getPublication = await PublicationModel.find();
  return res.json({ publications: getPublication });
});

/*
Route      :  /publications
Description:  to get specific publication
Access     :  PUBLIC
Parameters :  id
Method     :  GET
*/
app.get("/publications/:id", async(req, res) => {
  const getPublication = await PublicationModel.findOne({pubID:req.params.id})
  if (!getPublication) {
    return res.json({ error: `publication not found of ID ${req.params.id}` });
  }
  return res.json({ publication: getPublication });
});

/*
Route      :  /publications/bookID
Description:  to get a list of publications based on a book
Access     :  PUBLIC
Parameters :  id
Method     :  GET
*/
app.get("/publications/bookID/:id",async (req, res) => {
  const getPublication = await PublicationModel.find({books:req.params.id})
  if (getPublication.length === 0) {
    return res.json({
      error: `publications not found of book ID ${req.params.id}`,
    });
  }
  return res.json({ publication: getPublication });
});

/*
Route      :  /books/new
Description:  to add a new book
Access     :  PUBLIC
Parameters :  NONE
Method     :  POST
*/
app.post("/books/new", async (req, res) => {
  const newBook = req.body.newBook; // const {newBook} = req.body;
  BookModel.create(newBook); // BookModel does not return anything
  return res.json({ message: "book was added!" });
});

/*
Route      :  /author/new
Description:  to add a new author
Access     :  PUBLIC
Parameters :  NONE
Method     :  POST
*/
app.post("/author/new",async (req, res) => {
  const newAuthor = req.body.newAuthor; //body.<keyvalue>
  AuthorModel.create(newAuthor);
  return res.json({ message: "author was added!" });
});

/*
Route      :  /publication/new
Description:  to add a new publication
Access     :  PUBLIC
Parameters :  NONE
Method     :  POST
*/
app.post("/publication/new", async (req, res) => {
  const newPublication = req.body.newPublication; //body.<keyvalue>
  PublicationModel.create(newPublication);
  return res.json({
    message: "publication was added!",
  });
});

/*
Route      :  /books/update
Description:  to update book title
Access     :  PUBLIC
Parameters :  isbn
Method     :  PUT
*/
app.put("/books/update/:isbn", (req, res) => {
  let flag = 0;
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      book.title = req.body.bookTitle;
      flag = 1;
      return;
    }
  });
  if (flag === 1) {
    return res.json({ books: database.books });
  } else {
    return res.json({ message: "book not found!!" });
  }
});

/*
Route      :  /books/author/update
Description:  to update/add new author to a book 
Access     :  PUBLIC
Parameters :  isbn
Method     :  PUT
*/
app.put("/books/author/update/:isbn", (req, res) => {
  //update book database
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      return book.authors.push(req.body.newAuthor);
    }
  });
  //update author database
  database.authors.forEach((author) => {
    if (parseInt(author.authorID) === req.body.newAuthor) {
      return author.books.push(req.params.isbn);
    }
  });
  return res.json({
    books: database.books,
    authors: database.authors,
    message: "new author was added!",
  });
});

/*
Route      :  /authors/update
Description:  to update author name 
Access     :  PUBLIC
Parameters :  id
Method     :  PUT
*/
app.put("/authors/update/:id", (req, res) => {
  database.authors.forEach((author) => {
    if (author.authorID === req.params.id) {
      author.authorName = req.body.authorName;
      return;
    }
  });
  return res.json({
    authors: database.authors,
    message: "author details updated!",
  });
});

/*
Route      :  /publications/update
Description:  to update publication details
Access     :  PUBLIC
Parameters :  id
Method     :  PUT
*/
app.put("/publications/update/:id", (req, res) => {
  database.publications.forEach((publication) => {
    if (publication.pubID === req.params.id) {
      publication.pubName = req.body.pubName;
      return;
    }
  });
  return res.json({
    publications: database.publications,
    message: "publication updated!",
  });
});

/*
Route      :  /publications/update/book
Description:  update/add new book to a publication
Access     :  PUBLIC
Parameters :  isbn
Method     :  PUT
*/
app.put("/publications/update/book/:isbn", (req, res) => {
  //update books database
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      return book.publications.push(req.body.newPublication);
    }
  });
  //update publications database
  database.publications.forEach((publication) => {
    if (parseInt(publication.pubID) === req.body.newPublication) {
      return publication.books.push(req.params.isbn);
    }
  });
  return res.json({
    books: database.books,
    publications: database.publications,
    message: "publication updated!",
  });
});

/*
Route      :  /book/delete
Description:  delete a book
Access     :  PUBLIC
Parameters :  isbn
Method     :  DELETE
*/
app.delete("/book/delete/:isbn", (req, res) => {
  //update book database
  const updateBookDatabase = database.books.filter((book) => {
    return book.ISBN !== req.params.isbn;
  });
  database.books = updateBookDatabase;
  //update author database
  database.authors.forEach((author) => {
    const newBookList = author.books.filter((book) => {
      return req.params.isbn !== book;
    });
    author.books = newBookList;
  });
  return res.json({
    books: database.books,
    authors: database.authors,
  });
});

/*
Route      :  /book/delete/author
Description:  delete an author from a book
Access     :  PUBLIC
Parameters :  isbn, authorID
Method     :  DELETE
*/
app.delete("/book/delete/author/:isbn/:authorID", (req, res) => {
  //update book database
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      const newAuthorList = book.authors.filter((author) => {
        return parseInt(req.params.authorID) !== author;
      });
      book.authors = newAuthorList;
      return;
    }
  });
  //update author database
  database.authors.forEach((author) => {
    if (req.params.authorID === author.authorID) {
      const newBookList = author.books.filter((book) => {
        return book !== req.params.isbn;
      });
      author.books = newBookList;
      return;
    }
  });
  return res.json({
    message: "Author deleted from the book.",
    books: database.books,
    authors: database.authors,
  });
});

/*
Route      :  /author/delete
Description:  delete an author from database
Access     :  PUBLIC
Parameters :  authorID
Method     :  DELETE
*/
app.delete("/author/delete/:authorID", (req, res) => {
  //update author database
  const updateAuthorDatabase = database.authors.filter(
    (author) => req.params.authorID !== author.authorID
  );
  database.authors = updateAuthorDatabase;
  //update book database
  database.books.forEach((book) => {
    const updateBookDatabase = book.authors.filter(
      (author) => parseInt(req.params.authorID) !== author
    );
    book.authors = updateBookDatabase;
  });
  return res.json({
    message: "Author deleted from database.",
    books: database.books,
    authors: database.authors,
  });
});

/*
Route      :  /publication/delete
Description:  delete a publication from database
Access     :  PUBLIC
Parameters :  pubID
Method     :  DELETE
*/
app.delete("/publication/delete/:pubID", (req, res) => {
  //update publication database
  const updatePublicationDatabase = database.publications.filter(
    (publication) => req.params.pubID !== publication.pubID
  );
  database.publications = updatePublicationDatabase;
  //update book database
  database.books.forEach((book) => {
    const updateBookDatabase = book.publications.filter(
      (publication) => parseInt(req.params.pubID) !== publication
    );
    book.publications = updateBookDatabase;
  });
  return res.json({
    message: "Publication deleted from database.",
    books: database.books,
    publications: database.publications,
  });
});

/*
Route      :  /publication/delete/book
Description:  delete a book from publication
Access     :  PUBLIC
Parameters :  isbn,pubID
Method     :  DELETE
*/
app.delete("/publication/delete/book/:isbn/:pubID", (req, res) => {
  //update publication database
  database.publications.forEach((publication) => {
    console.log(publication.pubID === req.params.pubID);
    if (publication.pubID === req.params.pubID) {
      const newBookList = publication.books.filter((book) => {
        return req.params.isbn !== book;
      });
      publication.books = newBookList;
      return;
    }
  });
  //update book database
  database.books.forEach((book) => {
    if (req.params.isbn === book.ISBN) {
      const newPublicationList = book.publications.filter((publication) => {
        return publication !== parseInt(req.params.pubID);
      });
      book.publications = newPublicationList;
      return;
    }
  });
  return res.json({
    message: "Book deleted from the publication.",
    books: database.books,
    publications: database.publications,
  });
});

//port
app.listen(5000, () => console.log("Server running!!"));
