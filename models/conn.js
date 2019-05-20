//first require pg-promise can call it immediately which gives us a configured database connector
// const pgp = require('pg-promise')();


        //this willl allow you to see the sql log
        const pgp = require('pg-promise')({
            query: e => {
              console.log('QUERY: ', e.query);
            }  
          });
        
        /*
        const options = {
            host: 'localhost',
            database: 'grocery-app'
        
        };
        */
       const options = {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME
      
      };
      
        
        const db = pgp(options);
        
        module.exports = db;
        
        