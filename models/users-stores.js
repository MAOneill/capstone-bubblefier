const db = require('./conn');  //requre the conn.js file
const bcrypt = require('bcryptjs');
const Store = require('./stores');
const Item = require('./items');

//this will have all the fields as parameters
//static means all instance of the class have this function
class UserStore {
    constructor (userId, storeId) {
        this.userID = userId;
        this.storeId = storeId;   }
        
    static deleteAllStoreID(id) {
        db.result(`DELETE  from user_stores WHERE store_id = $1`, [id])
        .catch((error) => {
            console.error(error);
        });
        console.log("Delte from user stores happens********");
    }
    static addStoreToUser(user,store) {
        db.result(`INSERT into user_stores (user_id, store_id) values ($1,$2)`, [user,store])
    }
    
    static addEntry(userid, storeid) {
         db.result(`INSERT into user_stores (user_id, store_id) values ($1,$2)`,[userid, storeid]);
        //add the user-store entry in the user-stores table - this goes in th4e user-stores.js
    
    }
}
    module.exports = UserStore;
