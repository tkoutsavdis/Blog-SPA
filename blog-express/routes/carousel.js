// require express and router 
const express = require("express");
const Router = express.Router();
const multer = require('multer');
const fs = require('fs');
const pool = require("../db");

const authenticateToken = require('../middlewares/authenticateToken');

const upload = multer({
    dest: 'uploads/',
});

const APIurl = 'http://localhost:3000/carousel/images/';

Router.get("/carouselImages", async (req, res) => {

    try {
        const query = `
        SELECT id, position 
        FROM carousel
        ORDER BY position ASC;
        `;
        const { rows } = await pool.query(query);
        

        const images = rows.map(row => ({
        position: row.position,
        imageUrl: `${APIurl}${row.id}`
        }));

        res.status(200).json(images);
    } catch (error) {
        console.error('Error fetching carousel images:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

Router.get("/images/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const query = `
            SELECT image_data 
            FROM carousel
            WHERE id = $1;
        `;

        const { rows } = await pool.query(query, [id]);

        if (rows.length > 0) {

            const image = rows[0].image_data;
            res.set('Content-Type', 'image/jpeg');
            res.send(image);
        } else {
            res.status(404).send('Image not found');
        }
    } catch (error) {
        console.error('Error fetching carousel image:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


Router.put("/updateCarousel", authenticateToken, upload.array('files'), async (req,res) =>{

    const client = await pool.connect();

    try{
        
        const files = req.files;

        // start ...
        await client.query('BEGIN');

        // check if the files length is 4 
        if (!files || files.length !== 4) {
            throw {
                httpStatus: 400,
                message: `Πρέπει να επιλέξετε ακριβώς 4 φωτογραφίες.`
            };
        }

        // Delete the existing images 
        const deleteImagesQuery =`
            TRUNCATE TABLE carousel RESTART IDENTITY;
        `;

        // execute delete images query 
        await client.query(deleteImagesQuery);

        // store the new photos 
        let i = 0;

        for(const file of files){
            i = i+1;
            
            const imageData = fs.readFileSync(file.path);
            
            const insertImagesQuery =`
                INSERT INTO carousel (image_data,position)
                VALUES ($1,$2);
            `;

            await client.query(insertImagesQuery,[imageData,i]);

            // delete from uploads file
            fs.unlink(file.path, (err) => {
                if (err) console.error('Error deleting temp file:', err);
            });
        }

        await client.query('COMMIT');

        return res.status(201).json({ message: `Οι φωτογραφίες αποθηκεύτηκαν επιτυχώς.` });

    }catch(error){
        await client.query('ROLLBACK');

        let status = 500;
        let msg = 'Internal Server Error';

        if (error.httpStatus) {
            status = error.httpStatus;
            msg = error.message;
        }else if (error.message) {
            msg = error.message;
        }

        res.status(status).json({error:msg});
    }finally {
        client.release();
    }
});

module.exports = Router;