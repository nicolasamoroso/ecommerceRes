document.addEventListener("DOMContentLoaded", async () => {
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

        if (e.target.files && !e.target.files[0]) {
            return
        }
        else {
            myModal.toggle()
        }


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

            if (base64Img.includes("data:image/")) document.getElementById("profile_img").src = base64Img
        }
        //Agrega y elimina sino se bugea
        tempImg.src = imgUrl
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

// window onfocus input file

function openModal() {
    document.getElementById("inputImage").click()

}