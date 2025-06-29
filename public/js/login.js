window.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('#signin-main-form');
    const loginInput = loginForm.querySelector('#input-login-auth-page');
    const passwordInput = loginForm.querySelector('#input-password-auth-page');
    const sendBtn = loginForm.querySelector('#send-auth-form-btn');

    const loginUrl = `http://${window.location.host}/api/signin/`;

    const sendFormHandler = async (e) => {
        e.preventDefault();
        const sendData = {
            email: loginInput.value,
            password: passwordInput.value
        };
        try {
            await fetch(`${loginUrl}`, {
                method: 'POST',
                body: JSON.stringify(sendData),
                headers: {
                    'Content-Type': 'Application/json'
                }
            })
            .then((response) => {
                if (response.status === 201) {
                    return response.json();
                }
            })
            .then((data) =>  window.location.reload());
        }
        catch(err) {
            console.log(err)
        }
       
    };

    sendBtn.addEventListener('click', sendFormHandler);
});