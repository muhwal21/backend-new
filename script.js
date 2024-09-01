require('dotenv').config(); // Tambahkan ini jika menggunakan Node.js

document.getElementById('uploadForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const fileInput = document.getElementById('pdf');
    const file = fileInput.files[0];

    if (!file || file.type !== 'application/pdf') {
        alert('Please upload a PDF file.');
        return;
    }

    const apiToken = process.env.API_TOKEN; // Ambil API token dari variabel lingkungan
    const spaceId = process.env.SPACE_ID;   // Ambil space ID dari variabel lingkungan
    const listId = process.env.LIST_ID;     // Ambil list ID dari variabel lingkungan

    try {
        const createTaskResponse = await fetch(`https://api.clickup.com/api/v2/list/${listId}/task`, {
            method: 'POST',
            headers: {
                'Authorization': apiToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                // parameter lain 
            })
        });

        if (!createTaskResponse.ok) {
            const error = await createTaskResponse.json();
            throw new Error('Error creating task: ' + (error.err || 'Unknown error'));
        }

        const createdTask = await createTaskResponse.json();
        const taskId = createdTask.id;

        // Upload File
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
            alert('File uploaded successfully!');
        } else {
            const error = await uploadFileResponse.json();
            alert('Error uploading file: ' + (error.err || 'Unknown error'));
            console.error('Error details:', error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred.');
    }
});
