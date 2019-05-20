
const db = require('./conn');  //requre the conn.js file
const bcrypt = require('bcryptjs');
// const Store = require('./stores');
// const Item = require('./items');
// const UserStore = require('./users-stores');

//this will have all the fields as parameters
//static means all instance of the class have this function
class User {
    constructor (id, email, password) {
        this.id = id;
        this.email = email;
        this.password = password;
    } 
    static getById(id) {
        //db.ANY always returns an array
        // return db.any(`SELECT * FROM users WHERE id=${id}`);  //returns array w/ object
        //instead use db.ONE when you are returning ONE thing
        return db.one(`SELECT * FROM users WHERE id=${id}`)  //returns an object
            .then((userData)=> {
                // console.log(userData);
                        //this NEW calls the CONSTRUCTOR
                const userInstance = new User(userData.id, userData.email, userData.password);    
                // console.log(userData.id);
                // console.log(userInstance);
                return userInstance;    
            })
            .catch((error) => {
                return null;  //signal an invalid value
            });
    }

    static getByEmail(email) {
        //db.ANY always returns an array
        // return db.any(`SELECT * FROM users WHERE id=${id}`);  //returns array w/ object
        //instead use db.ONE when you are returning ONE thing
        return db.one(`SELECT * FROM users WHERE email=$1`,[email])  //returns an object
            .then((userData)=> {
                console.log(userData);
                        //this NEW calls the CONSTRUCTOR
                const userInstance = new User(userData.id, userData.email, userData.password);    
                // console.log(userData.id);
                // console.log("The type of user instance", typeof userInstance);
                return userInstance;    
                
            })
            .catch((error) => {
                return null;  //signal an invalid value
            });
    }



    //no 'static' since this is an instance method.  it belongs to the instance, not the class
    save() {
        //db.result - gives you the number of rows affected
        return db.result(`UPDATE users SET 
                    
                    email ='${this.email}',
                    password = '${this.password}'
                     where id = ${this.id}`);
    }
    static insertUser (email, password) {
        return db.result(`insert into users
        ( email, password)
        values  ($1, $2)`, [ email, password])
    }
    setPassword(password) {
        this.password = bcrypt.hashSync(password, 10);  //10 is my salt
    }
    static hashPassword(password) {
        return bcrypt.hashSync(password, 10);  //10 is my salt
    }
    checkPassword(password) {
        return bcrypt.compareSync(password,this.password);
    }
    static allUserPhotosUser(userId){
        return db.any(`SELECT photo_url from user_photo 
            where user_id = $1`,[userId])
                .then((sqlPhotos) => {
                    const arrayofPhotoURLs = [];
                    sqlPhotos.forEach((data) => {
                        arrayofPhotoURLs.push(data.photo_url);
                    })
                    return arrayofPhotoURLs;
                })
                //what happens when there are NO results??
    }
    
};






module.exports = User;
