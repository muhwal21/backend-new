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
    formData.append('listId', '901803130187'); // ID list
    formData.append('spaceId', '9018486553'); // ID space
    formData.append('file', file);

    try {
        const response = await fetch('/api/create-task', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            alert('Task created with ID: ' + data.taskId);
        } else {
            const error = await response.json();
            alert('Error creating task: ' + (error.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred.');
    }
});
