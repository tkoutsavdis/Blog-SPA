// require express and router 
const express = require("express");
const Router = express.Router();
const multer = require('multer');
const fs = require('fs');
const pool = require("../db");

// use authenticateToken function to authnticate token
const authenticateToken = require('../middlewares/authenticateToken');

const APIurl = `http://localhost:3000/publications/images/`;

const upload = multer({
    dest: 'uploads/',
});

/*
    ***************** GET APIS *****************
    1) GET images for speciffic publication

    2) GET the 4 more recent announcements or actions (for landing page)

    3) GET the number of the publications by type
    4) GET actions/announcements list/page order by date
    
    5) Get publication information + all images by id

    // admin page

    6) GET ALL the titles by type
    7) Get publication information + all images by title
    
    
*/

// 1) GET images for speciffic publication
Router.get('/images/:id/:position?', async (req, res) => {

    const { id, position } = req.params;
    const imagePosition = position || 1;

    try {
        
        const imagesQuery = `
            SELECT image_data FROM publication_images
            WHERE publication_id = $1 AND position = $2
            ORDER BY position ASC;
        `;

      const getImages = await pool.query(imagesQuery, [id,imagePosition]);
  
      if (getImages.rows.length > 0) {

        const image = getImages.rows[0].image_data;
        res.set('Content-Type', 'image/jpeg');
        res.send(image);

      } else {
        res.status(404).send('Images not found');
      }
    } catch (ex) {
      console.error('ERROR', ex);
      res.status(500).send('Internal Server Error');
    }
});

// 2) GET the 4 more recent announcements or actions (for landing page)
Router.get('/getRecentPublications', async (req,res) => {

    try{    
        const {type} = req.query;

        if(!type){
            throw{
                httpStatus:400,
                message:`Όλα τα πεδία πρέπει να είναι συμπλερωμένα.`
            }
        }

        if(type != 'action' && type != 'announcement'){
            throw{
                httpStatus:404,
                message:`Λάθος τύπος δημοσίευσης.`
            }
        }

        const recentPublicationsQuery = `
            SELECT
                id,
                title,
                content,
                type,
                upload_date
            FROM publications
            WHERE type = $1
            order by upload_date DESC
            limit 4
        `;

        const getRecentPublications = await pool.query(recentPublicationsQuery,[type]);

        const recentPublications = getRecentPublications.rows.map((row) => ({
            id: row.id,
            title:row.title,
            type: row.type,
            content:row.content,
            dateAndTime: row.upload_date,
            imageUrl:`${APIurl}${row.id}/1`
        }));

        return res.status(200).json(recentPublications);

    }catch(error){
        let status = 500;
        let msg = 'Internal Server Error';

        if (error.httpStatus) {
            status = error.httpStatus;
            msg = error.message;
        } else if (error.message) {
            msg = error.message;
        }
        res.status(status).json({ error: msg });
    }

});


// 3) GET the number of the publications by type
Router.get('/getNumberOfPublications', async (req,res)=>{

    try{
        const {type} = req.query;

        if(!type){
            throw{
                httpStatus:400,
                message:`Όλα τα πεδία πρέπει να είναι συμπλερωμένα.`
            }
        }

        if(type != 'action' && type != 'announcement'){
            throw{
                httpStatus:404,
                message:`Λάθος τύπος δημοσίευσης.`
            }
        }

        const countQuery = `
            SELECT COUNT(*) as publicationsnumber FROM publications
            WHERE type = $1;
        `;

        const getCounter = await pool.query(countQuery,[type]);

        const counter = getCounter.rows[0];
        
        return res.status(200).send(counter);

    }catch (error){ 
        let status = 500;
        let msg = 'Internal Server Error';

        if (error.httpStatus) {
            status = error.httpStatus;
            msg = error.message;
        } else if (error.message) {
            msg = error.message;
        }

        res.status(status).json({ error: msg });

    }
});


// 4) GET actions/announcements list/page order by date
Router.get('/getPublicationsList', async (req,res)=>{

    try{
        const {type,page} = req.query;
        
        const pageNumber = parseInt(page, 10);
        const offset = (pageNumber - 1) * 10;

        if(!type){
            throw{
                httpStatus:400,
                message:`Όλα τα πεδία πρέπει να είναι συμπλερωμένα.`
            }
        }

        if(type != 'action' && type != 'announcement'){
            throw{
                httpStatus:404,
                message:`Λάθος τύπος δημοσίευσης.`
            }
        }

        const publicationListQuery = `
            SELECT
                id,
                title,
                content,
                type,
                upload_date
            FROM publications
            WHERE type = $1
            ORDER BY upload_date DESC
            LIMIT 10 OFFSET $2;
        `;

        const getPublicationList = await pool.query(publicationListQuery,[type,offset]);
        
        const publicationList = getPublicationList.rows.map((row) => ({
            id: row.id,
            title:row.title,
            type: row.type,
            content:row.content,
            dateAndTime: row.upload_date,
            imageUrl:`${APIurl}${row.id}/1`
        }));

        return res.status(200).json(publicationList);

    }catch (error){
        let status = 500;
        let msg = 'Internal Server Error';

        if (error.httpStatus) {
            status = error.httpStatus;
            msg = error.message;
        } else if (error.message) {
            msg = error.message;
        }

        res.status(status).json({ error: msg });
    }   
});


// 5) Get publication information + all images by id
Router.get('/getPublicationById', async (req,res) => {
    const { id } = req.query;

    try{
        
        if(!id){
            throw{
                httpStatus: 400,
                message: `Όλα τα πεδία ειναι απαραίτητα.`
            }
        }

        const publicationQuery = `
            SELECT
                id,
                title,
                content,
                type,
                upload_date
            FROM publications
            WHERE id = $1;
        `;

        const getPublication = await pool.query(publicationQuery,[id]);

        if (getPublication.rows.length === 0) {
            throw{
                httpStatus: 404,
                message: `Η Δημοσιευση δεν βρέθηκε.`
            }
        }
        
        const row = getPublication.rows[0];

        const imagesQuery = `
            SELECT position FROM publication_images
            WHERE publication_id = $1
            ORDER BY position ASC;
        `;

        const imagesResult = await pool.query(imagesQuery, [id]);

        const imageUrl = imagesResult.rows.map(imageRow => {
            const position = imageRow.position;
            return `${APIurl}${id}/${position}`;
          });

        const finalPublication = {
            id: row.id,
            title: row.title,
            content: row.content,
            type:row.type,
            dateAndTime: row.upload_date,
            images: imageUrl
        };

        res.status(200).json(finalPublication);

    }catch(error){
        let status = 500;
        let msg = 'Internal Server Error';

        if (error.httpStatus) {
            status = error.httpStatus;
            msg = error.message;
        } else if (error.message) {
            msg = error.message;
        }

        res.status(status).json({ error: msg });
    }
});


// 6) get all the titles
Router.get('/getTitlesByType', async (req,res) => {

    try{
        const {type} = req.query;

        if(!type){
            throw{
                httpStatus:400,
                message:`Όλα τα πεδία πρέπει να είναι συμπλερωμένα.`
            }
        }

        if(type != 'action' && type != 'announcement'){
            throw{
                httpStatus:404,
                message:`Λάθος τύπος δημοσίευσης.`
            }
        }

        const getTitlesQuery = `
            SELECT title FROM publications
            WHERE type = $1
            ORDER BY title ASC;
        `;

        const getTitles = await pool.query(getTitlesQuery,[type]);

        const titles = getTitles.rows;

        return res.status(200).json(titles);
    }catch(error){
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 7) Get publication information + all images by title
Router.get('/getPublicationByTitle', async (req,res) => {
    const { title } = req.query;

    try{
        
        if(!title){
            throw{
                httpStatus: 400,
                message: `Όλα τα πεδία ειναι απαραίτητα.`
            }
        }

        const publicationQuery = `
            SELECT
                id,
                title,
                content,
                type,
                upload_date
            FROM publications
            WHERE title = $1;
        `;

        const getPublication = await pool.query(publicationQuery,[title]);

        if (getPublication.rows.length === 0) {
            throw{
                httpStatus: 404,
                message: `Η Δημοσιευση δεν βρέθηκε.`
            }
        }
        
        const row = getPublication.rows[0];
        const publicationId = row.id;

        const imagesQuery = `
            SELECT position FROM publication_images
            WHERE publication_id = $1
            ORDER BY position ASC;
        `;

        const imagesResult = await pool.query(imagesQuery, [publicationId]);

        const imageUrl = imagesResult.rows.map(imageRow => {
            const position = imageRow.position;
            return `${APIurl}${publicationId}/${position}`;
          });

        const finalPublication = {
            id: row.id,
            title: row.title,
            content: row.content,
            type:row.type,
            dateAndTime: row.upload_date,
            images: imageUrl
        };

        res.status(200).json(finalPublication);

    }catch(error){
        let status = 500;
        let msg = 'Internal Server Error';

        if (error.httpStatus) {
            status = error.httpStatus;
            msg = error.message;
        } else if (error.message) {
            msg = error.message;
        }

        res.status(status).json({ error: msg });
    }
});

/*
    ***************** POST/DELETE/UPDATE APIS *****************
    1) POST new publication
    2) DELETE existing publication
    3) UPDATE existing publication
*/

Router.post("/insertPublication", authenticateToken, upload.array('files'), async (req,res) => {
    
    const client = await pool.connect(); 

    try{

        const {type,title,content,dateAndTime} = req.body;
        const trimmedTitle = title.trim();
        const files = req.files;
        
        await client.query('BEGIN');

        if(!type || !trimmedTitle || !content || !dateAndTime){
            throw{
                httpStatus: 400,
                message:`Όλα τα πεδία πρέπει να είναι συμπληρωμένα.`
            }
        }

        if(type != 'action' && type != 'announcement'){
            throw{
                httpStatus:404,
                message:`Λάθος τύπος δημοσίευσης.`
            }
        }

        const insertQuery = `
            INSERT INTO publications (type,title,content,upload_date)
            VALUES ($1,$2,$3,$4) RETURNING id;
        `;

        const insertResult = await client.query(insertQuery,[type, trimmedTitle, content, dateAndTime]);
        const publicationId = insertResult.rows[0].id;

        let i=0;
        for(const file of files){
            i=i+1;
            const imageData=fs.readFileSync(file.path);

            const insertPhotoSql=`
                INSERT INTO publication_images(publication_id,position,image_data) 
                VALUES ($1,$2,$3);
            `;

            await client.query(insertPhotoSql,[publicationId,i,imageData]);

            // remove image from the uploads folder
            fs.unlink(file.path, (err) => {
                if (err) console.error('Error deleting temp file:', err);
            });
        }

        await client.query('COMMIT');

        return res.status(201).json({ message: `Η δημοσιευση αποθηκεύτηκε επιτυχώς.` });
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

Router.put("/updatePublication", authenticateToken, upload.array('files'), async (req,res) =>{

    const client = await pool.connect();

    try{
        const {id,type,title,content,dateAndTime} = req.body;
        const trimmedTitle = title.trim();
        const files = req.files;

        // start ...
        await client.query('BEGIN');

        // check the data

        if(!id || !type || !trimmedTitle || !content || !dateAndTime){
            throw{
                httpStatus: 400,
                message: `Όλα τα πεδία είναι υποχρεωτικά`
            }
        }

        if(type != 'action' && type != 'announcement'){
            throw{
                httpStatus:404,
                message:`Λάθος τύπος δημοσίευσης.`
            }
        }

        // logic to update info to the publications table

        const updateQuery = `
            UPDATE publications
            SET type = $1, title = $2, content = $3, upload_date = $4
            WHERE id = $5
        `;

        // execute the update query
        await client.query(updateQuery,[type,trimmedTitle,content,dateAndTime,id]);

        //update images to publication_images table
        // logic --> delete all then post the new ones 

        const deleteImagesQuery =`
            DELETE FROM publication_images
            WHERE publication_id = $1;
        `;

        // execute delete images query 
        await client.query(deleteImagesQuery,[id]);

        // store the new photos 
        let i = 0;

        for(const file of files){
            i = i+1;
            
            const imageData = fs.readFileSync(file.path);
            
            const insertImagesQuery =`
                INSERT INTO publication_images (publication_id,position,image_data)
                VALUES ($1,$2,$3);
            `;

            await client.query(insertImagesQuery,[id,i,imageData]);

            fs.unlink(file.path, (err) => {
                if (err) console.error('Error deleting temp file:', err);
            });
        }

        await client.query('COMMIT');

        return res.status(201).json({ message: `Η δημοσιευση αποθηκεύτηκε επιτυχώς.` });

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


Router.delete("/deletePublication", authenticateToken, async (req,res, next) => {

    const client = await pool.connect();

    try{

        const { id } = req.query;

        await client.query('BEGIN');

        if (!id) {
            throw{
                httpStatus: 400,
                message: `Όλα τα πεδία είναι υποχρεωτικά`
            }
        }

        const deleteImagesQuery = `
            DELETE FROM publication_images 
            WHERE publication_id = $1;
        `;

        const deleteImages = await client.query(deleteImagesQuery,[id]);
        if (deleteImages.rowCount === 0) {
            throw {
                httpStatus: 404,
                message: `Δεν βρέθηκαν φωτογραφίες προς διαγραφή για τη δημοσίευση.`
            };
        }

        const deletePublicationQuery = `
            DELETE FROM publications 
            WHERE id = $1;
        `;

        const deletePublication = await client.query(deletePublicationQuery,[id]);

        if (deletePublication.rowCount === 0) {
            throw{
                httpStatus:404,
                message: `Η δημοσίευση δεν μπόρεσε να διαφραφεί.`
            }
        }

        await client.query('COMMIT');

        return res.status(200).json({ message: `Η δημοσίευση διαγράφτηκε επιτυχώς.` });
      
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