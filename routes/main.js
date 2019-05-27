
const express = require('express');

const mainRouter =  express.Router();

const { getScores,
    getURLArray,
    addScore,
    deletephoto,
    addPhoto,
    loadMainPage,
    returnUserID,
    } = require('../controllers/main');

    //just making a request to a url is a GET
    //if we do an axios post, with our package, then we need the .post formats
    
// mainRouter.post('/getscore',getScores)
mainRouter.get('/getscore',getScores)
mainRouter.get('/getphotos',getURLArray)

// mainRouter.post('/deletephoto/:photoid',deletephoto)

mainRouter.post('/deletephoto/:photoid/:photoword/:photourl',deletephoto)

mainRouter.post('/addscore/:score',addScore);

mainRouter.post('/addurl',addPhoto)
mainRouter.get('/userid',returnUserID)


mainRouter.post('/',loadMainPage);

mainRouter.get('/',loadMainPage);


module.exports = mainRouter;