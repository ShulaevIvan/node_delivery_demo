window.addEventListener('DOMContentLoaded', () => {
    const mainForm = document.querySelector('#singup-main-form');
    const emailInput = mainForm.querySelector('#input-email-singup-page');
    const passwordInput = mainForm.querySelector('#input-password-singup-page');
    const nameInput = mainForm.querySelector('#input-name-singup-page');
    const phoneInput = mainForm.querySelector('#input-phone-singup-page');
    const sendFormBtn = mainForm.querySelector('#send-register-form-btn');

    const registerUrl = `http://${window.location.host}/api/signup/`;

    const sendFromHandler = async (e) => {
        e.preventDefault();
        const sendData = {};
        sendData.email = emailInput.value;
        sendData.password = passwordInput.value;
        sendData.name = nameInput.value;
        sendData.contactPhone = phoneInput.value;
        console.log(JSON.stringify(sendData))

        await fetch(`${registerUrl}`, {
            method: 'POST',
            body: JSON.stringify(sendData),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => response.json())
        .then((data) => {
            if (data) {
                window.location.href = '/singin';
                return;
            }
        });
    };

    sendFormBtn.addEventListener('click', sendFromHandler);

});