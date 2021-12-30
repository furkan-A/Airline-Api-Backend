const express = require("express");
const mysql = require("mysql");
const bodyParser =require("body-parser");
const _ = require("underscore");

require("dotenv").config();

const PORT = process.env.PORT || 3001;

const app = express();

// required middleware for receive and send json info
app.use(bodyParser.json());

// mysql connection settings
const connection = mysql.createConnection({    
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME
})

connection.connect();

// show all customers
app.get("/api/customer", (req, res) => {
    connection.query("SELECT * FROM customer",(err, result, fields) => {
        if (err) return err;
        return res.status(200).send(result)
    })
});

// show a customer information with their passport number
app.get("/api/customer/:passport_number", (req, res) => {
    connection.query(`SELECT * FROM customer WHERE passport_number = ${connection.escape(req.params.passport_number)}`,
        (err, result, fields) => {
        if (err) return err;
        return res.status(200).send(result);
    })
});

// show customer's ffc account 
app.get("/api/ffc", (req, res) => {
    connection.query("SELECT * FROM ffc",(err, result, fields) => {
        if (err) return err;
        return res.status(200).send(result);
    });
});

// show a customer's ffc information with their passport number
app.get("/api/ffc/:Customer_passport_number", (req, res) => {
    connection.query(`SELECT * FROM ffc WHERE Customer_passport_number = ${connection.escape(req.params.Customer_passport_number)}`,
        (err, result, fields) => {
        if (err) return err;
        return res.status(200).send(result);
    });
});

// show customer segmentation with status type
app.get("/api/ffc/segment/:statusType", (req, res) => {

    var statu = connection.escape(req.params.statusType);
    let queryy = `SELECT * FROM ffc WHERE statusType = ${statu}`;

    connection.query(queryy,  (err, result, fields) => {
        if (err) return err;
        return res.status(200).send(result);
    });
});


// add a new customer to the airline database
app.post("/api/customer", (req, res) => {

    let sqlQuery = `INSERT INTO customer (passport_number, name, phone, mail, address, country, password)
                    VALUES (?, ?, ?, ?, ?, ?, ?)`;
   
    let body  = _.pick(req.body, "passport_number",
                                 "name",
                                 "phone",
                                 "mail",
                                 "address",
                                 "country",
                                 "password");

    const customerData = [
        body.passport_number,
        body.name ,
        body.phone ,
        body.mail,
        body.address,
        body.country,
        body.password
    ];

    connection.query(sqlQuery, customerData, (err, result, fields) => {
        if (err) return err;
        return res.send("The customer added to database successfully.")
    })
 
});


// update customer information
app.put("/api/customer/:passport_number", (req, res) => {  

    var pasaport = connection.escape(req.params.passport_number);

    let body  = _.pick(req.body, "name",
                                 "phone",
                                 "mail",
                                 "address",
                                 "country",
                                 "password");

    let sqlQuery2 = `UPDATE customer SET name = ?, phone = ?, mail = ?, address = ?, country = ?, password = ? WHERE passport_number = ${pasaport};`;

    const customerData2 = [
        body.name ,
        body.phone ,
        body.mail,
        body.address,
        body.country,
        body.password
    ];

    connection.query(sqlQuery2, customerData2, (err, result, fields) => {
        if (err) return err;
        return res.status(200).send(`Customer ${pasaport} has been updated.`)
    })

});


// delete a customer
app.delete("/api/customer/:passport_number", (req, res) => {

    var pasaport = connection.escape(req.params.passport_number);
    let sqlQuery3 = `DELETE FROM customer WHERE (passport_number = ${pasaport});`;

    connection.query(sqlQuery3, (err, result, fields) => {
        if (err) return err;
        return res.status(200).send(`Customer ${pasaport} has been deleted.`)
    });

});


app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});


