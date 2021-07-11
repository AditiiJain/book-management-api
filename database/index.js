const books = [
  {
    ISBN: "12345ONE",
    title: "Getting started with MERN",
    authors: [1, 2, 3],
    language: "en",
    pubDate: "2021-07-08",
    numOfPages: 500,
    catergory: ["web developement", "programming", "tech"],
    publications: [1],
  },
  {
    ISBN: "12345TWO",
    title: "Getting started with C++",
    authors: [1, 3],
    language: "en",
    pubDate: "2020-07-08",
    numOfPages: 550,
    catergory: ["DSA", "programming", "tech"],
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
];
