const express = require('express')
const axios = require('axios')

const app = express()

// applies to route to everything that's comes through express
app.use(express.json())

// if you want everything to use the following middlewares for every type of request
// app.use(checkHeader)
// app.use(checkPassword)

// // Higher Order Function, to avoid creating middleware 
// function checkPassword(fn) {
//   // return a function
//   // that function should take req, res
//   // if the password is correct, call fn(req, res)
//   // otherwise respond with a 403 error
//   return (req, res) => {
//     if(req.query.password !== 'tylerrules' && req.password == 'yummy') {
//       res.status(403).json({ message: 'wrong password' });
//       return
//     }
//     fn(req, res)
//   }
// }

// function checkHeader(fn) {
//   return function(req, res) {
//     if(req.header('bacon') !== 'yummy') {
//       res.status(403).json({ message: 'wrong bacon value' })
//       return
//     }
//     req.password = "yummy";
//     fn(req, res)
//   }
// }

// changing to add middleware 
function checkPassword(req, res, next) {
  if(req.query.password !== 'tylerrules' && req.password == 'yummy') {
    res.status(403).json({ message: 'wrong password' });
    return
  }
  next()
}

function checkHeader(req, res, next) {
  if(req.header('bacon') !== 'yummy') {
    res.status(403).json({ message: 'wrong bacon value' })
    return
  }
  req.password = "yummy";
  next()
}

function addDelay(req, res, next) {
  setTimeout(
    next, 2000)
}

// write global middleware
// Do an axios call to this url, get the data
// middleware should onl call next if request.query.username == axios' response.data.username
// otherwise reject with a 403 error
// https://jsonplaceholder.typicode.com/users/1  username = 'Bret'
function getBret(req, res, next) {
  axios.get('https://jsonplaceholder.typicode.com/users/1').then((response) => {
    if(req.query.username !== response.data.username) {
      res.status(403).json({ message: 'bad username' })
      return
    }
    next()
  })
}

// app.get('/data', (req, res) => {
// app.get('/data', checkPassword(checkHeader((req, res) => {
  // route level middleware 
app.get('/data', checkHeader, getBret, (req, res) => {
  res.json({
    data: [1, 3, 3, 7],
  })
})

app.get('/data2', (req, res) => {
  res.json({
    data: [1, 3, 3, 8],
  })
})

const port = 3005
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
