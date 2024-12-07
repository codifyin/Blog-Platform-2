require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const methodOverride = require('method-override');


const app = express();

const PORT = process.env.PORT;


app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.set("view engine", "ejs");
app.use('', require('./routes/auth'));
app.use('/public', express.static('./public'));

app.get("/", (req, res) => {
    res.render("main");
});

app.listen(PORT, () => {console.log(`Running on http://localhost:${PORT}`)})

const connect = mongoose.connect(process.env.DB_URI);
connect.then(() => {
    console.log("database connected succesfully");
})
.catch(() =>{
    console.log("datebase cannot get connected");
});