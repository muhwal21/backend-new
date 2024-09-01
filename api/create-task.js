// api/create-task.js
export default async function handler(req, res) {
    // Menambahkan header CORS
    res.setHeader('Access-Control-Allow-Origin', '*'); // Mengizinkan semua domain
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE'); // Metode yang diizinkan
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization'); // Header yang diizinkan

    if (req.method === 'OPTIONS') {
        // Respon preflight request
        res.status(200).end();
        return;
    }

    // Mendapatkan data dari permintaan
    const { name, listId, spaceId, file } = req.body;

    // Validasi input
    if (!name || !listId || !spaceId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Membuat tugas di ClickUp
        const createTaskResponse = await fetch(`https://api.clickup.com/api/v2/list/${listId}/task`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.CLICKUP_API_TOKEN}`,
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

        // Mengupload file (Anda bisa menggunakan library seperti 'form-data' untuk menangani ini di backend)
        // File upload bisa dilakukan secara langsung di backend jika Anda menggunakan pustaka yang tepat

        res.status(200).json({ taskId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
