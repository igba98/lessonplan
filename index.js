const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/find-resources', async (req, res) => {
    const { prompt } = req.body;
    console.log(`Received prompt: ${prompt}`);

    try {
        // Fetch books from Google Books API
        const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
            params: {
                q: prompt,
                key: process.env.GOOGLE_BOOKS_API_KEY,
            },
        });

        const books = response.data.items.map(item => ({
            title: item.volumeInfo.title,
            authors: item.volumeInfo.authors,
            description: item.volumeInfo.description,
            infoLink: item.volumeInfo.infoLink,
        }));

        if (books.length > 0) {
            res.json({ books });
        } else {
            res.json({ message: 'No books found.' });
        }
    } catch (error) {
        console.error('Error fetching books from Google Books API:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
