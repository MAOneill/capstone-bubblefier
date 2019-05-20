
const express = require('express');

const mainRouter =  express.Router();

const { getScores,
    getURLArray,
    addScore,
    addPhoto,
    
    
    loadMainPage,
    deleteAStore,
    deleteAnItem,
    addStore,
    addItem} = require('../controllers/main');

    //just making a request to a url is a GET
    //if we do an axios post, with our package, then we need the .post formats
    
// mainRouter.post('/getscore',getScores)
mainRouter.get('/getscore',getScores)
mainRouter.get('/getphotos',getURLArray)

mainRouter.post('/addscore',addScore);
mainRouter.post('/addurl',addPhoto)


// mainRouter.post('/delete/store/:id',deleteAStore);

// mainRouter.post('/delete/item', deleteAnItem);

// mainRouter.post('/item/add/:storeID', addItem);

// mainRouter.post('/store/add/', addStore);

mainRouter.post('/',loadMainPage);

mainRouter.get('/',loadMainPage);


module.exports = mainRouter;