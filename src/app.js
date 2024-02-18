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

    // Find the contact (if any) with the given name and email
    const existingContact = await Contact.findOne({ firstname, email });

    // Create a new comment object with timestamp
    const newComment = {
      content: comment,
      timestamp: Date.now(),
    };

    // If the contact exists:
    if (existingContact) {
      // Add the new comment to the existing contact's comments array
      existingContact.comments.push(newComment);
      await existingContact.save();
    } else {
      // Create a new contact with the original comment and the new comment
      const contactInfo = new Contact({
        firstname,
        email,
        comments: [
          {
            content: comment, // Original comment
            timestamp: Date.now(), // Timestamp for original comment
          },
          newComment, // New comment
        ],
        check,
      });
      await contactInfo.save();
    }

    res.redirect("/"); // Or send your preferred success response
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).send("Internal server error"); // Send a generic error response to the client
  }
});





app.listen(port, ()=> {
    console.log(`server is running at port no. ${port}`);
})
