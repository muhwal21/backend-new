const listId = 'YOUR_LIST_ID'; // Ganti dengan List ID Anda
const spaceId = 'YOUR_SPACE_ID'; // Ganti dengan Space ID Anda

document.getElementById('uploadForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const fileInput = document.getElementById('pdf');
    const file = fileInput.files[0];

    if (!file || file.type !== 'application/pdf') {
        alert('Please upload a PDF file.');
        return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('file', file);
    formData.append('listId', listId);  // Kirim List ID ke API
    formData.append('spaceId', spaceId); // Kirim Space ID ke API

    try {
        const response = await fetch('https://your-project.vercel.app/api/create-task', { // Ganti dengan URL endpoint Anda
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('File uploaded successfully!');
        } else {
            const error = await response.json();
            alert('Error uploading file: ' + (error.error || 'Unknown error'));
            console.error('Error details:', error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred.');
    }
});
