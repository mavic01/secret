//jshint esversion:6
require('dotenv').config() 
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption')
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});
const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

  //encryption key is the secrets
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });//we're adding our mongoose-encrypt as a plugin to our Schema and pass over our secret as a javascript object..Its important to add this plugin b4 the mongoose model

const User = mongoose.model('User', userSchema)




app.get('/', function(req, res){
    res.render('home');
})

app.get('/login', function(req, res){
    res.render('login');
})

app.get('/register', function(req, res){
    res.render('register');
})


app.post('/register', function(req, res){
    const newUser = new User({
    email: req.body.username,
    password: req.body.password
});
newUser.save(function(err){
    if (err){
        console.log(err);
    }else{
        res.render('secrets'); // this is currently the only way the can see the secrets page....at the moment, they can register buh they cant login cos we haven't created an app.post for our login route
    }
});
});


app.post('/login', function(req, res){
    const userName = req.body.username;
    const password = req.body.password;

    User.findOne({email: userName}, function(err, foundUser){
        if (err){
            console.log(err);
        }else{
            if (foundUser.password === password){
        } //foundUser.password - if user that u found has a password of which matches the password(const password just created) that the user typed in on the login page ie.. the password they typed in the form is equal to the one in our database
            res.render('secrets')
    }

    })
})// here's where we'll check in our database if we have a user with the credentials that they put in


app.listen(3000, function() {
    console.log("Server started on port 3000");
  });
