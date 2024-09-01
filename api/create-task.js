import { IncomingForm } from 'formidable';
import fs from 'fs';
import fetch from 'node-fetch';
import FormData from 'form-data';

export const config = {
    api: {
        bodyParser: false
    }
};

export default async function handler(req, res) {
    const apiToken = process.env.CLICKUP_API_TOKEN;

    // Menambahkan header CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const form = new IncomingForm();
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Error parsing form data:', err);
                return res.status(500).json({ error: 'Error parsing form data' });
            }

            const { name, listId } = fields;
            const file = files.file[0];

            if (!file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            // Membuat task di list
            const createTaskResponse = await fetch(`https://api.clickup.com/api/v2/list/${listId}/task`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name })
            });

            if (!createTaskResponse.ok) {
                const error = await createTaskResponse.json();
                console.error('Error creating task:', error);
                return res.status(400).json({ error: error.err || 'Unknown error' });
            }

            const createdTask = await createTaskResponse.json();
            const taskId = createdTask.id;

            // Upload file ke task
            const formData = new FormData();
            formData.append('attachment', fs.createReadStream(file.filepath), file.originalFilename);

            const uploadFileResponse = await fetch(`https://api.clickup.com/api/v2/task/${taskId}/attachment`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiToken}`
                },
                body: formData
            });

            if (uploadFileResponse.ok) {
                res.status(200).json({ message: 'File uploaded successfully!' });
            } else {
                const error = await uploadFileResponse.json();
                console.error('Error uploading file:', error);
                res.status(400).json({ error: error.err || 'Unknown error' });
            }
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ error: 'An unexpected error occurred.' });
    }
}
