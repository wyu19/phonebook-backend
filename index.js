const express = require('express')


const morgan = require('morgan')
morgan.token('id', function getId (req) {
    console.log(req)
    return req.id
  })
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(express.static('dist'))
app.use(cors())
app.use(morgan(':id :method :url :response-time'))
let contacts =  [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(contacts)
})

app.get('/info', (request, response) => {
    const date = new Date()
    const totalPeople = contacts.length
    const text = `<p>Phonebook has info for ${totalPeople} people</p><p>${date}</p>`
    response.send(text)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = contacts.find(contact => contact.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    contacts = contacts.filter(contact => contact.id !== id)
    response.status(204).end()
})

const generateId = () => {
    const maxId = contacts.length > 0
        ? Math.max(...contacts.map(n => Number(n.id))) : 0
    return maxId
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'missing info'
        })
    }
    if (body.name && contacts.find(contact => contact.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    const person = {
        id: generateId() + 1,
        name: body.name,
        number: body.number
    }
    contacts = contacts.concat(person)
    response.json(person)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT,  () => {
    console.log('Server running on port', PORT)
})