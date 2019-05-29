//npm i express, helmet, dotenv, bcryptjs, express-es6-template-engine, express-session session-file-store
require('dotenv').config();

const express = require('express');
// const PORT =3000;
const PORT =process.env.PORT;
console.log(PORT)
const app = express();

const path = require('path');

const escapeHtml = require('./utils');
//this module will protect our html headers from
//revealing too much information
const helmet = require('helmet');
app.use(helmet());




const es6Renderer = require('express-es6-template-engine');
app.engine('html', es6Renderer);
app.set('views','./views');
app.set('view engine','html');



//////////////////////////////////////
//for fileupload to work....
const fileUpload = require('express-fileupload');

const session = require('express-session');
const FileStore = require('session-file-store')(session);

app.use(session( {
    store: new FileStore(),   //no options for now
    secret: process.env.SESSION_SECRET    }      //just a random string to help encrypt
));
//must be below the other two app.use stmts
app.use(fileUpload(
    {createParentPath:true}
));

app.use(express.static('public'))


const logoutRouter = require('./routes/logout')
const loginRouter = require('./routes/login');
const signUpRouter = require('./routes/signup');
const mainRouter = require('./routes/main');

//allow you to get req.body parameters from POST form
app.use(express.urlencoded({extended:true}));

//check for user session.  if there is one, redirect to the front end....

//login page
app.use('/login',loginRouter);
//sign up page
app.use('/signup', signUpRouter);

app.use('/logout',logoutRouter)

app.use('/main',mainRouter);


//default for all other pages'
app.get('*', (req,res,next) =>{
console.log("line 87")
    //if logged in...
    if (req.session.userObject) {
        console.log("line 91 should not run")
        next();
        return;

    }
    else {

        res.render('indexback')

    }
})

app.use('*', (req,res) => {

    res.sendFile(path.join(__dirname+'/public/index.html'));


})





app.listen(PORT,() => {
    console.log(`Server running on port: ${PORT}.`);
})