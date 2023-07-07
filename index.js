const express = require("express")
const app = express()
const PORT = 3001

const data = [
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

app.get("/info", (request, response) => {
    const timestamp = new Date(Date.now()).toString()
    response.send(
        `Phonebook has info for ${data.length}people<br/>${timestamp}`)
})

app.get("/api/persons", (request, response) => {
    response.json(data)
})

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    const person = data.find(person => person.id === id)
    if (person) response.json(person)
    response.status(404).end()
})

app.listen(PORT, () => {
    console.log(`Simple server running on port ${PORT}`)
})
