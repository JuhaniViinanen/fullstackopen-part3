require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const Person = require("./models/person")

const app = express()
app.use(express.static("build"))
app.use(express.json())

morgan.token("data", (req, res) => {
    const data = JSON.stringify(req.body)
    if (data === "{}") return ""
    return data
})
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :data"))

app.get("/info", (request, response) => {
    const timestamp = new Date(Date.now()).toString()
    response.send(
        `Phonebook has info for ${data.length} people<br/>${timestamp}`)
})

app.get("/api/persons", (request, response) => {
    Person
      .find({})
      .then(people => response.json(people))
})

app.post("/api/persons", (request, response) => {
    const newPerson = request.body

    if (!newPerson.name) {
        response.status(400).json({error: "name missing"})
    } else if (!newPerson.number) {
        response.status(400).json({error: "number missing"})
    }  else {
        const person = new Person({
            name: newPerson.name,
            number: newPerson.number
        })
        person.save().then(savedPerson => {
            response.status(201).json(savedPerson)
        })
    }
})

/*
else if (data.find(person => person.name === newPerson.name)) {
        response.status(400).json({error: "name is already taken"})
    }
*/

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
    Person.findByIdAndDelete(request.params.id)
      .then(result => {
        response.status(204).end()
      })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
