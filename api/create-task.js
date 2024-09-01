// api/upload-task.js
export default async function handler(req, res) {
    const apiToken = process.env.CLICKUP_API_TOKEN; // Mengambil token dari variabel lingkungan
    const { name, listId, spaceId } = req.body;

    // Validasi input
    if (!name || !listId || !spaceId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Membuat tugas di ClickUp
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
            throw new Error('Error creating task: ' + (error.err || 'Unknown error'));
        }

        const createdTask = await createTaskResponse.json();
        const taskId = createdTask.id;

        // Mengupload file (upload file bagian ini bisa disesuaikan)
        // ...

        res.status(200).json({ taskId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
