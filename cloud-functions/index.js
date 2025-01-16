const axios = require('axios');

const NOTION_API_URL = 'https://api.notion.com/v1/pages';
const NOTION_TOKEN = process.env.NOTION_TOKEN; // 環境変数に保存
const DATABASE_ID = process.env.DATABASE_ID; // 環境変数に保存

exports.addNotionItem = async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).send({ error: 'Method Not Allowed' });
        return;
    }

    const { feedback, rating } = req.body;

    if (!feedback || typeof rating !== 'number') {
        res.status(400).send({ error: 'Missing or invalid fields' });
        return;
    }

    try {
        const response = await axios.post(
            NOTION_API_URL,
            {
                parent: { database_id: DATABASE_ID },
                properties: {
                    Feedback: { // rich_text プロパティ
                        rich_text: [{ text: { content: feedback } }],
                    },
                    Rating: { // number プロパティ
                        number: rating,
                    },
                },
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
        res.status(500).send({ error: 'Failed to add item to Notion' });
    }
};