// require express and router 
const express = require("express");
const Router = express.Router();

// require bcrypt for hash the passwords 
const bcrypt = require('bcrypt');

// add salt rounds to delay login 
const saltRounds = 10;

// require postgress 
const pool = require("../db");

// api to run bcrypt 
Router.post('/',async (req, res) => {
    const { username,password} = req.body;

    try{
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password,salt);

        const queryText = `
            INSERT INTO users (username, password)
            VALUES ($1, $2) RETURNING id;
        `;

        const result = await pool.query(queryText, [username,hashedPassword]);

        res.status(201).json({
            message: "User created successfully",
            userId: result.rows[0].id
        });

    }catch(error){
        console.log(error);
        res.status(500).send(error);
    }
});

module.exports = Router;