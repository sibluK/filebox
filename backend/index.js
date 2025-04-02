import express from 'express';
import { generateUploadURL, deleteFileFromS3 } from './s3.js';
import cors from 'cors'
import pkg from 'pg';

// App config
const app = express();

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173',
    methods: 'GET,POST,PUT,DELETE', 
    allowedHeaders: 'Content-Type'
}));

const { Pool } = pkg;
const pool = new Pool({ connectionString: process.env.NEON_POSTGRESQL_DB_STRING });

// Endpoints
app.get('/generate-url', async (req, res) => {
    try {
        const url = await generateUploadURL();
        res.send({ url });
    } catch (error) {
        res.status(500).send({ error: 'Failed to generate upload URL' });
    }
});

    // For getting user individual files  
app.get('/users/:id/files', async (req, res) => {

    var user_id = req.params.id;

    try {
        const { rows } = await pool.query('SELECT * FROM user_files WHERE user_id = $1', [user_id]);
        res.json(rows);
    } catch (error) {
        console.log("Failed to fetch user files");
        res.status(500).json({ error: 'Interal Server Error'})
    }
})

    // For uploading information to the Neon postgresql database
app.post('/users/files', async (req, res) => {

    const { user_id, file_url, s3_key, name, type, size, added_at } = req.body;

    try {
        await pool.query('INSERT INTO user_files (user_id, url, type, size, added_at, s3_key, name) VALUES ($1, $2, $3, $4, $5, $6, $7)', [user_id, file_url, type, size, added_at, s3_key, name]);
        res.status(201).json({ message: 'File URL saved successfully' });
    } catch (error) {
        console.log("Failed to insert user file");
        res.status(500).json({ error: 'Interal Server Error'})
    }
})
    // For deleting user files from the database
    // and deleting the file from the S3 bucket
app.delete('/users/files/:id', async (req, res) => {
    
    const file_id = req.params.id;
    const s3_key = req.body.s3_key;

    try {
        await pool.query('DELETE FROM user_files WHERE id = $1', [file_id]);

        // Delete from S3
        const s3Response = await deleteFileFromS3(s3_key);
        if (!s3Response) {
            console.error("Failed to delete file from S3");
            return res.status(500).json({ error: 'Failed to delete file from S3' });
        }
        
        res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
        console.log("Failed to delete user file");
        res.status(500).json({ error: 'Interal Server Error'})
    }
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});