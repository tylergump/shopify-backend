const express = require("express")
const app = express()
const db = require("./database.js")
// var md5 = require("md5")

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const HTTP_PORT = 3000

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});

app.get("/api/items", (req, res, next) => {
    const sql = "select * from item"
    const params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});


app.get("/api/item/:id", (req, res, next) => {
    const sql = "select * from item where id = ?"
    const params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
      });
});


app.post("/api/item/", (req, res, next) => {
    const errors=[]
    if (!req.body.name){
        errors.push("No item name specified");
    }
    if (!req.body.amount){
        errors.push("No item amount specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    const data = {
        name: req.body.name,
        amount: req.body.amount,
    }
    const sql ='INSERT INTO item (name, amount) VALUES (?,?)'
    const params =[data.name, data.amount]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})



app.patch("/api/item/:id", (req, res, next) => {
    const data = {
        name: req.body.name,
        amount: req.body.amount,
    }
    db.run(
        `UPDATE item set 
           name = coalesce(?,name), 
           amount = COALESCE(?,amount), 
           WHERE id = ?`,
        [data.name, data.amount, req.params.id],
        (err, result) => {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({
                message: "success",
                data: data
            })
    });
})


app.delete("/api/item/:id", (req, res, next) => {
    db.run(
        'DELETE FROM item WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", rows: this.changes})
    });
})


// Root path
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});

