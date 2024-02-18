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
employeeSchema.index({ email: 1, comment: 1 }, { unique: true, partialFilterExpression: { comment: { $exists: true } } });


const Contact = new mongoose.model("Contact", employeeSchema);

module.exports = Contact;
