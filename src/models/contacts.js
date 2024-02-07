const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    firstname :{
        type:String, 
        required:true
    },
    email: {
        type:String,
        required:true,
        unique:true
    },
    comment: {
        type:String,
        required:true
    },
    check: {
        type:String
    }
})

const Contact = new mongoose.model("Contact", employeeSchema);

module.exports = Contact;
