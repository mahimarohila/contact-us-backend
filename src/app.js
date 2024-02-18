const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");

require("./db/conn");

const Contact = require("./models/contacts");

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views",template_path);
hbs.registerPartials(partials_path);

app.get("/", (req,res)=> {
    res.render("index")
});
app.get('/', (req, res) => {
    // Pass data to your template, including the image URL
    res.render('index', { imageUrl: '../public/img/Monica Bhutani.jpeg' });
  });
app.get("/", async (req,res)=> {
    try {
        // Fetch all contacts
        const contacts = await Contact.find({});
        res.render("index", { contacts });
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post("/index", async (req, res) => {
   try {
      const { firstname, email, comment, check } = req.body;

      // Check if a contact with the same name and email exists
      const existingContact = await Contact.findOne({ firstname, email });

      if (existingContact) {
         // If a contact exists, update the existing document with the new comment
         existingContact.comment = comment;
         existingContact.check = check;
         await existingContact.save();
         res.redirect("/");
      } else {
         // If a contact does not exist, create a new document
         const contactInfo = new Contact({ firstname, email, comment, check });
         await contactInfo.save();
         res.redirect("/");
      }
   } catch (error) {
      res.status(400).send(error);
   }
});


app.listen(port, ()=> {
    console.log(`server is running at port no. ${port}`);
})
