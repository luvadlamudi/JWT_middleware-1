// load env variables
require('dotenv').config()

const jwt = require('jsonwebtoken')
const express = require('express')
const app = express()

// enable JSON parsing
app.use(express.json())

// stores refresh tokens
let tokenList = []

// token route
app.post('/token', (req, res) => {
  const refreshToken = req.body.token

  // checks if token is valid
  if (refreshToken == null) {
    return res.sendStatus(401)
  }
  if (!tokenList.includes(refreshToken)) {
    return res.sendStatus(403)
  }

  jwt.verify(refreshToken, process.env.REFRESH_SECRET, (error, client) => {
    if (error) {
      res.sendStatus(403)
    } 
    // create a new access token 
    const accessToken = accessAuth({ name: client.name })
    res.json({ accessToken: accessToken })
  })
})

// logout route
app.delete('/logout', (req, res) => {
  const refreshToken = req.body.token
  // filter refresh tokens
  tokenList = tokenList.filter(token => token !== refreshToken)

  res.sendStatus(204)
})

// login route
app.post('/login', (req, res) => {
  // create client object
  const user = req.body.username 
  const client = { name: user }

  // generate access tokens
  const accessToken = accessAuth(client)
  const refreshToken = jwt.sign(client, process.env.REFRESH_SECRET)
  // add token to list
  tokenList.push(refreshToken)

  res.json({ accessToken: accessToken, refreshToken: refreshToken })
})

// generates access tokens
function accessAuth(client) {
  // creates jwt token
  return jwt.sign(client, process.env.JWT_SECRET, { expiresIn: '1h' })
}

app.listen(4000)
