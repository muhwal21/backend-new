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

    try {
        const response = await fetch('/api/create-task', {
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
