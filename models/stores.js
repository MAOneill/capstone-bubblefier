
const db = require('./conn');  //requre the conn.js file
const bcrypt = require('bcryptjs');
const Item = require('./items');
const UserStore = require('./users-stores');

//this will have all the fields as parameters
//static means all instance of the class have this function
class Store {
    constructor (id, storeName) {
        this.id = id;
        this.storeName = storeName;   
       
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
    static insertUser (firstName, lastName, email, password) {
        return db.result(`insert into users
        (first_name, last_name, email, password)
        values  ($1, $2, $3, $4)`, [firstName, lastName, email, password])
    }

    //get all the items for a store iD
    static items(id) {
        return db.any(`SELECT I.id as id, S.id as store_id, I.item as item, I.quantity as quantity, I.comments as comments, I.checked as checked from items as I
        INNER JOIN stores as S 
        ON I.store_id = S.id
        where S.id = $1`, [id])

            


        //and transform them to review objects
            .then((arrayOfItems) => {
                //convert each array element into a Review instance
                const arrayOfItemsInstances = [];
                //manually mapping
                arrayOfItems.forEach((data) => {
                    // console.log("Data Item from SQL__________________-");
                    // console.log(data);
                    const itemsInstance = new Item (data.id,  data.store_id, data.item, data.quantity, data.comments, data.checked);
                    arrayOfItemsInstances.push(itemsInstance);
                });
                // console.log(arrayOfItemsInstances);
                if (arrayOfItems) {

                    return arrayOfItemsInstances;
                }
                else {
                    const dummy = new Item (999,999,'create list item below',"",0);
                    arrayOfItemsInstances.push(dummy);
                    return arrayOfItemsInstances;
                }
            });
            //what happens when there are NO results??
}
static addStore(name) {
    return db.result(`INSERT into stores (store_name) values ($1) returning id`, [name])
    
    .then((idOfStore) => {
        // console.log("object from sql add", idOfStore)
        console.log("the insert worked");
        //this works, don't change it
        console.log(`new store id is ${idOfStore.rows[0].id}`);
        return idOfStore.rows[0].id;
    })

    
    //we need the ID from this...
    // console.log(newStore);  

}
static deleteStore(id) {
    //this can only happen if you have deleted all items first
    //and deleted  records in the user-stores table for that STORE.
    //maybe it should only delete that users reference to the store, if others exist...but not for now
    db.result(`DELETE from stores where id=$1`,[id])
    .catch((error) => {
        console.error(error);
})
    
}


}


module.exports = Store;
