const mongoose = require("mongoose")

if (!(process.argv.length === 3 || process.argv.length === 5)) {
    console.log("Expected arguments <password> <name> <number>")
    process.exit()
}

const password = process.argv[2]
const databaseURL = `mongodb+srv://phonebookapp:${password}@fullstackopen.wlvrg9v.mongodb.net/phonebook?retryWrites=true&w=majority`
mongoose.connect(databaseURL)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model("Person", personSchema)

if (process.argv.length === 3) {
    console.log("phonebook:")
    Person
      .find({})
      .then(result => {
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
} else {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })
    person
      .save()
      .then(result => {
        console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
        mongoose.connection.close()
    })
}
