const User = require('../models/users');


const Photos = require('../models/photos')
const UserScore = require('../models/scores')


const Store = require('../models/stores');
const Item = require('../models/items');


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

///I DON'T THINK I NEED ANY OF THIS......
//ALTHOUGH THESE WILL BEE REPACED WITH THE CALLS TO MY DATABASE THAT REACT WILL USE WITH
//PATH VARIABLES....

//GET ALL PHOTO URLS
//GET ALL SCORES
//ADD A SCORE
//ADD A PHOTO

async function getScores (req, res) {
    // use req.session.userObject.id as the userID from
    console.log("getScores is running");
    const theScores = await UserScore.getAllScores(req.session.userObject.id)
    //just return the json object.
    console.log(theScores);
    res.redirect('/main')
    //this will used as an axios/fetch

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
    //the score value will be passed as an url parameter from react
    const userid = req.params.id;
    console.log("adding score for ", userid);
}
async function addPhoto (req, res) {
    //photo url will be passed as parameter in url from react
}
async function deleteAStore (req, res) {
    console.log("Got to delteAStore");
    //the id will come on the req.params.id
    const storeID = req.params.id;
    console.log("The store id to delete is ",storeID);

    //to delete a store, you need to delete all items for that store
    await Item.deleteByStoreID(storeID);
    console.log("items are deleted")
    

    //then delete the user-store references
    await UserStore.deleteAllStoreID(storeID);
    console.log("user store is deleted");


    //then delete the store record...
    await Store.deleteStore(storeID);
    console.log("The store is deleted");


    console.log("The user object", req.session.userObject);

    // console.log("The type of userObject is ", typeof req.session.userObject)
    //then re-render the main page with the new list of stores

    //this simply doesn't work
    //the saved object in the sessions doesn't appear to retain the fact that it is an intance of User?
    //NOPE - somewhere along the way, the saved instance in sessions LOSES the methods that were associated
    //with the object.  it basically just exists as a dictionary.
    // console.log(req.session.userObject.allStores())

    let userStores = await User.allStoresByUser(parseInt(req.session.userID));

    // let userStores = req.session.userObject.allStores();
    console.log("what is the userObject now?")
    console.log(req.session.userObject instanceof User);

    // let userStores = await req.session.userObject.allStores();  //get a list of stores
    console.log("The userStores after deleting are: ", userStores);

    //i have no idea why it comes back as undefined here but an empty array in login.js
    //but the HTML rendering can't handle undefined.
    //it does fine with an empty array
    if (userStores === undefined) {
        userStores = [];
    }
    // console.log("the userStores are", userStores);
    //re pull the stores based on req.sessions.id -- this is the user id.

    //and resave the stores in session because it has changed
    req.session.stores = userStores;
    req.session.storeID = null;  //current store id
    req.session.storeName =  null;  //current store name

    console.log("Saving session variables");
    req.session.save( () => {

        // res.render('main',{locals:{user:req.session.user,storeName:null,stores:userStores,items:[{item:"create New Item"}]}});
        res.render('main',{locals:{user:req.session.user,storeid:null,storeName:null,stores:userStores,items:[]}});
    })


    }

async function deleteAnItem (req,res) {
    //just need to delete the item from the items table.  it has a unique id
    console.log("got to deleteAnItem", req.body.id);
    await Item.deleteItem(parseInt(req.body.id));


    //get a fresh array of items and reload
    //everything else is stored in sessions
    const arrayOfItems = await Store.items(parseInt(req.session.storeID));
    // console.log("items",arrayOfItems)
        //then render main with session vars and items.
        console.log((arrayOfItems));
    res.render('main',{locals:{user:req.session.user,
        storeid:req.session.storeID,
        stores:req.session.stores,
        items:arrayOfItems,
        storeName:req.session.storeName}})


}

async function addStore (req, res) {
console.log("we are adding a store")
console.log(req.body.storename);

const newStoreID = await Store.addStore(req.body.storename);
// res.redirect('/main')
console.log("The new store from sql is ", newStoreID);

//************** */
await UserStore.addEntry(req.session.userID,parseInt(newStoreID));

///this should be a separate function b/c i call it in delete store an in index.js too....
let userStores = await User.allStoresByUser(parseInt(req.session.userID));

// let userStores = await req.session.userObject.allStores();  //get a list of stores
console.log("The userStores after adding are: ", userStores);

//i have no idea why it comes back as undefined here but an empty array in login.js
//but the HTML rendering can't handle undefined.
//it does fine with an empty array
if (userStores === undefined) {
    userStores = [];
}

//and resave the stores in session because it has changed
req.session.stores = userStores;
req.session.storeID = null;  //current store id
req.session.storeName =  null;  //current store name

console.log("Saving session variables");
req.session.save( () => {

    // res.render('main',{locals:{user:req.session.user,storeName:null,stores:userStores,items:[{item:"create New Item"}]}});
    res.render('main',{locals:{user:req.session.user,
        storeid:null,
        storeName:null,
        stores:userStores,
        items:[]}});
})





}

async function addItem (req, res) {
console.log("now to add an item");
console.log(req.body.itemname);
console.log("the store id is ", req.params.storeID);


//remove any html scripting from user input:
const theComments = escapeHtml(req.body.comments);
const theItem = escapeHtml(req.body.itemname);

// await Item.addItem(parseInt(req.params.storeID),req.body.itemname,req.body.quantity,req.body.comments);
// await Item.addItem(req.body.itemname, parseInt(req.body.quantity), req.body.comments, parseInt(req.params.storeID))
await Item.addItem(theItem, parseInt(req.body.quantity), theComments, parseInt(req.params.storeID))
    // parseInt(req.params.storeID),req.body.itemname,req.body.quantity,req.body.comments);
    
    const arrayOfItems = await Store.items(parseInt(req.session.storeID));

    res.render('main',{locals:{user:req.session.user,
                    storeid:req.session.storeID,
                    stores:req.session.stores,
                    items:arrayOfItems,
                    storeName:req.session.storeName}})

}


module.exports = { getScores,
    getURLArray,
    addScore,
    addPhoto,
    loadMainPage,
deleteAStore,
deleteAnItem,
addStore,
addItem};


