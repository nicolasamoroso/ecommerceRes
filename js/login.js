function handleCredentialResponse(response) {
    const responsePayload = decodeJwtResponse(response.credential);

    signIn(responsePayload.email, responsePayload.name, responsePayload.picture);
}

function decodeJwtResponse(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
};

(function () {
    'use strict'
    let forms = document.querySelectorAll('.needs-validation')
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }
                form.classList.add('was-validated')
            }, false)
        })
})()

document.getElementById("form").addEventListener("submit", function (event) {
    event.preventDefault();
    const n_email = document.getElementById("email").value
    const password = document.getElementById("password").value
    if (n_email && password) {
        if (password.length >= 8) {
            signIn(n_email);
            return
        }
        showAlertError();
    }
});

function signIn(n_email, name = undefined, picture = undefined) {
    const profileArray = JSON.parse(localStorage.getItem("profile"));
    if (profileArray) {
        const catchProfile = profileArray.find(function ({ email }) {
            return email === n_email
        })
        if (catchProfile) {
            const profile = {
                name: catchProfile.name,
                email: catchProfile.email,
                picture: catchProfile.picture,
                phone: catchProfile.phone,
                street: catchProfile.street,
                number: catchProfile.number,
                department: catchProfile.department,
                age: catchProfile.age,
                name_lastname: catchProfile.name_lastnme,
                logged: true
            }

            profileArray.splice(profileArray.findIndex(function ({ email }) {
                return email === n_email
            }), 1, profile);
            localStorage.setItem("profile", JSON.stringify(profileArray));
            redirect();
            return;
        }
    }

    name = name ? name : n_email.split("@")[0];
    const profile = {
        name,
        email: n_email,
        picture: picture ?? "img/img_perfil.png",
        phone: null,
        street: null,
        number: null,
        department: null,
        age: null,
        name_lastname: null,
        logged: true
    }

    if (profileArray) {
        profileArray.push(profile);
        localStorage.setItem("profile", JSON.stringify(profileArray));
        redirect();
        return;
    }

    const profileArray2 = [profile];
    localStorage.setItem("profile", JSON.stringify(profileArray2));
    redirect();
    return;
}

function redirect() {
    const profile = JSON.parse(localStorage.getItem("profile"));
    if (profile) {
        const catchProfile = JSON.parse(localStorage.getItem("profile")).find(function ({ logged }) {
            return logged === true
        })
        if (catchProfile) window.location = "index.html";
    }
}

document.addEventListener("DOMContentLoaded", function () {
    redirect();
});