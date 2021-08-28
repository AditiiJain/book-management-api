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
| Task       | endpoint          |
| ------------- |:-------------| 
| New book      | /books/new | 


#### PUT
| Task       | endpoint          |
| ------------- |:-------------| 
|to update book title     | /books/update/:isbn | 
|to update/add new author|/books/author/update/:isbn|
 

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
| Task       | endpoint          |
| ------------- |:-------------| 
| New author     | /author/new | 
#### PUT 
| Task       | endpoint          |
| ------------- |:-------------| 
|to update author name    | /authors/update/:id | 


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
| Task       | endpoint          |
| ------------- |:-------------| 
| add new publication     | /publication/new | 
#### PUT
| Task       | endpoint          |
| ------------- |:-------------| 
|update publication name   | /publications/update/:id | 
|update/add new book to a publication    | /publications/update/book/:isbn | 

#### DELETE
| Task       | endpoint          |
| ------------- |:-------------| 
| delete a book from publication   | /publication/delete/book/:isbn/:pubID| 
| delete publication from database  | /publication/delete/:pubID| 



