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
const { findOneAndUpdate } = require("./database/book.js");

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
  //.find() returns whole object if does not specify anything in parameter
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
    //findOne() returns null if key-value not found. Therefore null means false in if statement and !false = true
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
  //We do not need to add includes or filter method as mongoDB is intelligent enough.
  //It can itself traverse the array and give us the output.
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
app.get("/authors", async (req, res) => {
  const getAllAuthors = await AuthorModel.find();
  return res.json({ authors: getAllAuthors });
});

/*
Route      :  /authors
Description:  to get specific author
Access     :  PUBLIC
Parameters :  id
Method     :  GET
*/
app.get("/authors/:id", async (req, res) => {
  const getAuthor = await AuthorModel.findOne({ authorID: req.params.id });
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
app.get("/authors/bookID/:bookID", async (req, res) => {
  const getAuthor = await AuthorModel.find({ books: req.params.bookID });
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
app.get("/publications", async (req, res) => {
  const getPublication = await PublicationModel.find();
  console.log(getPublication);
  return res.json({ publications: getPublication });
});

/*
Route      :  /publications
Description:  to get specific publication
Access     :  PUBLIC
Parameters :  id
Method     :  GET
*/
app.get("/publications/:id", async (req, res) => {
  const getPublication = await PublicationModel.findOne({
    pubID: req.params.id,
  });
  if (!getPublication) {
    return res.json({ error: `publication not found of ID ${req.params.id}` });
  }
  return res.json({ publication: getPublication });
});

/*
Route      :  /publications/bookID
Description:  to get a list of publications based on a book
Access     :  PUBLIC
Parameters :  isbn
Method     :  GET
*/
app.get("/publications/bookID/:isbn", async (req, res) => {
  const getPublication = await PublicationModel.find({
    books: req.params.isbn,
  });
  if (getPublication.length === 0) {
    return res.json({
      error: `publications not found of book ID ${req.params.isbn}`,
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
  const getBook = await BookModel.find({ ISBN: newBook.ISBN });
  const getAuthor = await AuthorModel.find();
  const getPublication = await PublicationModel.find();

  if (!getBook.length) {
    //updating authors database
    if (newBook.authors.length) {
      let authorNotFound = [];
      const authorIds = getAuthor.map((author) => parseInt(author["authorID"]));
      let hasAllAuthors = true;
      for (let i = 0; i < newBook.authors.length; i++) {
        if (authorIds.indexOf(newBook.authors[i]) === -1) {
          authorNotFound.push(newBook.authors[i]);
          hasAllAuthors = false;
        }
      }
      if (hasAllAuthors) {
        getAuthor.forEach(async(author) => {
          if (newBook.authors.includes(parseInt(author.authorID))) {
            if (author.books.includes(newBook.ISBN) === false) {
              //for duplicacy of elements condition
              author.books.push(newBook.ISBN);
              // author.books = updateAuthor;
              await author.save();
            }
          }

        });
      } else {
        return res.json({
          error: `author with id(s) ${authorNotFound} does not exist in the database.`,
        });
      }
    }
    //updating publication database
    if (newBook.publications.length) {
      let publicationNotFound = [];
      const pubIds = getPublication.map((publication) =>
        parseInt(publication["pubID"])
      );
      let hasAllPublication = true;
      for (let i = 0; i < newBook.publications.length; i++) {
        if (pubIds.indexOf(newBook.publications[i]) === -1) {
          publicationNotFound.push(newBook.publications[i]);
          hasAllPublication = false;
        }
      }
      if (hasAllPublication) {
        getPublication.forEach(async(publication) => {
          if (newBook.publications.includes(parseInt(publication.pubID))) {
            if (publication.books.includes(newBook.ISBN) === false) {
              publication.books.push(newBook.ISBN);
            }
          }
          await publication.save();
        });
      } else {
        return res.json({
          error: `publication with id(s) ${publicationNotFound} does not exist in the database.`,
        });
      }
    }
    BookModel.create(newBook); // BookModel does not return anything
    return res.json({
      message: "book was added!",
      book: newBook,
      authors: getAuthor,
      publications: getPublication,
    });
  } else {
    return res.json({
      error: `book with id ${newBook.ISBN} already exist in the database.`,
    });
  }
});

/*
Route      :  /author/new
Description:  to add a new author
Access     :  PUBLIC
Parameters :  NONE
Method     :  POST
*/
app.post("/author/new", async (req, res) => {
  const newAuthor = req.body.newAuthor;
  const getAuthor = await AuthorModel.find({ authorID: newAuthor.authorID });
  const getBook = await BookModel.find();

  if (!getAuthor.length) {
    //updating books database
    if (newAuthor.books.length) {
      let bookNotFound = [];
      const bookIds = getBook.map((book) => book["ISBN"]);
      let hasAllBooks = true;
      for (let i = 0; i < newAuthor.books.length; i++) {
        if (bookIds.indexOf(newAuthor.books[i]) === -1) {
          bookNotFound.push(newAuthor.books[i]);
          hasAllBooks = false;
        }
      }
      if (hasAllBooks) {
        getBook.forEach(async(book) => {
          if (newAuthor.books.includes(book.ISBN)) {
            if (book.authors.includes(newAuthor.authorID) === false) {
              book.authors.push(newAuthor.authorID);
            }
          }
          await book.save();
        });
      } else {
        return res.json({
          error: `book with id(s) ${bookNotFound} does not exist in the database.`,
        });
      }
    }

    AuthorModel.create(newAuthor); 
    return res.json({
      message: "author was added!",
      authors: newAuthor,
      book: getBook,
    });
  } else {
    return res.json({
      error: `author with id ${newAuthor.authorID} already exist in the database.`,
    });
  }
});

/*
Route      :  /publication/new
Description:  to add a new publication
Access     :  PUBLIC
Parameters :  NONE
Method     :  POST
*/
app.post("/publication/new", async (req, res) => {
  const newPublication = req.body.newPublication;
  const getPublication = await PublicationModel.find({ pubID: newPublication.pubID });
  const getBook = await BookModel.find();

  if (!getPublication.length) {
    //updating books database
    if (newPublication.books.length) {
      let bookNotFound = [];
      const bookIds = getBook.map((book) => book["ISBN"]);
      let hasAllBooks = true;
      for (let i = 0; i < newPublication.books.length; i++) {
        if (bookIds.indexOf(newPublication.books[i]) === -1) {
          bookNotFound.push(newPublication.books[i]);
          hasAllBooks = false;
        }
      }
      if (hasAllBooks) {
        getBook.forEach(async(book) => {
          if (newPublication.books.includes(book.ISBN)) {
            if (book.publications.includes(newPublication.pubID) === false) {
              book.publications.push(newPublication.pubID);
            }
          }
          await book.save();
        });
      } else {
        return res.json({
          error: `book with id(s) ${bookNotFound} does not exist in the database.`,
        });
      }
    }

    PublicationModel.create(newPublication); 
    return res.json({
      message: "Publication was added!",
      publications: newPublication,
      book: getBook,
    });
  } else {
    return res.json({
      error: `Publication with id ${newPublication.pubID} already exist in the database.`,
    });
  }
});

/*
Route      :  /books/update
Description:  to update book title
Access     :  PUBLIC
Parameters :  isbn
Method     :  PUT
*/
app.put("/books/update/:isbn", async (req, res) => {
  const updateBook = await BookModel.findOneAndUpdate(
    { ISBN: req.params.isbn },
    { title: req.body.bookTitle },
    { new: true }
  );
  //findOneAndUpdate() contains three parameters. First one is what to find. Second one is what to update by what value. Third, this method returns old data, so if you want newly updated data, you need an optional parameter object.
  if (!updateBook) {
    return res.json({ error: `book with ISBN ${req.params.isbn} not found` });
  }
  return res.json({ books: updateBook });
});

/*
Route      :  /books/author/update
Description:  to update/add new author to a book 
Access     :  PUBLIC
Parameters :  isbn
Method     :  PUT
*/
app.put("/books/author/update/:isbn", async (req, res) => {
  const book = await BookModel.findOne({ ISBN: req.params.isbn });
  if (book) {
    const author = await AuthorModel.findOne({
      authorID: req.body.authorID,
    });
    if (author) {
      //update author database
      const updateAuthor = await AuthorModel.findOneAndUpdate(
        { authorID: req.body.authorID },
        { $addToSet: { books: req.params.isbn } },
        { new: true }
      );
      //update book database
      const updateBook = await BookModel.findOneAndUpdate(
        { ISBN: req.params.isbn } /*comparing isbn of all books*/,
        { $addToSet: { authors: parseInt(req.body.authorID) } }, //pushing(addToSet because we want to push the given data only once,as ID should be unique) new author to book's "authors" array
        { new: true }
      );
      return res.json({
        books: updateBook,
        authors: updateAuthor,
        message: "added new author to a book!",
      });
    }
    return res.json(
      `author with authorID ${req.body.authorID} does not exist in the database.`
    );
  }
  return res.json(`book not found with ISBN ${req.params.isbn}`);
});

/*
Route      :  /authors/update
Description:  to update author name 
Access     :  PUBLIC
Parameters :  id
Method     :  PUT
*/
app.put("/authors/update/:id", async (req, res) => {
  const updateAuthorName = await AuthorModel.findOneAndUpdate(
    { authorID: req.params.id },
    { authorName: req.body.authorName },
    { new: true }
  );
  if (!updateAuthorName) {
    return res.json({
      error: `author with ID ${req.params.id} does not present`,
    });
  }
  return res.json({
    authors: updateAuthorName,
    message: "author details updated!",
  });
});

/*
Route      :  /publications/update
Description:  to update publication name
Access     :  PUBLIC
Parameters :  id
Method     :  PUT
*/
app.put("/publications/update/:id", async (req, res) => {
  const updatePublicationName = await PublicationModel.findOneAndUpdate(
    { pubID: req.params.id },
    { pubName: req.body.pubName },
    { new: true }
  );
  if (!updatePublicationName) {
    return res.json({
      error: `publication with ID ${req.params.id} does not present.`,
    });
  }
  return res.json({
    publication: updatePublicationName,
    message: "publication name updated!",
  });
});

/*
Route      :  /publications/update/book
Description:  update/add new book to a publication
Access     :  PUBLIC
Parameters :  isbn
Method     :  PUT
*/
app.put("/publications/update/book/:isbn", async (req, res) => {
  const book = await BookModel.findOne({ ISBN: req.params.isbn });
  //update publication database
  if (book) {
    const publication = await PublicationModel.findOne({
      pubID: req.body.pubID,
    });
    if (publication) {
      const updatePublication = await PublicationModel.findOneAndUpdate(
        { pubID: req.body.pubID },
        { $addToSet: { books: req.params.isbn } },
        { new: true }
      );
      //update books database
      //-------------------------------------------------
      // book.publications.unshift(req.body.pubID);
      // await book.save();//mongoDB save
      //-------------------------------------------------
      const updateBook = await BookModel.findOneAndUpdate(
        { ISBN: req.params.isbn },
        { $addToSet: { publications: parseInt(req.body.pubID) } },
        { new: true }
      );
      return res.json({
        books: updateBook,
        publications: updatePublication,
        message: "added new book to the publication!",
      });
    }
    return res.json(
      `publication with pubID ${req.body.pubID} does not exist in the database.`
    );
  }
  return res.json(`book not found with ISBN ${req.params.isbn}`);
});

/*
Route      :  /book/delete
Description:  delete a book
Access     :  PUBLIC
Parameters :  isbn
Method     :  DELETE
*/
app.delete("/book/delete/:isbn", async (req, res) => {
  //update book database
  const updateBookDatabase = await BookModel.findOneAndDelete({
    ISBN: req.params.isbn,
  });

  //update author database
  if (updateBookDatabase) {
    const updateAuthorDatabase = await AuthorModel.find();
    updateAuthorDatabase.forEach(async (author) => {
      const updateAuthor = author.books.filter((book) => {
        return book !== req.params.isbn;
      });
      author.books = updateAuthor;
      await author.save();
    });

    //update publication database
    const updatePublicationDatabase = await PublicationModel.find();
    updatePublicationDatabase.forEach(async (publication) => {
      const updatePublication = publication.books.filter((publication) => {
        return publication !== req.params.isbn;
      });
      publication.books = updatePublication;
      await publication.save();
    });

    return res.json({
      books: updateBookDatabase,
      auhthors: updateAuthorDatabase,
      publications: updatePublicationDatabase,
      message: `Book with ISBN ${req.params.isbn} deleted!`,
    });
  }
  return res.json({ error: `Book with ISBN ${req.params.isbn} not found!` });
});

/*
Route      :  /book/delete/author
Description:  delete an author from a book
Access     :  PUBLIC
Parameters :  isbn, authorID
Method     :  DELETE
*/
app.delete("/book/delete/author/:isbn/:authorID", async (req, res) => {
  //update book database
  const updateBookDatabase = await BookModel.findOne({ ISBN: req.params.isbn });
  //update author database
  if (updateBookDatabase) {
    if (updateBookDatabase.authors.includes(parseInt(req.params.authorID))) {
      const updateAuthor = updateBookDatabase.authors.filter((author) => {
        return author !== parseInt(req.params.authorID);
      });
      updateBookDatabase.authors = updateAuthor;
      await updateBookDatabase.save();

      const updateAuthorDatabase = await AuthorModel.findOne({
        authorID: req.params.authorID,
      });
      const updateBook = updateAuthorDatabase.books.filter((book) => {
        return book !== req.params.isbn;
      });
      updateAuthorDatabase.books = updateBook;
      await updateAuthorDatabase.save();

      return res.json({
        message: "Author deleted from the book.",
        books: updateBookDatabase,
        authors: updateAuthorDatabase,
      });
    }
    return res.json({
      error: `Author with authorID ${req.params.authorID} not found!`,
    });
  }
  return res.json({ error: `Book with ISBN ${req.params.isbn} not found!` });
});

/*
Route      :  /author/delete
Description:  delete an author from database
Access     :  PUBLIC
Parameters :  authorID
Method     :  DELETE
*/
app.delete("/author/delete/:authorID", async (req, res) => {
  //update author database
  const updateAuthorDatabase = await AuthorModel.findOneAndDelete({
    authorID: req.params.authorID,
  });
  //update book database
  if (updateAuthorDatabase) {
    const updateBookDatabase = await BookModel.find();
    updateBookDatabase.forEach(async (book) => {
      const updateBook = book.authors.filter((book) => {
        return book !== parseInt(req.params.authorID);
      });
      book.authors = updateBook;
      await book.save();
    });
    return res.json({
      message: "Author deleted from database.",
      authors: updateAuthorDatabase,
      books: updateBookDatabase,
    });
  }
  return res.json({
    error: `Author with ID ${req.params.authorID} not found!`,
  });
});

/*
Route      :  /publication/delete
Description:  delete a publication from database
Access     :  PUBLIC
Parameters :  pubID
Method     :  DELETE
*/
app.delete("/publication/delete/:pubID", async (req, res) => {
  //update publication database
  const updatePublicationDatabase = await PublicationModel.findOneAndDelete({
    pubID: req.params.pubID,
  });
  //update book database
  if (updatePublicationDatabase) {
    const updateBookDatabase = await BookModel.find();
    updateBookDatabase.forEach(async (book) => {
      const updateBook = book.publications.filter((book) => {
        return book !== parseInt(req.params.pubID);
      });
      book.publications = updateBook;
      await book.save();
    });
    return res.json({
      message: "Publication deleted from database.",
      publications: updatePublicationDatabase,
      books: updateBookDatabase,
    });
  }
  return res.json({
    error: `Publication with ID ${req.params.pubID} not found!`,
  });
});
/*
Route      :  /publication/delete/book
Description:  delete a book from publication
Access     :  PUBLIC
Parameters :  isbn,pubID
Method     :  DELETE
*/
app.delete("/publication/delete/book/:isbn/:pubID", async (req, res) => {
  //update book database
  const updateBookDatabase = await BookModel.findOne({ ISBN: req.params.isbn });
  //update publication database
  if (updateBookDatabase) {
    if (updateBookDatabase.publications.includes(parseInt(req.params.pubID))) {
      const updatePublication = updateBookDatabase.publications.filter(
        (publication) => {
          return publication !== parseInt(req.params.pubID);
        }
      );
      updateBookDatabase.publications = updatePublication;
      await updateBookDatabase.save();

      const updatePublicationDatabase = await PublicationModel.findOne({
        pubID: req.params.pubID,
      });
      const updateBook = updatePublicationDatabase.books.filter((book) => {
        return book !== req.params.isbn;
      });
      updatePublicationDatabase.books = updateBook;
      await updatePublicationDatabase.save();

      return res.json({
        message: "Publication deleted from the book.",
        books: updateBookDatabase,
        publications: updatePublicationDatabase,
      });
    }
    return res.json({
      error: `Publication with pubID ${req.params.pubID} not found!`,
    });
  }
  return res.json({ error: `Book with ISBN ${req.params.isbn} not found!` });
});

//port
app.listen(8000, () => console.log("Server running!!"));
