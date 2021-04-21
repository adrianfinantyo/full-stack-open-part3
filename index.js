require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
//const { request, response } = require('express')
const Person = require('./models/person')

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('build'))
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// let persons = [
//     {
//         "id": 1,
//         "name": "Arto Hellas",
//         "number": "040-123456"
//     },
//     {
//         "id": 2,
//         "name": "Ada Lovelace",
//         "number": "39-44-5323523"
//     },
//     {
//         "id": 2,
//         "name": "Dan Abramov",
//         "number": "12-43-234345"
//     },
//     {
//         "id": 4,
//         "name": "Mary Poppendieck",
//         "number": "39-23-6423122"
//     }
// ]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
    const person = persons.length
    response.send(`
        <p>Phonebook has info for ${person} people</p>
        <p>${new Date()}</p>
    `)
})

app.get('/api/persons', (request, response) => {
    // response.json(persons)
    Person.find({}).then(persons => {
        response.json(persons)
    })
})


app.get('/api/persons/:id', (request, response, next) => {
    // const id = Number(request.params.id)
    // const person = persons.find(person => person.id === id)

    // if (person) {
    //     response.json(person)
    // } else {
    //     response.status(404).end()
    // }
    Person.findById(request.params.id).then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    // const id = Number(request.params.id)
    // persons = persons.filter(person => person.id !== id)
    // response.status(204).end()
    Person.findByIdAndRemove(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

// const generateID = () => {
//     newID = Math.floor(Math.random() * (99999 - 0) + 0)
//     return newID
// }

app.post('/api/persons/', (request, response, next) => {
    // if(!body.name || !body.number){
    //     return response.status(400).json({error: 'content missing'})
    // }
    // if(persons.find(person => person.name === body.name)){
    //     return response.status(400).json({error: 'name must be unique'})
    // }
    // if(persons.find(person => person.number === body.number)){
    //     return response.status(400).json({error: 'number must be unique'})
    // }
    // persons = [...persons, person]
    // response.json(person)
    const body = request.body
    const person = new Person({
        //id: generateID(),
        name: body.name,
        number: body.number
    })
    person
        .save()
        .then(savedPerson => savedPerson.toJSON())
        .then(savedAndFormattedNote => {
            response.json(savedAndFormattedNote)
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    // persons = persons.filter(person => person.id !== id)
    // persons = [...persons, person]
    // response.json(person)
    const body = request.body
    const person = {
        name: body.name,
        number: body.number,
    }
    //console.log(typeof request.params.id)
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})