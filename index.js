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

app.get("/info", (request, response, next) => {
  const timestamp = new Date(Date.now()).toString()
  Person.countDocuments({})
    .then(count => {
      response.send(`Phonebook has info for ${count} people<br/>${timestamp}`)
    })
    .catch(error => next(error))
})

app.get("/api/persons", (request, response) => {
  Person.find({})
    .then(people => response.json(people))
})

app.post("/api/persons", (request, response, next) => {
  const newPerson = request.body

  const person = new Person({
    name: newPerson.name,
    number: newPerson.number
  })

  person.save()
    .then(savedPerson => {
      response.status(201).json(savedPerson)
    })
    .catch(error => next(error))
}
)

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.put("/api/persons/:id", (request, response, next) => {
  const personUpdate = {
    name: request.body.name,
    number: request.body.number
  }
  Person.findByIdAndUpdate(
    request.params.id,
    personUpdate,
    { runValidators: true, context: "query", new: true }
  )
    .then(update => {
      response.json(update)
    })
    .catch(error => next(error))
})

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const notFound = (request, response) => {
  response.status(404).end()
}

app.use(notFound)

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === "CastError") {
    response.status(400).json({ error: "malformed id" })
  } else if (error.name === "ValidationError") {
    response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
