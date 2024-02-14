// An API that provides a way to store shoppinglists (urls) with a title
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')

// connect to the database
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.once('open', () => console.log('🦈 Connected to MongoDB'))

const port = process.env.PORT

const app = express()
app.use(morgan())
app.use(express.json())

const Shoppinglist = require('./models/Shoppinglist')

app.get('/shoppinglists', (req, res) => {
  // query the database and return the results of the query in the response
  // the database query is asynchronous, so we need to use the .then() method
  Shoppinglist.find().then((results) => res.status(200).json(results))
})

app.post('/shoppinglists', (req, res) => {
  const newShoppinglist = new Shoppinglist(req.body) // create the object
  newShoppinglist.save() // save it to the database
  res.status(201).json(newShoppinglist) // return the newly created object
})

app.get('/shoppinglists/:shoppinglistId', (req, res) => {
  // look up the specific shoppinglist that is being requested in the url, using the model
  Shoppinglist.findById(req.params.shoppinglistId)
    .then((results) => {
      if (results) {
        res.status(200).json(results)
      } else {
        res.status(404).json({ message: 'not found' })
      }
    })
    .catch((error) => res.status(400).json({ message: 'Bad request' }))
})

// not working by Title
app.get('/shoppinglists/:shoppinglistTitle', (req, res) => {
    // look up the specific shoppinglist that is being requested in the url, using the model
    Shoppinglist.findByTitle(req.params.shoppinglistTitle)
      .then((results) => {
        if (results) {
          res.status(200).json(results)
        } else {
          res.status(404).json({ message: 'not found' })
        }
      })
      .catch((error) => res.status(400).json({ message: 'Bad request' }))
  })
  

app.patch('/shoppinglists/:shoppinglistId', (req, res) => {
  // find the shoppinglist -- look it up in the db
  Shoppinglist.findById(req.params.shoppinglistId)
    .then((shoppinglist) => {
      // if shoppinglist is not found, return 404
      if (shoppinglist) {
        // update the record somehow???
        shoppinglist.title = req.body.title || shoppinglist.title
        // shoppinglist.items = req.body.items || shoppinglist.items
        // save it! (persist the changes to the database)
        shoppinglist.save()
        // send a success response + the json results
        res.status(200).json(shoppinglist)
      } else {
        res.status(404).json({ message: 'not found' })
      }
      // handle any errors that come up with appropriate responses to the client
    })
    .catch((error) => res.status(400).json({ message: 'Bad request' }))
})

app.post('/shoppinglists/:shoppinglistId/items', (req, res) => {
    // find the shoppinglist -- look it up in the db
    Shoppinglist.findById(req.params.shoppinglistId)
      .then((shoppinglist) => {
        // if shoppinglist is not found, return 404
        if (shoppinglist) {
          // update the record somehow???
        //   shoppinglist.title = req.body.title || shoppinglist.title
          shoppinglist.items.push(req.body.items)
          // save it! (persist the changes to the database)
          shoppinglist.save()
          // send a success response + the json results
          res.status(201).json(shoppinglist)
        } else {
          res.status(404).json({ message: 'not found' })
        }
        // handle any errors that come up with appropriate responses to the client
      })
      .catch((error) => res.status(400).json({ message: 'Bad request' }))
  })

app.delete('/shoppinglists/:shoppinglistId', (req, res) => {
    // look up the shoppinglist by id
    // delete it, using Mongoose methods
    Shoppinglist.findById(req.params.shoppinglistId)
    .then((shoppinglist) => {
      // if shoppinglist is not found, return 404
      if (shoppinglist) {
        // delete the shoppinglist
        shoppinglist.deleteOne().then(() => res.status(204).send())
        // send a success response but no content
       } else {
        res.status(404).json({ message: 'not found' })
      }
      // handle any errors that come up with appropriate responses to the client
    })
  //   .catch((error) => res.status(400).json({ message: 'Bad request' }))
  })

app.listen(port, () => console.log(`🐷 Application is running on port ${port}`))