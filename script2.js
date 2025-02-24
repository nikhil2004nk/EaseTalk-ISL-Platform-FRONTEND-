document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('webcam');
    const captureBtn = document.getElementById('capture-btn');
    const retakeBtn = document.getElementById('retake-btn');
    const saveBtn = document.getElementById('save-btn');
    const preview = document.getElementById('preview');
    const gestureTitle = document.getElementById('gesture-title');
    const statusMessage = document.getElementById('status-message');

    let stream;

    // Function to start the webcam
    async function startWebcam() {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
        } catch (err) {
            statusMessage.textContent = 'Error accessing the webcam: ' + err.message;
        }
    }

    // Function to capture the photo
    function capturePhoto() {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        preview.src = canvas.toDataURL('image/png');
        preview.style.display = 'block';

        captureBtn.style.display = 'none';
        retakeBtn.style.display = 'inline-block';
        gestureTitle.style.display = 'inline-block';
        saveBtn.style.display = 'inline-block';
    }

    // Function to retake the photo
    function retakePhoto() {
        preview.src = '#';
        preview.style.display = 'none';

        captureBtn.style.display = 'inline-block';
        retakeBtn.style.display = 'none';
        gestureTitle.style.display = 'none';
        saveBtn.style.display = 'none';
        gestureTitle.value = '';
    }

    // Function to save the gesture
    function saveGesture() {
        const title = gestureTitle.value.trim();
        if (!title) {
            statusMessage.textContent = 'Please enter a title for the gesture.';
            return;
        }

        // Here you can add code to save the gesture (e.g., send to a server)
        statusMessage.textContent = `Gesture "${title}" saved successfully!`;
        retakePhoto(); // Reset the interface after saving
    }

    // Event listeners
    captureBtn.addEventListener('click', capturePhoto);
    retakeBtn.addEventListener('click', retakePhoto);
    saveBtn.addEventListener('click', saveGesture);

    // Start the webcam when the page loads
    startWebcam();
});