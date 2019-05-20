const User = require('../models/users');
async function  createNewUser(req, res) {
    console.log(req.body);
    const newUser = await User.getByEmail(req.body.email);
    if (newUser === null) {
        const newPassword = User.hashPassword(req.body.password);
        await User.insertUser(req.body.email, newPassword);
//save email to session
        req.session.email = req.body.email;
        req.session.save( async () => {
            res.render('login',{locals:{message:"Please Log in",email:req.session.email}})
        })
//send them to login with email filled

    } else {
        res.render('login', {locals: {message: 'Looks like we know each other, please log in', email:req.body.email}})
    }
     //hash the pass word and save user to db
    
    //pull it out of the db for the unique id

    //create {} for future use 
    // const newUserInfo = new User ()
    //save id+ to session

    
}
//this will serve the view/signup.html
function showSignUp(req, res) {
    res.render('signup', {locals: {message: "Sign up here"}});
}

module.exports = {createNewUser, showSignUp};