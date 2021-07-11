//creating our own module
//if we are creating our own module then we have to export the content so that it can be available outside the file also.
const books = [
  {
    ISBN: "12345ONE",
    title: "Getting started with MERN",
    authors: [1, 2, 3],
    language: "en",
    pubDate: "2021-07-08",
    numOfPages: 500,
    category: ["web developement", "programming", "tech"],
    publications: [1,2],
  },
  {
    ISBN: "12345TWO",
    title: "Getting started with C++",
    authors: [1, 3],
    language: "en",
    pubDate: "2020-07-08",
    numOfPages: 550,
    category: ["DSA", "programming", "tech"],
    publications: [1],
  },
];

const authors = [
  {
    authorName: "Aditi Jain",
    authorID: "1",
    books: ["12345ONE", "12345TWO"],
  },
  {
    authorName: "Aditya Jain",
    authorID: "2",
    books: ["12345ONE"],
  },
  {
    authorName: "Anju Jain",
    authorID: "3",
    books: ["12345ONE", "12345TWO"],
  },
];

const publications = [
  {
    pubID: "1",
    pubName: "navbharat publications",
    books: ["12345ONE", "12345TWO"],
  },
  {
    pubID: "2",
    pubName: "nav publications",
    books: ["12345ONE"],
  },
];

module.exports = {books,authors,publications}