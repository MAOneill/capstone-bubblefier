const chai = require('chai');
const expect = chai.expect;  //grab this specific function
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised).should();
//import the user model
const User = require("../models/users");
const ToDo = require("../models/todo");
//encryption and colour modules
const bcrypt = require('bcryptjs');
const colour = require('colour');

// a very basic test to make sure you set the test file up correctly

describe('Sanity check', function () {
    it ('should be 2', function () {
        // assert.equal(2, 1+1);
        expect(1+1).to.equal(2);
    });
})



describe ('Users model', () => {
    //😃 happy path
    it('should be able to retrieve by id', async () => {
        const theUser = await User.getById(3);
        // console.log("does this work)")
        // theUser.should.be.an.instanceOf(User);  //wrong syntax??
        expect(theUser).to.be.an.instanceOf(User);
        // expect(theUser).should.have.length(1);  //this works, but it won't work now because we have an object not array
    })
    // ☹️unhappy path
    it('should error if there is no user for that id', async () => {
        const theUser = await User.getById(-9);
        expect(theUser).to.be.null;
    });
    it('should encrypt the password', async () => {
        //get user with id 1
        //set their password field to "bacon" (and encrypt it)
        //compare their password to 'bacon' - it should be false
        const theUser = await User.getById(4);
            theUser.setPassword("bacon");
                console.log(theUser.password);
                expect(theUser.password).not.to.equal("bacon");  //the original equals 'password1'
        //save the password in db
        console.log("CHECKING PASSWORDS WITH direct bcrypt in test.js".underline.red);
        await theUser.save();
            const sameUser = await User.getById(4);
                expect(bcrypt.compareSync("bacon", sameUser.password)).is.true;  
                expect(bcrypt.compareSync("tofu",sameUser.password)).is.false;
        //or use the User.checkPassword() method
        console.log("CHECKING PASSWORDS WITH CHECKPASSWORD METHOD".rainbow);
            expect(sameUser.checkPassword("bacon")).is.true;
            expect(sameUser.checkPassword("eggs")).is.false;
        });
                it('should update the user', async () => {
                    //grab user with id 2
                    //update the email to 
                    //save the user
                    //re grab the user
                    //expect the email to be equal to the new value
                    const theUser = await User.getById(2);
                    theUser.email = 'new@new.com';
                    await theUser.save()
                        const alsoTheUser = await User.getById(2);
                        expect(alsoTheUser.email).to.equal('new@new.com');
                });
                it ('should not have the same email after updating', async() => {
                    const theUser  = await User.getById(4);
                        const oldEmail = theUser.email;
                        //note this will fail if you run it too soon after the last time
                            const theNewEmail = `new${new Date().getMilliseconds()}@email.com`;
                                theUser.email = theNewEmail;
                                await theUser.save();
                                //regrabe the user
                                const alsoTheUser = await User.getById(4);
                                    //expect he email not ot be euql ot new value
                                    expect(alsoTheUser.email).not.be.to.equal(oldEmail);
                                    expect(alsoTheUser.email).to.equal(theNewEmail);
                
                });
                it ('should create an array of toDo instances for a user', async() => {
                    const theUser = await User.getById(1);
                        const userToDos = await theUser.toDos;
                            expect(userToDos).to.be.instanceOf(Array);
                })
});

describe ('Todo table checks', () => {
    //get all todos
    it('should grab all todos for an id', async () => {
        const userToDos = await ToDo.getAllToDoForUser(6);
        // console.log(userToDos);
        expect(userToDos).to.be.lengthOf(1);
    });
    it('should retrieve one todo item', async () => {
        const aToDo = await ToDo.getById(3);
            expect(aToDo).to.be.an.instanceOf(ToDo);
    })
    it('should update to do with complete' , async () => {
        //make an todo item as done
        //check that it worked
        
        const aToDo = await ToDo.getById(3);
            console.log("The todo should be FALSE:".red, aToDo.complete);
            expect(aToDo.complete).is.false;

        await aToDo.markAsDone();
        
        const sameToDo = await ToDo.getById(3);
        console.log("The todo should be TRUE:".red, sameToDo.complete);
        expect(sameToDo.complete).is.true;

        console.log("hello".blue);
        await sameToDo.markAsUnDone();  //to set it back
        console.log("The todo should be FALSE:".red, sameToDo.complete);
    })
})
