const User = require('../models/users');
const Photos = require('../models/photos')
const UserScore = require('../models/scores')

const sharp = require('sharp');



const escapeHtml = require('../utils');

async function  loadMainPage(req, res) {
    req.session.save(  () => {

        //if there is no logged in user, then redirect to login.
        //otherwise direclty going to /main will work
        if (req.session.userObject === null) {
            res.redirect('login')
        }

        //#@#@#@#@#@#@#@#  THIS WILL CHANGE TO MY **FRONTEN D****
        res.redirect('main')
        // res.render('main')
        //res.redirect('/')   //this is what I will have!!
    
    })   
}


async function getScores (req, res) {
    console.log("getScores is running");

    let uid;
    if (req.session.userObject) {
        uid = req.session.userObject.id
    }
    else uid = 1;
console.log("uid is ", uid);
    const theScores = await UserScore.getAllScores(uid)
    //just return the json object.
    // console.log(theScores);
    //this will used as an axios/fetch

    // i won't need the redirect once this is called in react
    // res.redirect('/main')
    res.json(theScores)

    // return theScores;
}
async function getURLArray (req, res) {
    // use req.session.userObject.id as the userID from
    console.log("getURLArray is running");
let urlArray;
    if (req.session.userObject) {

         urlArray = await Photos.getPhotoURLs(req.session.userObject.id);
    }
    else {
        //take this else out
        console.log("user id hardcoded to 1");
         urlArray = await Photos.getPhotoURLs(1);
    }
    console.log(urlArray);
    res.json(urlArray)

    // res.redirect('/main');
    // return urlArray;
}
async function addScore (req, res) {

    //this works, but I won't need it when I put my backend with my front end
res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
res.setHeader('Access-Control-Allow-Credentials',true);

    //the score value will be passed as an url parameter from react
    // console.log("my req.body", req.body);
    const score = req.params.score;
    // let uid = req.params.uid;

    if (req.session.userObject) {
        uid = req.session.userObject
    }
    else {
        uid = 1;
    }
    

    // console.log("adding a score of 3: ", score);

    //I NEED TO GET THE USERID FROM PARAMS TOO...


    // const response = await UserScore.addUserScore(req.session.userObject.id, score)
    const response = await UserScore.addUserScore(uid, score)
    console.log("tjhe response is :",response);
    // res.redirect('/main');
    //this should return the response....
    if (response.rowCount === 1) {
        res.json({message:"new score added for user"})
    }
    else {
        res.json({message:"score not added, something went wrong"})
    }

}
    
    
async function addPhoto (req, res) {

let uid ;

if (req.session.userObject) {
    uid = req.session.userObject.id
}
else {
    console.log("resetting uid to 1");
    uid = 1;
}
// if (req.params.uid === "null") {
//     uid = 1
// }


// console.log("req.params.uid is :", req.params.uid);
// console.log("the uid is ", uid);
    //will this work?
res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
res.setHeader('Access-Control-Allow-Credentials',true);

        //photo url will be passed as parameter in url from react
        // console.log("request is", req);
        console.log("req.files is" ,req.files);
    //using express-fileupload - it will b4e in the req.files object
    // console.log("the property image is ", req.files.properyimage);
    
        if (Object.keys(req.files).length == 0) {
          return res.status(400).json({message:'No files were uploaded.'});
        }
      
        // let sampleFile = (req.files.foo ? req.files.foo : "bad_file_name.xxx");
        let sampleFile = (req.files.file ? req.files.file : "bad_file_name.xxx");
        console.log(sampleFile);
    //   console.log(sampleFile.name);
        //get a unique number based on date and user id:


    
        let userid = (req.session.userId ? req.session.userId : 0).toString() ;
        let date = new Date();
        let seconds = parseInt(date.getTime() / 1000).toString();
        let fileName = userid + seconds + sampleFile.name;


       
        sampleFile.mv(`./public/photos/${fileName}`, async function(err) {
          if (err) {

              return res.status(500).json({message:'error - No files were uploaded.'});
          }

           //attemp to use sharp to resize the iamge before saving
        sharp(`./public/photos/${fileName}`)
        .rotate()
        .resize(800,800)
        .toFile(`./public/photos/${fileName}X`)
        
          //   res.send('File uploaded!');
  
          // save the data to the database
          await Photos.addPhotoURL(uid,`photos/${fileName}X`) ;
        //   await Photos.addPhotoURL(req.session.userObject.id,`photos/${fileName}`) ;
        // console.log("backend thinks req.session id is : ",req.session.userObject.id);
        res.json({message:"file uploaded succesfully"})

        //   res.redirect('/main');
        //   showProperty(req.body.propid,"Image uploaded",false, req, res)

      
        });


}

function returnUserID (req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials',true);

    // console.log("The request is", req);

    // console.log("returnUserID function called id is:",req.session.userObject.id);
    // return req.session.userObject.id
    if (req.session.userObject) {
        res.json(req.session)

    }
    else {   ///#$#$#$#$#$$#$#$$#take this out!!!
        res.json({userObject:{
            id:1,
            email:"dummy@anywhere.com",
        }})
    }
}

module.exports = { getScores,
    getURLArray,
    addScore,
    addPhoto,
    loadMainPage,
    returnUserID,
};


