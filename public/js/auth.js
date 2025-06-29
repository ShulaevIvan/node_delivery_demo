window.addEventListener('DOMContentLoaded', () => {
    const mainForm = document.querySelector('#singup-main-form');
    const loginInput = mainForm.querySelector('.input-login-auth-page');
    const passwordForm = mainForm.querySelector('.input-password-auth-page');
    const sendFormBtn = mainForm.querySelector('#send-auth-form-btn');
    const HOST = `http://${window.location.host}`;

    const sendFromHandler = async (e) => {
        e.preventDefault();
        const targetUrl = `${HOST}/api/signup`;
        const sendData = {};
        sendData.email = '';
        sendData.password = '';
        sendData.name = '';
        sendData.contactPhone = '';
    };

    sendFormBtn.addEventListener('click', sendFromHandler);

});