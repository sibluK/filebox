import express from 'express';
import generateUploadURL from './s3.js';
import cors from 'cors'
import pkg from 'pg';


// App config
const app = express();

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173',
    methods: 'GET,POST,PUT', 
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

app.get('/users/:id/files', async (req, res) => {

    var user_id = req.params.id;

    try {
        const { rows } = await pool.query(`SELECT * FROM user_files WHERE user_id = ${user_id}`)
        res.json(rows);
    } catch (error) {
        console.log("Failed to fetch user files");
        res.status(500).json({ error: 'Interal Server Error'})
    }
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});