let productCost = 0;
let productCount = 0;
let comissionPercentage = 0.13;
let MONEY_SYMBOL = "$";
let DOLLAR_CURRENCY = "Dólares (USD)";
let PESO_CURRENCY = "Pesos Uruguayos (UYU)";
let DOLLAR_SYMBOL = "USD ";
let PESO_SYMBOL = "UYU ";
let PERCENTAGE_SYMBOL = '%';
let MSG = "NO SE HA PODIDO AGREGAR LA PUBLICACIÓN";
const GOLD = 0.13;
const PREMIUM = 0.07;
const ESTANDAR = 0.03;
let imgArray = [];

//Función que se utiliza para actualizar los costos de publicación
function updateTotalCosts() {
    let unitProductCostHTML = document.getElementById("productCostText");
    let comissionCostHTML = document.getElementById("comissionText");
    let totalCostHTML = document.getElementById("totalCostText");

    let unitCostToShow = MONEY_SYMBOL + productCost;
    let comissionToShow = Math.round((comissionPercentage * 100)) + PERCENTAGE_SYMBOL;
    let totalCostToShow = MONEY_SYMBOL + ((Math.round(productCost * comissionPercentage * 100) / 100) + parseInt(productCost));

    unitProductCostHTML.innerHTML = unitCostToShow;
    comissionCostHTML.innerHTML = comissionToShow;
    totalCostHTML.innerHTML = totalCostToShow;
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", (e) => {
    document.getElementById("productCountInput").addEventListener("change", function () {
        productCount = this.value;
        updateTotalCosts();
    });

    document.getElementById("productCostInput").addEventListener("change", function () {
        productCost = this.value;
        updateTotalCosts();
    });

    document.getElementById("goldradio").addEventListener("change", function () {
        comissionPercentage = GOLD;
        updateTotalCosts();
    });

    document.getElementById("premiumradio").addEventListener("change", function () {
        comissionPercentage = PREMIUM;
        updateTotalCosts();
    });

    document.getElementById("standardradio").addEventListener("change", function () {
        comissionPercentage = ESTANDAR;
        updateTotalCosts();
    });

    document.getElementById("productCurrency").addEventListener("change", function () {
        if (this.value == DOLLAR_CURRENCY) {
            MONEY_SYMBOL = DOLLAR_SYMBOL;
        }
        else if (this.value == PESO_CURRENCY) {
            MONEY_SYMBOL = PESO_SYMBOL;
        }

        updateTotalCosts();
    });


    //Configuraciones para el elemento que sube archivos
    let dzoptions = {
        url: "/",
        autoQueue: false
    };
    let myDropzone = new Dropzone("div#file-upload", dzoptions);

    myDropzone.on('thumbnail', function (dataURL) {
        imgArray.push(dataURL);
    });

    myDropzone.on("maxfilesexceeded", function (file) {
        this.removeAllFiles();
        this.addFile(file);
    });


    //Se obtiene el formulario de publicación de producto
    let sellForm = document.getElementById("sell-info");

    //Se agrega una escucha en el evento 'submit' que será
    //lanzado por el formulario cuando se seleccione 'Vender'.
    sellForm.addEventListener("submit", function (e) {

        e.preventDefault();
        e.preventDefault();

        let productNameInput = document.getElementById("productName");
        let productFile = document.getElementById("file-upload");
        let productDesc = document.getElementById("productDescription");
        let productCurrency = document.getElementById("productCurrency");
        let productCategory = document.getElementById("productCategory");
        let productCost = document.getElementById("productCostInput");
        let productCount = document.getElementById("productCountInput");
        let infoMissing = false;

        //Quito las clases que marcan como inválidos
        productNameInput.classList.remove('is-invalid');
        productFile.classList.remove('is-invalid');
        productDesc.classList.remove('is-invalid');
        productCurrency.classList.remove('is-invalid');
        productCategory.classList.remove('is-invalid');
        productCost.classList.remove('is-invalid');
        productCount.classList.remove('is-invalid');

        //Se realizan los controles necesarios,
        //En este caso se controla que se haya ingresado el nombre y categoría.
        //Consulto por el nombre del producto
        if (productNameInput.value === "" || productNameInput.value === "⠀" || productNameInput.value.trim().length === 0) {
            productNameInput.classList.add('is-invalid');
            infoMissing = true;
        }
        else {
            productNameInput.classList.add('is-valid');
        }

        //Consulto por la categoría del producto
        if (productCategory.value === "") {
            productCategory.classList.add('is-invalid');
            infoMissing = true;
        }
        else {
            productCategory.classList.add('is-valid');
        }

        //Consulto por el costo
        if (productCost.value <= 0) {
            productCost.classList.add('is-invalid');
            infoMissing = true;
        }
        else {
            productCost.classList.add('is-valid');
        }

        //Consulto por la imagen
        if (imgArray.length === 0) {
            productFile.classList.add('is-invalid');
            infoMissing = true;
        }
        else {
            productFile.classList.add('is-valid');
        }

        //Consulto por la descripción
        if (productDesc.value === "" || productDesc.value === "⠀" || productDesc.value.trim().length === 0) {
            productDesc.classList.add('is-invalid');
            infoMissing = true;
        }
        else {
            productDesc.classList.add('is-valid');
        }

        //Consulto por la moneda
        if (productCurrency.value === "") {
            productCurrency.classList.add('is-invalid');
            infoMissing = true;
        }
        else {
            productCurrency.classList.add('is-valid');
        }

        //Consulto por la cantidad
        if (productCount.value <= 0) {
            productCount.classList.add('is-invalid');
            infoMissing = true;
        }
        else {
            productCount.classList.add('is-valid');
        }

        if (!infoMissing) {
            //Aquí ingresa si pasó los controles, irá a enviar
            //la solicitud para crear la publicación.

            getJSONData(PUBLISH_PRODUCT_URL).then(function (resultObj) {
                let msgToShowHTML = document.getElementById("resultSpan");
                let msgToShow = "";

                //Si la publicación fue exitosa, devolverá mensaje de éxito,
                //de lo contrario, devolverá mensaje de error.
                //FUNCIONALIDAD NO IMPLEMENTADA
                if (resultObj.status === 'ok') {
                    msgToShow = resultObj.data.msg.toUpperCase();
                    document.getElementById("alertResult").classList.add('alert-primary');
                    agregarPublicacion()
                    setTimeout(() => {
                        localStorage.setItem("product-info", prodID);
                        window.location.href = "product-info.html"
                    }, 2000);
                }
                else if (resultObj.status === 'error') {
                    msgToShow = MSG;
                    document.getElementById("alertResult").classList.add('alert-primary');
                }

                msgToShowHTML.innerHTML = msgToShow;
                document.getElementById("alertResult").classList.add("show");
            });
        }
    });
});

let prodID = 0


function agregarPublicacion() {
    const form = document.getElementById("sell-info");
    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries())
    const productsArray = JSON.parse(localStorage.getItem("newProductArray"))
    const productArray = productsArray.find(({ catName }) => catName === data.productCategory)

    data.productCurrency = data.productCurrency.includes("UYU") ? "UYU" : "USD"
    let product = productArray.products.find(({ name, currency, cost, description })  =>
        name === data.productName && currency === data.productCurrency && cost === parseInt(data.productCostInput) && description === data.productDescription
    )

    const images = imgArray.map(({ dataURL }) => dataURL)
    const id = product ? product.id : productArray.length > 0 ? productArray.products[productArray.products.length - 1].id + 1 : Math.floor(Math.random() * (200000 - 100000)) + 100000
    const name = product ? product.name : data.productName
    const currency = product ? product.currency : data.productCurrency
    const cost = product ? product.cost : parseInt(data.productCostInput)
    const description = product ? product.description : data.productDescription
    const soldCount = product ? product.soldCount : 0
    const category = data.productCategory
    const stock = product ? product.stock += parseInt(data.productCountInput) : parseInt(data.productCountInput)
    const image = images[0]
    const product_info = { id, name, currency, cost, description, soldCount, category, images, stock, discount: 0, saleCost: 0, comments: [], relatedProducts: [] }
    product = { id, name, currency, cost, description, soldCount, image, stock, discount: 0, saleCost: 0 }
    productArray.products = productArray.products.filter(({ id }) => id !== product.id)

    prodID = product.id

    const catArray = JSON.parse(localStorage.getItem("categoriesArray"))
    const cat = catArray.find(({ name }) => name === productArray.catName)
    cat.productCount = parseInt(cat.productCount) + 1

    if (comissionPercentage >= PREMIUM) {
        productArray.products.unshift(product)
        cat.imgSrc = images[0]
    }
    else productArray.products.push(product)

    localStorage.setItem("newProductArray", JSON.stringify(productsArray))
    localStorage.setItem(`pInfo-${product_info.id}`, JSON.stringify(product_info))
    localStorage.setItem("categoriesArray", JSON.stringify(catArray))
}
