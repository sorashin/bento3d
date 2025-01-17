const axios = require('axios');

const NOTION_API_URL = 'https://api.notion.com/v1/pages';
const NOTION_TOKEN = process.env.NOTION_TOKEN; // 環境変数に保存
const DATABASE_ID = process.env.DATABASE_ID; // 環境変数に保存

exports.addNotionItem = async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*'); // すべてのオリジンを許可
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).send({ error: 'Method Not Allowed' });
        return;
    }

    const { feedback, rating } = req.body;

    if (!feedback && typeof rating !== 'number') {
        res.status(400).send({ error: 'Missing or invalid fields' });
        return;
    }

    const properties = {};

    if (feedback) {
        properties.Feedback = { // rich_text プロパティ
            rich_text: [{ text: { content: feedback } }],
        };
    }

    if (typeof rating === 'number') {
        properties.Rating = { // number プロパティ
            number: rating,
        };
    }

    try {
        const response = await axios.post(
            NOTION_API_URL,
            {
                parent: { database_id: DATABASE_ID },
                properties,
            },
            {
                headers: {
                    Authorization: `Bearer ${NOTION_TOKEN}`,
                    'Content-Type': 'application/json',
                    'Notion-Version': '2022-06-28',
                },
            }
        );

        res.status(200).send({ message: 'Item added successfully', data: response.data });
    } catch (error) {
        console.error('Error adding item to Notion:', error.response?.data || error.message);
        res.status(500).send({ error: 'Failed to add item to Notion', details: error.response?.data || error.message });
    }
};