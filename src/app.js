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
app.post("/index", async(req,res)=> {
   try {
    const contactInfo = new Contact({
        firstname: req.body.firstname,
        email: req.body.email,
        comment: req.body.comment,
        check: req.body.check
    })
    const contacted = await contactInfo.save();
    res.status(201).render("index");
   } catch (error) {
    res.status(400).send(error);
   }
});

app.listen(port, ()=> {
    console.log(`server is running at port no. ${port}`);
})