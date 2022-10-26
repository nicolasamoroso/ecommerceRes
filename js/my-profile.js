const profileArray = JSON.parse(localStorage.getItem("profile"))
const profile = JSON.parse(localStorage.getItem("profile")).find(function({logged}) {
    return logged === true
})

document.addEventListener("DOMContentLoaded", async () => {
    document.getElementById("profile_img").src = profile.picture
    info()

    //guarda la ubicación actual por si llega a ir a un lugar no permitido.
    const location = window.location.href
    localStorage.setItem("prev_location", JSON.stringify(location))

    //boton para cancelar la foto de perfil
    document.getElementById("cancel-pic").addEventListener("click", function (e) {
        document.getElementById("profile_img").src = profile.picture
    })

    const inputImage = document.getElementById('image')
    const editor = document.getElementById('editor')
    const miCanvas = document.getElementById('preview')
    const contexto = miCanvas.getContext('2d')
    let urlImage = undefined
    inputImage.addEventListener('change', abrirEditor, false)
    
    //Función que abre el editor con la imagen seleccionada
    function abrirEditor(e) {
        if(!e.target.files[0]) {
            document.getElementById("Modal").classList.add("d-none")
            document.querySelector(".modal-backdrop").remove()
            alert('No se seleccionó ninguna imagen')
            return
        }

        //Obtiene la imagen si existe "e.target.files[0]"
        urlImage = URL.createObjectURL(e.target.files[0])
    
        //Borra editor en caso que existiera una imagen previa
        editor.innerHTML = ''
        let cropprImg = document.createElement('img')
        cropprImg.setAttribute('id', 'croppr')
        editor.appendChild(cropprImg)
    
        //Limpia la previa en caso que existiera algún elemento previo
        contexto.clearRect(0, 0, miCanvas.width, miCanvas.height)
    
        //Envia la imagen al editor para su recorte
        document.getElementById('croppr').setAttribute('src', urlImage)
    
        //Crea el editor
        new Croppr('#croppr', {
            aspectRatio: 1,
            startSize: [70, 70],
            onCropEnd: recortarImagen
        })
    }
    
    //Función que recorta la imagen con las coordenadas proporcionadas con croppr.js
    function recortarImagen(data) {
        const inicioX = data.x
        const inicioY = data.y
        const nuevoAncho = data.width
        const nuevaAltura = data.height
        const zoom = 1
        let imagenEn64 = ''

        miCanvas.width = nuevoAncho
        miCanvas.height = nuevaAltura

        let miNuevaImagenTemp = new Image()

        
        // Cuando la imagen se cargue se procederá al recorte
        miNuevaImagenTemp.onload = function() {

            //Recorta
            contexto.drawImage(miNuevaImagenTemp, inicioX, inicioY, nuevoAncho * zoom, nuevaAltura * zoom, 0, 0, nuevoAncho, nuevaAltura)

            //Se transforma a base64
            imagenEn64 = miCanvas.toDataURL("image/png")
            
            if(imagenEn64.includes("data:image/")) {
                document.getElementById("profile_img").src = imagenEn64
            }
        }

        //Agrega y elimina sino se bugea
        miNuevaImagenTemp.src = urlImage
        document.querySelector("#preview").remove()
    }

})

function cancel_pic() {
    document.getElementById("profile_img").src = profile.picture
}

function info() {
    document.getElementById("info-perfil").innerHTML = `
    <form class="row mb-4 card-body">
        <p class="mb-0 col-sm-5 text-break"><strong>Nombre de usuario</strong></p>
        <small class="col-sm-7 text-break">${profile.name}</small>
        <hr>

        <p class="mb-0 col-sm-5 text-break"><strong>Email</strong></p>
        <small class="col-sm-7 text-break">${profile.email}</small>
        <hr>

        <p class="mb-0 col-sm-5 text-break"><strong>Nombre y Apellido</strong></p>
        <small class="col-sm-7 text-break">${profile.name_lastname ?? "Debe completar este campo"}</small>
        <hr>

        <p class="mb-0 col-sm-5 text-break"><strong>Celular</strong></p>
        <small class="col-sm-7 text-break">${profile.phone ?? "Debe completar este campo"}</small>
        <hr>

        <p class="mb-0 col-sm-5 text-break"><strong>Dirección</strong></p>
        <small class="col-sm-7 text-break">${profile.address ?? "Debe completar este campo"}</small>
        <hr>

        <p class="mb-0 col-sm-5 text-break"><strong>Edad</strong></p>
        <small class="col-sm-7 text-break">${profile.age ?? "Debe completar este campo"}</small>
        <hr>

        <button type="button" id="modificarInfo" class="btn btn-dark">Modificar mis datos</button>
    </form>
    `

    document.getElementById("modificarInfo").addEventListener("click", function () {
        document.getElementById("image").classList.remove("d-none")
        document.getElementById("info-perfil").classList.add("d-none")
        document.getElementById("info-perfil-edit").classList.remove("d-none")
        document.getElementById("emailEdit").innerText = profile.email

        document.getElementById("nombre").value = profile.name ?? ""
        document.getElementById("nombre-apellido").value = profile.name_lastname ?? ""
        document.getElementById("celular").value = profile.phone ?? ""
        document.getElementById("calle").value = profile.street ?? ""
        document.getElementById("numero").value = profile.number ?? ""
        document.getElementById("departamento").value = profile.department ?? ""
        document.getElementById("edad").value = profile.age ?? ""
    })
}

function validatePhone(phone) {
    const phoneReg = /^([0]{1})+([9]{1})+([0-9]{1})+([0-9]{3})+([0-9]{3})$/
    return !phoneReg.test(phone)
}

function validateNumber(number) {
    const numberReg = /^([0-9]{3,4})$/
    return !numberReg.test(number)
}

function saveInfo() {
    let name = document.getElementById("nombre").value
    let picture = document.getElementById("profile_img").src
    let name_lastname = document.getElementById("nombre-apellido").value
    let phone = document.getElementById("celular").value
    let street = document.getElementById("calle").value
    let number = document.getElementById("numero").value
    let department = document.getElementById("departamento").value
    let age = document.getElementById("edad").value
    
    if (!name) alert("Debe completar el campo nombre")
    else if (!name_lastname) alert("Debe completar el campo nombre y apellido")
    else if (!phone) alert("Debe completar el campo celular")
    else if (validatePhone(phone)) alert("El celular debe tener el formato 09XXXXXXXX")
    else if (!street) alert("Debe completar el campo dirección")
    else if (!number) alert("Debe completar el campo número")
    else if (validateNumber(number)) alert("El número debe tener el formato XXXX")
    else if (!department) alert("Debe completar el campo departamento")
    else if (!age) alert("Debe completar el campo edad")
    else  {
        const catchProfile = JSON.parse(localStorage.getItem("profile")).find(function({email}) {
            return email === profile.email
        })
        if (catchProfile) {
            const address = street + " " + number + ", " + department
            const newProfile = {
                name,
                email: catchProfile.email,
                name_lastname,
                picture,
                phone,
                street,
                number,
                department,
                address,
                age,
                logged : catchProfile.logged
            }
            profileArray.splice(profileArray.findIndex(function({logged}) {
                return logged === true
            }), 1, newProfile)

            localStorage.setItem("profile", JSON.stringify(profileArray))
            window.location.href = "my-profile.html"
        }
    }
}

function cancel() {
    document.getElementById("image").classList.add("d-none")
    document.getElementById("profile_img").src = profile.picture
    window.location.href = "my-profile.html"
}