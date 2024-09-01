// api/create-task.js
export default async function handler(req, res) {
    const { name, file } = req.body;
    const apiToken = process.env.CLICKUP_API_TOKEN; // Token API dari variabel lingkungan
    const listId = process.env.LIST_ID;

    try {
        const createTaskResponse = await fetch(`https://api.clickup.com/api/v2/list/${listId}/task`, {
            method: 'POST',
            headers: {
                'Authorization': apiToken,
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

        // Upload file logic
        const formData = new FormData();
        formData.append('attachment', file, file.name);

        const uploadFileResponse = await fetch(`https://api.clickup.com/api/v2/task/${taskId}/attachment`, {
            method: 'POST',
            headers: {
                'Authorization': apiToken
            },
            body: formData
        });

        if (uploadFileResponse.ok) {
            res.status(200).json({ message: 'File uploaded successfully!' });
        } else {
            const error = await uploadFileResponse.json();
            res.status(400).json({ error: error.err || 'Unknown error' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred.' });
    }
}
