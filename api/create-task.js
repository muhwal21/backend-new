import { parse } from 'formidable'; // Memastikan FormData dapat diurai
import fs from 'fs';

export const config = {
    api: {
        bodyParser: false
    }
};

export default async function handler(req, res) {
    const apiToken = process.env.CLICKUP_API_TOKEN; // Ambil API token dari variabel lingkungan

    try {
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            if (err) {
                return res.status(500).json({ error: 'Error parsing form data' });
            }

            const { name, listId, spaceId } = fields;
            const file = files.file[0];

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
                res.status(400).json({ error: error.err || 'Unknown error' });
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred.' });
    }
}
