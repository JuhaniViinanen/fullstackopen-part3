const express = require("express")
const morgan = require("morgan")

const app = express()
app.use(express.json())

morgan.token("data", (req, res) => {
    const data = JSON.stringify(req.body)
    if (data === "{}") return ""
    return data
})
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :data"))

let data = [
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
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

app.get("/info", (request, response) => {
    const timestamp = new Date(Date.now()).toString()
    response.send(
        `Phonebook has info for ${data.length} people<br/>${timestamp}`)
})

app.get("/api/persons", (request, response) => {
    response.json(data)
})

app.post("/api/persons", (request, response) => {
    const newPerson = request.body

    if (!newPerson.name) {
        response.status(400).json({error: "name missing"})
    } else if (!newPerson.number) {
        response.status(400).json({error: "number missing"})
    } else if (data.find(person => person.name === newPerson.name)) {
        response.status(400).json({error: "name is already taken"})
    } else {
        newPerson.id = getRandomInt(100000)
        data = data.concat(newPerson)
        response.status(201).json(newPerson)
    }
})

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    const person = data.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    const person = data.find(person => person.id === id)
    if (!person) {
        response.status(404).end()
    } else {
        data = data.filter(person => person.id !== id)
        response.status(204).end()
    }
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Simple server running on port ${PORT}`)
})
