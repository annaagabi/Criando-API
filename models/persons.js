const mongoose  = require('mongoose')

const Person = mongoose.model('Person', { // Vai criar um tabela chamada Person
    name: String,
    salary: Number,
    approved: Boolean,
})

module.exports = Person