# Requirements

#### We are a company that handles publications

* Book
   ISBN, Title, Author [], Language, Publication Date, Number of Pages, Category[], Publications[]

* Authors
    Name, Id, Books[]

* Publications
    Name, Id, Books[]   

------------------------------------------------------------------------------------------------------------------- 

# <u>Books</u>
We need an API
#### GET
| Task                   | endpoint      | 
| -------------          |:-------------| 
| to get all books       | / | 
| to get specific book               |   /book/:isbn    |  
| to get a list of books based on catergory         | /category/:category      |
|to get a list of books based on author|/book-authors/:author|   


#### POST
| Task       | endpoint          |Request Body|
| ------------- |:-------------| -------------| 
| New book      | /books/new |"newBook": { "ISBN": "exampleID", "title": "example", authors": [], "language": "en", "pubDate": "2021-07-08", "numOfPages": 500, "category":["web developement", "programming","many more"],publications": []}|


#### PUT
| Task       | endpoint          | Request Body
| ------------- |:-------------| ------------- |
|to update book title     | /books/update/:isbn |"bookTitle": "example" |
|to update/add new author|/books/author/update/:isbn| "authorID":"123"|
 

#### DELETE
| Task       | endpoint          |
| ------------- |:-------------| 
|delete a book     | /book/delete/:isbn | 
|delete an author from a book|/book/delete/author/:isbn/:authorID|


# <u>Author</u>
We need an API
#### GET
| Task       | endpoint          |
| ------------- |:-------------| 
|to get all authors     | /authors | 
|to get specific author|/authors/:id|
|to get a list of authors based on a book|/authors/bookID/:bookID|

#### POST
| Task       | endpoint          | Request Body |
| ------------- |:-------------| ------------- |
| New author     | /author/new | "newAuthor": {"authorName": "example", "authorID": "372","books": [] } |
#### PUT 
| Task       | endpoint          |  Request Body|
| ------------- |:-------------| -------------|
|to update author name    | /authors/update/:id | "authorName":"example"|


#### DELETE
| Task       | endpoint          |
| ------------- |:-------------| 
| delete an author from database    | /author/delete/:authorID| 

# <u>Publication</u>
We need and API
#### GET
| Task       | endpoint          |
| ------------- |:-------------| 
|to get all publications     | /publications | 
|to get specific publication|/publications/:id|
|to get a list of publications based on a book|/publications/bookID/:isbn|

#### POST
| Task       | endpoint          | Request Body|
| ------------- |:-------------| -------------| 
| add new publication     | /publication/new | "newPublication": { "pubID": "1", "pubName": "example", "books": [] }|
#### PUT
| Task       | endpoint          | Request Body |
| ------------- |:-------------| ------------- |
|update publication name   | /publications/update/:id | "pubName": "example"|
|update/add new book to a publication    | /publications/update/book/:isbn | "pubID" : "123"|

#### DELETE
| Task       | endpoint          |
| ------------- |:-------------| 
| delete a book from publication   | /publication/delete/book/:isbn/:pubID| 
| delete publication from database  | /publication/delete/:pubID| 



