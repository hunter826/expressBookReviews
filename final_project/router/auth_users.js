const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const {email, password} = req.body
  if (email === "" || password === "")
    return res.status(400).json({message: "Email or password is missing"});
  const user = users.find(user => user.email === email)
  if(user && user.password === password){
    const token = jwt.sign({user:email}, 'access')
    req.session.authorization = {accessToken: token};
    return res.status(200).json({message: "Customer successfully logged in", token}) 
  }
  return res.status(401).json({message: "Invalid username and/or password"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const {isbn} = req.params;
  const {review} = req.body;
  const {user} = req.user;
  if(!books[isbn]) return res.status(401).json({message: `Book with ISBN ${isbn} not found`});
  books[isbn].reviews[user] = {
    review,
    user
  }
  return res.status(200).json({message: `The review for the book with ISBN ${isbn} has been added/updated`});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const {isbn} = req.params;
  const {review} = req.body;
  const {user} = req.user;
  if(!books[isbn]) return res.status(401).json({message: "Book not found"});
  delete books[isbn].reviews[user]
  return res.status(200).json({message: `The review for the book with ISBN ${isbn} posted by ${user} has been deleted`});
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
