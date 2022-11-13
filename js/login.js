function handleCredentialResponse(response) {
    const responsePayload = decodeJwtResponse(response.credential);
    signIn(responsePayload.email, responsePayload.name, responsePayload.picture);
}

function decodeJwtResponse(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(window.atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
};

(function () {
    'use strict'
    let forms = document.querySelectorAll('.needs-validation')
    Array.prototype.slice.call(forms).forEach((form) => {
        form.addEventListener('submit', (event) => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }
            form.classList.add('was-validated')
        }, false)
    })
})()

function mailVerification(email) {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/
    )
}

document.getElementById("form").addEventListener("submit", function (event) {
    event.preventDefault();
    const n_email = document.getElementById("email").value
    const password = document.getElementById("password").value
    if (n_email && password && password.length >= 6 && mailVerification(n_email))
        signIn(n_email);
});

function signIn(n_email, name = undefined, picture = undefined) {
    const profileArray = JSON.parse(localStorage.getItem("profile"));
    if (profileArray) {
        const catchProfile = profileArray.find(function ({ email }) {
            return email === n_email
        })
        if (catchProfile) {
            const profile = {
                username: catchProfile.username,
                email: catchProfile.email,
                f_name: catchProfile.f_name,
                s_name: catchProfile.s_name,
                f_lastname: catchProfile.f_lastname,
                s_lastname: catchProfile.s_lastname,
                phone: catchProfile.phone,
                picture: catchProfile.picture,
                cart: catchProfile.cart,
                logged: true
            }

            profileArray.splice(profileArray.findIndex(function ({ email }) {
                return email === n_email
            }), 1, profile);
            localStorage.setItem("profile", JSON.stringify(profileArray));
            redirect();
            return
        }
    }

    name = name ? name : n_email.split("@")[0];
    const profile = {
        username: name,
        email: n_email,
        f_name: "",
        s_name: "",
        f_lastname: "",
        s_lastname: "",
        phone: "",
        picture: picture ?? "img/img_perfil.png",
        cart: [],
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
}

function redirect() {
    const profile = JSON.parse(localStorage.getItem("profile"));
    if (profile) {
        const catchProfile = JSON.parse(localStorage.getItem("profile"))
            .find(({ logged }) => logged === true
        )
        if (catchProfile) window.location = "index.html";
    }
}

document.addEventListener("DOMContentLoaded", function () {
    redirect();
});