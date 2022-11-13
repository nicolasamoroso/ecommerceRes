document.addEventListener("DOMContentLoaded", async () => {
    getProfile()
    cutImage()
})

const profileArray = JSON.parse(localStorage.getItem('profile'))
const profile = profileArray ? profileArray.find(({ logged }) => logged === true) : {}

function getProfile() {
    document.getElementById('emailLabel').textContent = profile.email
    document.getElementById('usernameLabel').textContent = profile.username
    if (profile.f_name !== '') document.getElementById('f-nameLabel').textContent = profile.f_name
    if (profile.s_name !== '') document.getElementById('s-nameLabel').textContent = profile.s_name
    if (profile.f_lastname !== '') document.getElementById('f-lastnameLabel').textContent = profile.f_lastname
    if (profile.s_lastname !== '') document.getElementById('s-lastnameLabel').textContent = profile.s_lastname
    if (profile.phone !== '') document.getElementById('phoneLabel').textContent = profile.phone
    document.getElementById("profileImg").src = profile.picture
}

const form = document.getElementById("form-edit")

form.addEventListener("submit", async (e) => {
    if (!form.checkValidity()) {
        e.stopPropagation()
        e.preventDefault()
    }
    form.classList.add('was-validated')
})

document.getElementById("editProfile").addEventListener("click", () => {
    document.getElementById("edit-profile").classList.remove("d-none")
    document.getElementById("profile").classList.add("d-none")
    document.getElementById("edit-emailLabel").textContent = profile.email
    document.getElementById("edit-inputUsername").value = profile.username
    document.getElementById("edit-inputFName").value = profile.f_name
    document.getElementById("edit-inputSName").value = profile.s_name
    document.getElementById("edit-inputFLastname").value = profile.f_lastname
    document.getElementById("edit-inputSLastname").value = profile.s_lastname
    document.getElementById("edit-inputPhone").value = profile.phone
    document.getElementById("editProfileImg").src = profile.picture
})

document.getElementById("saveEdit").addEventListener("click", () => {
    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries())
    if (data.username.length > 0 && data.first_name.length > 0 && data.first_lastname.length > 0 && data.phone.length > 0) {
        profile.s_name = data.second_name
        profile.s_lastname = data.second_lastname
        profile.phone = data.phone
        profile.username = data.username
        profile.f_name = data.first_name
        profile.f_lastname = data.first_lastname
        profile.picture = document.getElementById("editProfileImg").src
        localStorage.setItem('profile', JSON.stringify(profileArray))
    }
})

document.getElementById("cancelEdit").addEventListener("click", () => {
    document.getElementById("edit-profile").classList.add("d-none")
    document.getElementById("profile").classList.remove("d-none")
})

document.getElementById("cancel-pic").addEventListener("click", () => {
    document.getElementById("editProfileImg").src = profile.picture
})

function cutImage() {
    const inputImage = document.getElementById('image')
    const editor = document.getElementById('editor')
    const canvasPreview = document.getElementById('preview')
    const context = canvasPreview.getContext('2d')
    let imgUrl = undefined
    inputImage.addEventListener('change', openEditor, false)
    var myModal = new bootstrap.Modal(document.getElementById('Modal'), {
        keyboard: false
    })

    //Función que abre el editor con la imagen seleccionada
    function openEditor(e) {
        if (e.target.files && !e.target.files[0]) return

        myModal.toggle()

        //Obtiene la imagen si existe "e.target.files[0]"
        imgUrl = URL.createObjectURL(e.target.files[0])

        //Borra editor en caso que existiera una imagen previa
        editor.innerHTML = ''
        let cropprImg = document.createElement('img')
        cropprImg.setAttribute('id', 'croppr')
        editor.appendChild(cropprImg)

        //Limpia la previa en caso que existiera algún elemento previo
        context.clearRect(0, 0, canvasPreview.width, canvasPreview.height)

        //Envia la imagen al editor para su recorte
        document.getElementById('croppr').setAttribute('src', imgUrl)

        //Crea el editor
        new Croppr('#croppr', {
            aspectRatio: 1,
            startSize: [70, 70],
            onCropEnd: cropImg
        })
    }

    //Función que recorta la imagen con las coordenadas proporcionadas con croppr.js
    function cropImg(data) {
        const xStart = data.x
        const yStart = data.y
        const newWidth = data.width
        const newHeight = data.height
        const zoom = 1
        let base64Img = ''

        canvasPreview.width = newWidth
        canvasPreview.height = newHeight
        let tempImg = new Image()

        // Cuando la imagen se cargue se procederá al recorte
        tempImg.onload = function () {
            //Recorta
            context.drawImage(tempImg, xStart, yStart, newWidth * zoom, newHeight * zoom, 0, 0, newWidth, newHeight)

            //Se transforma a base64
            base64Img = canvasPreview.toDataURL("image/png")

            if (base64Img.includes("data:image/")) document.getElementById("editProfileImg").src = base64Img
        }
        //Agrega y elimina sino se bugea
        tempImg.src = imgUrl
        document.querySelector("#preview").remove()
    }
}