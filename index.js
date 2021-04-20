const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const { request, response } = require('express')

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('build'))
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 2,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const person = persons.length
    response.send(`
        <p>Phonebook has info for ${person} people</p>
        <p>${new Date()}</p>
    `)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

const generateID = () => {
    newID = Math.floor(Math.random() * (99999 - 0) + 0)
    return newID
}

app.post('/api/persons/', (request, response) => {
    const body = request.body
    if(!body.name || !body.number){
        return response.status(400).json({error: 'content missing'})
    }
    const person = {
        id: generateID(),
        name: body.name,
        number: body.number
    }
    // if(persons.find(person => person.name === body.name)){
    //     return response.status(400).json({error: 'name must be unique'})
    // }
    // if(persons.find(person => person.number === body.number)){
    //     return response.status(400).json({error: 'number must be unique'})
    // }
    persons = [...persons, person]
    response.json(person)
})

app.put('/api/persons/:id'), (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    const body = request.body
    const person = {
        name: body.name,
        number: body.number,
    }
    persons = [...persons, person]
    response.json(persons)
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })