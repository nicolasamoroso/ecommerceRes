document.addEventListener("DOMContentLoaded", async () => {
    const inputImage = document.getElementById('image')
    const editor = document.getElementById('editor')
    const miCanvas = document.getElementById('preview')
    const contexto = miCanvas.getContext('2d')
    let urlImage = undefined
    inputImage.addEventListener('change', abrirEditor, false)

    //Función que abre el editor con la imagen seleccionada
    function abrirEditor(e) {
        if (!e.target.files[0]) {
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
        miNuevaImagenTemp.onload = function () {
            //Recorta
            contexto.drawImage(miNuevaImagenTemp, inicioX, inicioY, nuevoAncho * zoom, nuevaAltura * zoom, 0, 0, nuevoAncho, nuevaAltura)

            //Se transforma a base64
            imagenEn64 = miCanvas.toDataURL("image/png")

            if (imagenEn64.includes("data:image/")) document.getElementById("profile_img").src = imagenEn64
        }
        //Agrega y elimina sino se bugea
        miNuevaImagenTemp.src = urlImage
        document.querySelector("#preview").remove()
    }

})


const form = document.getElementById("form-edit")

form.addEventListener("submit", async (e) => {
    if (!form.checkValidity()) {
        e.stopPropagation()
        e.preventDefault()
    }
    form.classList.add('was-validated')
    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries())
    
    console.log(data)
})

document.getElementById("first-name").addEventListener("input", (e) => {
    e.value = e.value.replace(/[^a-zA-Z]/, '')
})