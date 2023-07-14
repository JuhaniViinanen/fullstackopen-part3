const mongoose = require("mongoose")

const dbURL = process.env.MONGODB_URI

console.log("connecting to", dbURL)
mongoose.connect(dbURL)
  .then(result => {
    console.log("connected to MongoDB")
  })
  .catch(error => {
    console.log("error connecting to MongoDB", error.message)
  })

const personSchema = new mongoose.Schema(
    {
        name: {
          type: String,
          minLength: 3,
          required: true
        },
        number: String
    },
    {
        toJSON: {
            transform: (document, returnedObject) => {
                returnedObject.id = returnedObject._id.toString()
                delete returnedObject._id
                delete returnedObject.__v
            }
        }
    }
)

module.exports = mongoose.model("Person", personSchema)
