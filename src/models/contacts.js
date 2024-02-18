const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    firstname :{
        type:String 
        
    },
    email: {
        type:String
       
       
    },
    comment: {
        type:String
       
    },
    check: {
        type:String
    }
})
employeeSchema.index({ email: 1 }, { unique: false });


const Contact = new mongoose.model("Contact", employeeSchema);

module.exports = Contact;
