const User = require('../models/users');
const Photos = require('../models/photos')
const UserScore = require('../models/scores')





const escapeHtml = require('../utils');

async function  loadMainPage(req, res) {
    req.session.save(  () => {

        //if there is no logged in user, then redirect to login.
        //otherwise direclty going to /main will work
        if (req.session.userObject === null) {
            res.redirect('login')
        }

        //#@#@#@#@#@#@#@#  THIS WILL CHANGE TO MY **FRONTEN D****
        res.render('main')
    
    })   
}


async function getScores (req, res) {
    // use req.session.userObject.id as the userID from
    console.log("getScores is running");
    const theScores = await UserScore.getAllScores(req.session.userObject.id)
    //just return the json object.
    console.log(theScores);
    //this will used as an axios/fetch

    // i won't need the redirect once this is called in react
    res.redirect('/main')
    return theScores;
    //don't res.render
}
async function getURLArray (req, res) {
    // use req.session.userObject.id as the userID from
    console.log("getURLArray is running");
    const urlArray = await Photos.getPhotoURLs(req.session.userObject.id);
    console.log(urlArray);
    res.redirect('/main');
    return urlArray;
}
async function addScore (req, res) {

    //will this work?
res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
res.setHeader('Access-Control-Allow-Credentials',true);

    //the score value will be passed as an url parameter from react
    console.log("my req.body", req.body);
    const score = req.params.score;
    // console.log("adding a score of 3: ", score);

    const response = await UserScore.addUserScore(req.session.userObject.id, score)
    // console.log("tjhe response is :",response);
    res.redirect('/main');
    //this should return the response....

}
    
    
async function addPhoto (req, res) {


    //will this work?
res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
res.setHeader('Access-Control-Allow-Credentials',true);

        //photo url will be passed as parameter in url from react
        // console.log("request is", req);
        console.log("req.files is" ,req.files);
    //using express-fileupload - it will b4e in the req.files object
    // console.log("the property image is ", req.files.properyimage);
    
        if (Object.keys(req.files).length == 0) {
          return res.status(400).send('No files were uploaded.');
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

              return res.status(500).send(err);
          }
       
          //   res.send('File uploaded!');
  
          // save the data to the database
          await Photos.addPhotoURL(1,`photos/${fileName}`) ;
        //   await Photos.addPhotoURL(req.session.userObject.id,`photos/${fileName}`) ;
        // console.log("backend thinks req.session id is : ",req.session.userObject.id);
          res.redirect('/main');
        //   showProperty(req.body.propid,"Image uploaded",false, req, res)

      
        });


}

function returnUserID (req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials',true);

    console.log("The request is", req);

    // console.log("returnUserID function called id is:",req.session.userObject.id);
    // return req.session.userObject.id
    res.json(req.session)
}

module.exports = { getScores,
    getURLArray,
    addScore,
    addPhoto,
    loadMainPage,
    returnUserID,
};


