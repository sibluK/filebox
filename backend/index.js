import express from 'express';
import generateUploadURL from './s3.js';

const app = express();

app.get('/generate-url', async (req, res) => {
    try {
        const url = await generateUploadURL();
        res.send({ url });
    } catch (error) {
        res.status(500).send({ error: 'Failed to generate upload URL' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});