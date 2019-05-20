
const db = require('./conn');  //requre the conn.js file
const bcrypt = require('bcryptjs');
const Store = require('./stores');
const UserStore = require('./users-stores');

//this will have all the fields as parameters
//static means all instance of the class have this function
class Item {
    constructor (id, storeName,item,quantity,comments,checked ) {
        this.id = id;
        this.storeName = storeName;   
        this.item = item;
        this.quantity = quantity;
        this.comments = comments;
        this.checked = checked;
       
    } 


    static getById(id) {
        //db.ANY always returns an array
        // return db.any(`SELECT * FROM users WHERE id=${id}`);  //returns array w/ object
        //instead use db.ONE when you are returning ONE thing
        return db.one(`SELECT * FROM stores WHERE id=${id}`)  //returns an object
            .then((storeData)=> {
                // console.log(userData);
                        //this NEW calls the CONSTRUCTOR
                const storeInstance = new Store (storeData.id, storeData.store_name);    
                // console.log storeData.id);
                // console.log storeInstance);
                return storeInstance;    
            })
            .catch((error) => {
                return null;  //signal an invalid value
            });
    }





    //no 'static' since this is an instance method.  it belongs to the instance, not the class
    save() {
        //db.result - gives you the number of rows affected
        return db.result(`UPDATE users SET 
                    first_name = '${this.firstName}',
                    last_name = '${this.lastName}',
                    email ='${this.email}',
                    password = '${this.password}'
                     where id = ${this.id}`);
    }
    /* this shouldn't be here
    static insertUser (firstName, lastName, email, password) {
        return db.result(`insert into users
        (first_name, last_name, email, password)
        values  ($1, $2, $3, $4)`, [firstName, lastName, email, password])
    }*/

    static deleteByStoreID(id) {
        return db.result(`DELETE from items WHERE store_id = $1`,[id])
    }

    static addItem(name,quantity,comments,storeId) {
        return db.result(`INSERT into items (store_id, item, quantity,comments) values ($1, $2, $3, $4)`, [storeId, name, quantity,comments]);
        //then they need to refresh the page
    }
    static deleteItem (id) {
        return db.result(`DELETE from items WHERE id=$1`,[id]);
    }

}





module.exports = Item;
