const sqlite3 = require('sqlite3').verbose()
// var md5 = require('md5')

const DBSOURCE = "db.sqlite" 


let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQlite database.')
        db.run(`CREATE TABLE item (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text UNIQUE, 
            amount text,
            CONSTRAINT name_unique UNIQUE (name) 
            )`,(err) => {
        if (err) {
            console.log("err")
            // Table already created
        }else{
            // Table just created, creating some rows
            const insert = 'INSERT INTO item (name, amount) VALUES (?,?)'
            console.log("Table created")
            db.run(insert, ["Apples", "10"])
            db.run(insert, ["Oranges", "5"])
        }
    })  
    }
})


module.exports = db

