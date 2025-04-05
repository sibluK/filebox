import express from 'express';
import { generateUploadURL, deleteFileFromS3 } from './s3.js';
import cors from 'cors'
import pkg from 'pg';
import jwt from 'jsonwebtoken';
import jwksRsa from 'jwks-rsa';

// App config
const jwksClient = jwksRsa({
    jwksUri: process.env.CLERK_JWKS_URI,
    cache: true,
    rateLimit: true
});

export async function verifyJwt(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.error("Missing or invalid Authorization header");
        return res.status(401).send('Unauthorized: Missing or invalid token');
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodedHeader = jwt.decode(token, { complete: true });

        const getKey = (header) => {
            return new Promise((resolve, reject) => {
                jwksClient.getSigningKey(header.kid, (err, key) => {
                    if (err) {
                        console.error("Error fetching signing key:", err);
                        return reject(err);
                    }
                    const signingKey = key.getPublicKey();
                    resolve(signingKey);
                });
            });
        };

        const signingKey = await getKey(decodedHeader.header);
        const decoded = jwt.verify(token, signingKey, { algorithms: ['RS256'] });

        req.user = decoded;
        next();

    } catch (error) {
        console.error('JWT verification error:', error);
        return res.status(401).send('Unauthorized: Invalid token');
    }

}

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    methods: 'GET,POST,PUT,DELETE', 
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use(express.json());

//app.use(verifyJwt);

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
app.get('/users/:id/files', verifyJwt, async (req, res) => {

    const user_id = req.params.id;

    try {
        const { rows } = await pool.query('SELECT * FROM user_files WHERE user_id = $1', [user_id]);
        res.json(rows);
    } catch (error) {
        console.log("Failed to fetch user files");
        res.status(500).json({ error: 'Interal Server Error'})
    }
})

    // For uploading information to the Neon postgresql database
app.post('/users/files', verifyJwt, async (req, res) => {

    const { user_id, file_url, s3_key, name, type, size, added_at, isPublic } = req.body;

    try {
        const created_file = await pool.query('INSERT INTO user_files (user_id, url, type, size, added_at, s3_key, name, is_public) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [user_id, file_url, type, size, added_at, s3_key, name, isPublic]);
        res.status(201).json(created_file.rows[0]);
    } catch (error) {
        console.log("Failed to insert user file");
        res.status(500).json({ error: 'Interal Server Error'})
    }
})
    // For deleting user files from the database
    // and deleting the file from the S3 bucket
app.delete('/users/files/:id', verifyJwt, async (req, res) => {
    
    const file_id = req.params.id;
    const s3_key = req.body.s3_key;

    try {
        // Delete file objects
        await pool.query('DELETE FROM user_files WHERE id = $1', [file_id]);
        
        // Delete file tags
        await pool.query('DELETE FROM file_tags WHERE file_id = $1', [file_id]);
        
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

app.get('/files', async (req, res) => {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;
    const search = req.query.search || '';
    const tag = req.query.tag || '';

    try {
        const query = `
            SELECT DISTINCT uf.id, uf.url, uf.name, uf.added_at
            FROM user_files uf
            LEFT JOIN file_tags ft ON ft.file_id = uf.id
            WHERE uf.is_public = true
              AND ($1 = '' OR LOWER(uf.name) LIKE LOWER('%' || $1 || '%'))
              AND ($2 = '' OR ft.tag_name IS NULL OR LOWER(ft.tag_name) LIKE LOWER('%' || $2 || '%'))
            ORDER BY uf.added_at DESC
            LIMIT $3 OFFSET $4;
        `;

        const { rows } = await pool.query(query, [search, tag, limit, offset]);
        res.json(rows);
    } catch (error) {
        console.error("Failed to fetch files:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/files/:id/tags', verifyJwt, async (req, res) => {
    const file_id = req.params.id;

    if(file_id === undefined) {
        return res.status(400).json({ error: 'File ID is required' }); 
    }

    try {
        const { rows } = await pool.query('SELECT * FROM file_tags WHERE file_id = $1', [file_id]);
        res.json(rows);
    } catch (error) {
        console.log("Failed to fetch file tags");
        res.status(500).json({ error: 'Interal Server Error'})
    }
});

app.get('/tags/popular', async (req, res) => {
    try {
        // Select the public tag_name and count from file_tags and user_files tables by joining them on file_id
        const { rows } = await pool.query('SELECT ft.tag_name, COUNT(*) as count FROM file_tags ft JOIN user_files uf ON ft.file_id = uf.id WHERE uf.is_public = true GROUP BY ft.tag_name LIMIT 10');
        res.json(rows);
    } catch (error) {
        console.log("Failed to fetch popular tags");
        res.status(500).json({ error: 'Interal Server Error'})
    }
});

app.post('/files/:id/tags', verifyJwt, async (req, res) => {
    const file_id = req.params.id;
    const { tags } = req.body;

    if(file_id === undefined || tags === undefined) {
        return res.status(400).json({ error: 'File ID and tags are required' }); 
    }

    try {
        const created_tags = [];
        for (const tag of tags) {
            const created_tag = await pool.query('INSERT INTO file_tags (file_id, tag_name) VALUES ($1, $2) RETURNING *', [file_id, tag])
            created_tags.push(created_tag.rows[0]);
        }
        res.status(201).json(created_tags)
    } catch (error) {
        console.log("Failed to insert file tags");
        res.status(500).json({ error: 'Interal Server Error'})
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});