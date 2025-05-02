import express from 'express';
import rateLimit from 'express-rate-limit';
import { generateUploadURL, deleteFileFromS3 } from './s3.js';
import cors from 'cors'
import pkg from 'pg';
import { clerkMiddleware, requireAuth, createClerkClient } from '@clerk/express'
import multer from 'multer';
import axios from 'axios';

const app = express();

/*
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, {
        headers: req.headers,
        body: req.body
    });
    next();
});
*/

const uploadLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
})

const clerkClient = createClerkClient({
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    apiUrl: 'https://api.clerk.dev',
    secretKey: process.env.CLERK_SECRET_KEY,
});

app.use(cors({
    origin: 'http://localhost:5173',
    methods: 'GET,POST,PUT,DELETE', 
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use(express.json());
app.use(clerkMiddleware());

const withAuth = requireAuth({
    onError: (err, req, res) => {
        res.status(401).json({ error: 'Unauthorized' });
    }
});

const { Pool } = pkg;
const pool = new Pool({ connectionString: process.env.NEON_POSTGRESQL_DB_STRING });
const upload = multer();

// Endpoints
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        const user_id = req.auth.userId;
        const isPublic = req.body.isPublic === 'true';

        const uploadURL = await generateUploadURL();

        const s3response = await axios.put(uploadURL, file.buffer, {
            headers: {
                'Content-Type': file.mimetype,
            },
        }); 

        if (s3response.status == 200) {
            const file_url = uploadURL.split('?')[0];
            const s3_key = file_url.split('/').pop();

            const created_file = await pool.query(
                'INSERT INTO user_files (user_id, url, s3_key, name, type, size, is_public, added_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *',
                [user_id, file_url, s3_key, file.originalname, file.mimetype, file.size, isPublic]
            );

            res.status(201).json(created_file.rows[0]);
        }
    } catch (error) {
        console.error("Failed to upload file:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// For getting public info about any user
app.get("/users/:id/info", async (req, res) => {
    const user_id = req.params.id;

    try {
        const user = await clerkClient.users.getUser(user_id);

        const publicInfo = {
            name: `${user.firstName} ${user.lastName}`,
            profileImageUrl: user.imageUrl,
        };

        res.status(200).json(publicInfo);
    } catch (error) {
        console.error("Failed to fetch user info:", error);
        res.status(500).json({ error: "Failed to fetch user info" });
    }
});

// For getting user individual files  
app.get('/users/:id/files', withAuth, async (req, res) => {

    const user_id = req.params.id;

    try {
        const auth_user_id = req.auth.userId;

        if (!auth_user_id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (user_id !== auth_user_id) {
            return res.status(403).json({ error: 'You are not authorized to access this user\'s files' });
        }

        const { rows } = await pool.query('SELECT * FROM user_files WHERE user_id = $1', [user_id]);
        res.json(rows);
    } catch (error) {
        console.log("Failed to fetch user files");
        res.status(500).json({ error: 'Interal Server Error'})
    }
});

// For uploading information to the Neon postgresql database
app.post('/users/files', withAuth, async (req, res) => {

    const { user_id, file_url, s3_key, name, type, size, added_at, isPublic } = req.body;

    try {
        const created_file = await pool.query('INSERT INTO user_files (user_id, url, type, size, added_at, s3_key, name, is_public) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [user_id, file_url, type, size, added_at, s3_key, name, isPublic]);
        res.status(201).json(created_file.rows[0]);
    } catch (error) {
        console.log("Failed to insert user file");
        res.status(500).json({ error: 'Interal Server Error'})
    }
});

// For updating the name or visibility status
app.put('/users/files/:id', withAuth, async (req, res) => {
    const file_id = req.params.id;
    const { name, is_public } = req.body;

    if (!name || typeof is_public === 'undefined') {
        return res.status(400).json({ error: 'Name and is_public status are required' });
    }

    try {
        const updatedFile = await pool.query('UPDATE user_files SET name = $1, is_public = $2 WHERE id = $3', [name, is_public, file_id])
        
        if (updatedFile.rowCount === 0) {
            return res.status(404).json({ error: 'File not found' });
        }

        res.status(200).json(updatedFile.rows[0]);
    } catch (error) {
        console.error("Failed to update file:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// For incrementing file download number
app.post('/files/downloads/:id', async (req, res) => {
    const file_id = req.params.id;

    try {
        const response = await pool.query('SELECT downloads FROM user_files WHERE id = $1', [file_id]);

        if (response.rows.length === 0) {
            return res.status(404).json({ error: "File not found" });
        }

        const numberOfDownloads = BigInt(response.rows[0].downloads || 0);

        await pool.query('UPDATE user_files SET downloads = $1 WHERE id = $2', [numberOfDownloads + BigInt(1), file_id]);

        res.status(200).json({ message: 'Number of downloads increased'});
    } catch (error) {
        res.status(500).json({ error: "Failed to increase download count"});
    } 
});

// For deleting user files from the database
// and deleting the file from the S3 bucket
app.delete('/users/files/:id', withAuth, async (req, res) => {
    
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
});

// For getting public files with pagination, filtering, querying
app.get('/files', async (req, res) => {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;
    const search = req.query.query || '';
    const tag = req.query.tag || '';

    try {
        const query = `
            SELECT DISTINCT ON (uf.id) uf.id, uf.url, uf.name, uf.type
            FROM user_files uf
            LEFT JOIN file_tags ft ON ft.file_id = uf.id
            WHERE uf.is_public = true
                AND ($1 = '' OR LOWER(uf.name) LIKE LOWER('%' || $1 || '%'))
                AND ($2 = '' OR LOWER(ft.tag_name) LIKE LOWER('%' || $2 || '%'))
            ORDER BY uf.id DESC, uf.added_at ASC
            LIMIT $3 OFFSET $4;
        `;

        const { rows } = await pool.query(query, [search, tag, limit, offset]);
        res.json(rows);
    } catch (error) {
        console.error("Failed to fetch files:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// For getting featured files
app.get('/files/featured', async (req, res) => {
    try {
        const featured_file_ids = await pool.query('SELECT file_id FROM featured_files ORDER BY id DESC');

        if(featured_file_ids.rows.length === 0) {
            return res.status(404).json({ error: "Featured files not found"});
        }

        const featured_files = []
        for (const feat of featured_file_ids.rows) {
            const featured_file_response = await pool.query('SELECT * FROM user_files WHERE id = $1', [feat.file_id]);

            if (featured_file_response.rows[0]) {
                featured_files.push(featured_file_response.rows[0]);
            }
        }

        res.status(200).json(featured_files);
    } catch(error) {
        res.status(500).json({ error: 'Internal Server Error'})
    }
});

// For getting individual file information
app.get('/files/:id', async (req, res) => {
    const file_id = req.params.id;

    if(file_id === undefined) {
        return res.status(400).json({ error: 'File ID is required' }); 
    }

    try {
        const file_response = await pool.query("SELECT id, user_id, url, name, type, added_at, is_public, downloads FROM user_files WHERE id = $1", [file_id]);
        
        if (file_response.rows.length === 0) {
            return res.status(404).json({ error: 'File not found' });
        }

        if (!file_response.rows[0].is_public) {
            return res.status(403).json({ error: 'File is not public'});
        }
        
        const tags_response = await pool.query('SELECT * FROM file_tags WHERE file_id = $1', [file_id]);
        
        const file = file_response.rows[0];

        file.tags = tags_response.rows.map((tag) => ({
            id: tag.id,
            file_id: tag.file_id,
            tag_name: tag.tag_name,
        }));

        res.json(file);
    } catch (error) {
        console.error("Failed to fetch file:", error);
        res.status(500).json({ error: 'Internal Server Error' })
    }

});

// For getting file tags
app.get('/files/:id/tags', withAuth, async (req, res) => {
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

// For adding file tags
app.post('/files/:id/tags', withAuth, async (req, res) => {
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

// For deleting file tags
app.delete('/files/:id/tags', withAuth, async (req, res) => {
    const file_id = req.params.id;
    const { tags } = req.body;

    if(file_id === undefined || tags === undefined) {
        return res.status(400).json({ error: 'File ID and tags are required' }); 
    }

    try {
        await pool.query('DELETE FROM file_tags WHERE file_id = $1 AND tag_name = ANY($2::text[])', [file_id, tags])
        res.status(200).json({ message: 'Tags deleted successfully' });
    } catch (error) {
        console.log("Failed to delete tags");
        res.status(500).json({ error: 'Interal Server Error'})
    }
});

// For getting popular tags
app.get('/tags/popular', async (req, res) => {
     try {
        // Select the public tag_name and count from file_tags and user_files tables by joining them on file_id
        const { rows } = await pool.query('SELECT ft.tag_name, COUNT(*) as count FROM file_tags ft JOIN user_files uf ON ft.file_id = uf.id WHERE uf.is_public = true GROUP BY ft.tag_name ORDER BY count DESC LIMIT 10');
        res.json(rows);
    } catch (error) {
        console.log("Failed to fetch popular tags");
        res.status(500).json({ error: 'Interal Server Error'})
    }
});

// For getting related files based on tags
app.get('/files/:id/related', async (req, res) => {
    const file_id = req.params.id;

    if(file_id === undefined) {
        return res.status(400).json({ error: 'File ID is required' }); 
    }

    try {
        const file_tags_response = await pool.query('SELECT * FROM file_tags WHERE file_id = $1', [file_id]);
        const tags = file_tags_response.rows.map((tag) => tag.tag_name);

        const query = `
            SELECT DISTINCT uf.*
            FROM user_files uf
            JOIN file_tags ft ON uf.id = ft.file_id
            WHERE uf.is_public = true
            AND ft.tag_name = ANY($1::text[])
            AND uf.id != $2
            ORDER BY uf.added_at DESC
            LIMIT 10
        `;

        const related_files_response = await pool.query(query, [tags, file_id]);

        res.status(200).json(related_files_response.rows);
    } catch (error) {
        console.log("Failed to fetch related files");
        res.status(500).json({ error: 'Interal Server Error'})
    }
});

app.use((req, res) => {
    console.log('404 hit for path:', req.path);
    res.status(404).json({ error: 'Route not found' });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});