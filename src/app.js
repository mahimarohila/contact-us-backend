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

      // Find the existing contact or create a new one
      let existingContact = await Contact.findOne({ firstname, email });

      if (!existingContact) {
         // If a contact does not exist, create a new document
         const contactInfo = new Contact({ firstname, email, comments: [{ comment, check }] });
         await contactInfo.save();
         res.redirect("/");
      } else {
         // If a contact exists, append the new comment to the existing comments
         existingContact.comments.push({ comment, check });
         await existingContact.save();
         res.redirect("/");
      }
   } catch (error) {
      res.status(400).send(error);
   }
});




app.listen(port, ()=> {
    console.log(`server is running at port no. ${port}`);
})
