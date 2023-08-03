// load env variables
require('dotenv').config()

const jwt = require('jsonwebtoken')
const express = require('express')
const app = express()

// enable JSON parsing
app.use(express.json())

// test post data
const tests = [
  {
    username: 'Lucas',
    title: 'Post 1 '
  },
]

// tests route
app.get('/tests', tokenAuth, (req, res) => {
  // filter tests by username
  res.json(tests.filter(post => post.username === req.user.name)) 
})

// main middleware
function tokenAuth(req, res, next) {
  // extract token from header
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  // if token doesn't exist return 401
  if (!token) {
    return res.sendStatus(401)
  }
  // verify token
  jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
 
    console.log(error)

    // error while verifying token
    if (error) {
        return res.sendStatus(403)
    } 

    req.user = user
    next()
  })
}

app.listen(3000)
