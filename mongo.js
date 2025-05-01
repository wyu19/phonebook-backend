const mongoose = require('mongoose')

if (process.argv.length < 3){
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://wyu711:${password}@cluster0.bsyl1ip.mongodb.net/phoneApp?retryWrites=true&w=majority&appName=Cluster0`
mongoose.set('strictQuery',false)

mongoose.connect(url)

const contactSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Contact = mongoose.model('Contact', contactSchema)

const newContact = new Contact({  
    name: name,
    number: number
})

newContact.save().then(result => {
    console.log('contact saved!')
})
console.log('phonebook:')
Contact.find({}).then(result => {
    result.forEach(contact => {
        console.log(contact.name, contact.number)
    })
    mongoose.connection.close()
})