const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
console.log('password', password)

const url =
  `mongodb+srv://forworldgh:${password}@cluster0.e7fo8gn.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Person = mongoose.model('Person', personSchema)

const note = new Person({
    name: 'Galadriel',
    number: 79991234560,
  })
  
  note.save().then(result => {
    console.log('note saved!')
    mongoose.connection.close()
  })
  