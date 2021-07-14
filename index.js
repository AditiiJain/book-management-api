//importing express framework
const { request, response } = require("express");
const express = require("express");

//including our own module ->database
const database = require("./database/index");

//initializing express
const app = express();

// configurations -- server to use json data format
app.use(express.json());

/*
Route      :  /
Description:  get all books  
Access     :  PUBLIC
Parameters :  NONE
Method     :  GET
*/
app.get("/", (request, response) => {
  return response.json({ books: database.books });
});

/*
Route      :  /book
Description:  to get specific book based on ISBN 
Access     :  PUBLIC
Parameters :  isbn
Method     :  GET
*/
app.get("/book/:isbn", (req, res) => {
  const specificBook = database.books.filter(
    (book) => book.ISBN === req.params.isbn //filter always return some value
  );
  if (specificBook.length === 0) {
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
app.get("/category/:category", (req, res) => {
  const categoryBooks = database.books.filter((book) =>
    book.category.includes(req.params.category)
  );
  if (categoryBooks.length === 0) {
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
app.get("/book-authors/:author", (req, res) => {
  const getAuthorBooks = database.books.filter((book) =>
    book.authors.includes(parseInt(req.params.author))
  );
  if (getAuthorBooks.length === 0) {
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
app.get("/authors", (req, res) => {
  return res.json({ authors: database.authors });
});

/*
Route      :  /authors
Description:  to get specific author
Access     :  PUBLIC
Parameters :  id
Method     :  GET
*/
app.get("/authors/:id", (req, res) => {
  const getAuthor = database.authors.filter(
    (author) => author.authorID === req.params.id
  );
  if (getAuthor.length === 0) {
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
app.get("/authors/bookID/:bookID", (req, res) => {
  const getAuthor = database.authors.filter((author) =>
    author.books.includes(req.params.bookID)
  );
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
app.get("/publications", (req, res) => {
  return res.json({ publications: database.publications });
});

/*
Route      :  /publications
Description:  to get specific publication
Access     :  PUBLIC
Parameters :  id
Method     :  GET
*/
app.get("/publications/:id", (req, res) => {
  const getPublication = database.publications.filter(
    (publication) => publication.pubID === req.params.id
  );
  if (getPublication.length === 0) {
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
app.get("/publications/bookID/:id", (req, res) => {
  const getPublication = database.publications.filter((publication) =>
    publication.books.includes(req.params.id)
  );
  if (getPublication.length === 0) {
    return res.json({
      error: `publications not found of book ID ${req.params.bookID}`,
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
app.post("/books/new", (req, res) => {
  const newBook = req.body.newBook;
  database.books.push(newBook)
  return res.json({ books:database.books , message :"book was added!" });
});

/*
Route      :  /author/new
Description:  to add a new author
Access     :  PUBLIC
Parameters :  NONE
Method     :  POST
*/
app.post("/author/new", (req, res) => {
  const newAuthor = req.body.newAuthor; //body.<keyvalue>
  database.authors.push(newAuthor)
  return res.json({ authors:database.authors , message :"author was added!" });
});

/*
Route      :  /publication/new
Description:  to add a new publication
Access     :  PUBLIC
Parameters :  NONE
Method     :  POST
*/
app.post("/publication/new", (req, res) => {
  const newPublication = req.body.newPublication; //body.<keyvalue>
  database.publications.push(newPublication)
  return res.json({ publications:database.publications , message :"publication was added!" });
});

//port
app.listen(5000, () => console.log("Server running!!"));
