require('dotenv').config()
const express = require('express')
const Contact = require('./models/Contact')

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}


const morgan = require('morgan')
morgan.token('id', function getId (req) {
    console.log(req)
    return req.id
  })
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(express.static('dist'))
app.use(requestLogger)
app.use(cors())
app.use(morgan(':id :method :url :response-time'))


app.get('/api/persons', (request, response) => {
    console.log('response:', response)
    Contact.find({}).then(contact => {
        response.json(contact)
    })
})

app.get('/info', (request, response) => {
    const date = new Date()
    const totalPeople = Contact.length
    const text = `<p>Phonebook has info for ${totalPeople} people</p><p>${date}</p>`
    response.send(text)
})
// /80a9d7d278245ec42940a85
app.get('/api/persons/:id', (request, response, next) => {
    Contact.findById(request.params.id)
    .then(contact => {
        if (contact) {
            response.json(contact)
        } else {
            response.status(404).end()
        }
    }).catch(error => next(error))
}) 

app.delete('/api/persons/:id', (request, response, next) => {
    Contact.findByIdAndDelete(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})


app.post('/api/persons', (request, response, next) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'missing info'
        })
    }
    const person = new Contact({
        name: body.name,
        number: body.number
    })
    person.save().then(result => {
        response.json(result)
        console.log('contact saved!')
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
    }
  
    next(error)
  }

app.use(errorHandler)



const PORT = process.env.PORT
app.listen(PORT,  () => {
    console.log('Server running on port', PORT)
})