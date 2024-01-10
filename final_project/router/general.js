const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const body = req.body
  const errors = []
  if (!body.email || body?.email === "") errors.push("Missing email field")
  if (!body?.password || body?.password === "") errors.push("Missing password field")
  if(errors.length > 0)
    return res.status(400).json({errors});
  const {email, password} = body
  if (users.find(user => user.email === email)) 
    return res.status(400).json({error: "User already exists"});
  users.push({email, password})
  return res.status(200).json({message: "Customer successfully registered. Now you can login"});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return new Promise((resolve) => {
    resolve(books)
  }).then(books => res.status(200).json({books}))
  .catch(() => res.status(400).json({message: 'Some thing went wrong'}))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const {isbn} = req.params;
    new Promise((resolve, rej) => {
      if(!books[isbn]){
         rej({message: "Book not found"})
      }
      resolve(books[isbn])
    }).then(book => res.status(200).json(book))
    .catch(error => res.status(404).json(error))
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const {author} = req.params;
  new Promise((resolve, rej) => {
    const booksFound = []
    for(const [key, value] of Object.entries(books)) {
      if(value.author === author) {
        booksFound.push({isbn: key, title: value.title, reviews: value.reviews})
      }
    }
      resolve(booksFound)
    }).then(books => res.status(200).json({booksbyauthor: books}))
    .catch(error => res.status(404).json({message: error}))
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const {title} = req.params;
  new Promise((resolve, rej) => {
    const booksFound = []
    for(const [key, value] of Object.entries(books)) {
      if(value.title === title) {
        booksFound.push({isbn: key, author: value.author, reviews: value.reviews})
      }
    }
    if(!booksFound){
      rej("Book not found")
    }
      resolve(booksFound)
    }).then(book => res.status(200).json({booksbytitle: book}))
    .catch(error => res.status(404).json({message: error}))
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const {isbn} = req.params;
  if(!books[isbn]){
    return res.status(404).json({message: "Book not found"});  
  }
  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
