const form = document.querySelector('#bug-report-form');
const successMessage = document.querySelector('#success-message');
const errorMessage = document.querySelector('#error-message');

form.addEventListener('submit', async event => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const response = await fetch('http://mockbin.com/bin/7eb970ae-1814-4394-88d4-a51cc1568443', {
        method: 'POST',
        body: formData
    });
    if (response.ok) {
        form.reset();
        successMessage.classList.remove('hidden');
        errorMessage.classList.add('hidden');
    } else {
        successMessage.classList.add('hidden');
        errorMessage.classList.remove('hidden');
    }
});