const User = require('../models/users');

function showLoginPage (req, res) {
    res.render('login',{locals:{email:'margaret@oneillfish.com',message:'Please Log In'}});
}

async function verifyUser  (req, res) {
    //set session email
    req.session.email = req.body.email;

    req.session.save( async () => { 

        //get the email from the post body
        // console.log(req.body.email);
        const theUser = await User.getByEmail(`${req.body.email}`);
        // console.log(theUser);
    
        // console.log("theUser for bad email", theUser);
        //if the user not found, redirect to the signup page
        if (theUser === null) {
            res.redirect('/signup');
        }
            //if the user exists, check password
            if (theUser.checkPassword(req.body.password)) {
                req.session.userObject = theUser;


                req.session.save( () => {
                    // res.render('main',{locals:{user:theUser.firstName,storeName:null,stores:userStores,items:[{item:"create New Item"}]}});
                    
                    // console.log("testing if req.session.userObject is a User object");
                    // console.log(req.session.userObject instanceof User);       
                    res.render('main',{locals:{user:""}});


                })
            }
            //wrong password
            else {
                res.render('login',{locals:{email:req.body.email, message:"password incorrect. please try again"}});  //this will be a Get
    
        }
    })

    ;
}







module.exports =  {showLoginPage, verifyUser} ;