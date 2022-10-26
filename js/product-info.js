let productInfo = {}
let count_value = 1


/* 

FALTA:

acceptedCreditCardsRes
acceptedCreditCards

cambiar los console log por alertas o textos por debajo

que el stock cambie en el localstorage si el producto fue comprado
*/

document.addEventListener("DOMContentLoaded", async () => {
    if (localStorage.getItem(`pInfo-${id}}`)) {
        // Si se entra acá, es porque el stock cambió de dicho producto
    }

    const productInfoArray = await getJSONData(P_INFO_URL);
    if (productInfoArray.status === "ok") {
        productInfo = productInfoArray.data;
        productInfo.stock = productInfo.currency === "USD" ? Math.round(40000 / productInfo.cost) + 1 : Math.round(40000 / productInfo.cost * 23) + 1
        let discount = Math.round(productInfo.cost / 1000) > 100 ? 25 : Math.round(productInfo.cost / 1000)
        productInfo.discount = productInfo.soldCount < 15 ? discount : 0
        productInfo.saleCost = Math.round(productInfo.cost * 100 / (100 - productInfo.discount))

        if (!localStorage.getItem(`comments-${productInfo.id}`)) {
            const productInfoComments = await getJSONData(P_INFO_COMMENTS_URL);
            if (productInfoComments.status === "ok") {
                productInfo.comments = productInfoComments.data;
                if (productInfo.comments.length > 0) {
                    productInfo.comments.forEach(comment => {
                        comment.img = "img/img_perfil.png"
                    })

                    productInfo.comments.sort((a, b) => {
                        return new Date(b.dateTime) - new Date(a.dateTime);
                    });

                    localStorage.setItem(`comments-${productInfo.id}`, JSON.stringify(productInfo.comments))
                }
            }
        }
        else productInfo.comments = JSON.parse(localStorage.getItem(`comments-${productInfo.id}`))
    }

    document.getElementById("categoryName").innerText = productInfo.category
    document.getElementById("productName").innerText = productInfo.name


    detectInterval(); //carousel

    addResume(productInfo);
    showImagesGallery(productInfo.images);
    addDescription(productInfo.description);
    showPaymentMethods(productInfo.currency, productInfo.cost);
    showRelatedProducts(productInfo.relatedProducts);
    showComments(productInfo.comments);
});

function setCarouselActiveButton(index) {
    const buttons = document.querySelectorAll(".c-indicators button");
    buttons.forEach(button => {
        button.classList.remove("active");
    });
    buttons[index].classList.add("active");
}

function detectInterval() {
    const carousel = document.getElementById("carouselProductIndicators");
    carousel.addEventListener('slide.bs.carousel', function (event) {
        setCarouselActiveButton(event.to);
    })
}

function addResume(pInfo) {
    const { name, cost, category, stock, currency, soldCount, discount, saleCost } = pInfo

    document.getElementById("nameRes").innerHTML = `
    <small class="text-muted mb-0 d-md-none">${soldCount} vendidos</small>
    <h3 class="d-md-none mb-3">${name}</h3>
    <hr class="d-md-none">
    `

    document.getElementById("resumeRes").innerHTML = `
    <h4 class="card-text">${currency} ${cost}</h4>
    <h6 class="text-muted text-decoration-line-through">${discount === 0 ? '' : currency + ' ' + saleCost}
        <span class="badge bg-danger position-absolute ms-3">${discount === 0 ? '' : '-' + discount + '%'}</span>
    </h6>
    <div class="row gap-2 mt-3">
        <h5 class="card-text">${category}</h5>
        <h6 class="card-text">Puntuación</h6>
        <h6 class="card-text fw-bold">${stock ? 'Stock disponible' : 'Stock no disponible'}</h6>
        <h6 class="card-text">
            <div class="dropdown d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                    <span class="me-2">Cantidad:</span>
                    <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="countDropdownRes" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
                        1
                    </button>
                    <small class="ms-2">(${stock > 1 ? stock + " disponibles" : stock + " disponible"})</small>
                    <ul class="dropdown-menu" aria-labelledby="countDropdownRes" id="ulCountRes">
                        <div id="lstCountRes">
                        </div>
                        <div id="countInputResDiv">
                        </div>
                    </ul>
                </div>
            </div>
        </h6>
    </div>
    <div class="mt-3">
        <button class="btn btn-primary w-100 fw-bold" onclick="buy()">Comprar ahora</button>
        <button class="btn btn-outline-primary w-100 mt-2 fw-bold" onclick="addToCart()">Agregar al carrito</button>
    </div>
    `

    document.getElementById("resume").innerHTML = `
    <h3 class="d-none d-md-block mb-3">${name}</h3>
    <h4 class="card-text">${currency} ${cost}</h4>
    <h6 class="text-muted text-decoration-line-through">${discount === 0 ? '' : currency + ' ' + saleCost}
        <span class="badge bg-danger position-absolute ms-3">${discount === 0 ? '' : '-' + discount + '%'}</span>
    </h6>
    <div class="row gap-2 mt-3">
        <h5 class="card-text">${category}</h5>
        <h6 class="card-text">Puntuación</h6>
        <h6 class="card-text">${soldCount} vendidos</h6>
        <h6 class="card-text fw-bold">${stock ? 'Stock disponible' : 'Stock no disponible'}</h6>
        <h6 class="card-text">
            <div class="dropdown d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                    <span class="me-2">Cantidad:</span>
                    <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="countDropdown" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
                        1
                    </button>
                    <small class="ms-2 text-break">(${stock > 1 ? stock + " disponibles" : stock + " disponible"})</small>
                    <ul class="dropdown-menu" aria-labelledby="countDropdown" id="ulCount">
                        <div id="lstCount">
                        </div>
                        <div id="countInputDiv">
                        </div>
                    </ul>
                </div>
            </div>
        </h6>
    </div>
    <div class="mt-2">
        <button class="btn btn-primary w-100 fw-bold" onclick="buy()">Comprar ahora</button>
        <button class="btn btn-outline-primary w-100 mt-2 fw-bold" onclick="addToCart()">Agregar al carrito</button>
    </div>
    `

    let length = stock > 5 ? 5 : stock
    let i = 1
    let htmlContentToAppend = ""
    document.getElementById("countInputResDiv").innerHTML = `<li id="countInputRes"></li>`
    document.getElementById("countInputDiv").innerHTML = `<li id="countInput"></li>`
    for (i; i <= length; i++) {
        htmlContentToAppend += `
        <li><a class="dropdown-item cursor-active liNumbers">${i}</a></li>
        `
    }
    document.getElementById("lstCountRes").innerHTML = htmlContentToAppend
    document.getElementById("lstCount").innerHTML = htmlContentToAppend

    if (stock > 5) {
        document.getElementById("lstCountRes").innerHTML += `
        <li><div class="dropdown-item cursor-active" onclick="addInput(${stock})">Más de ${i - 1} unidades</div></li>
        `
        document.getElementById("lstCount").innerHTML += `
        <li><div class="dropdown-item cursor-active" onclick="addInput(${stock})">Más de ${i - 1} unidades</div></li>
        `
    }

    let liNumbers = document.getElementsByClassName("liNumbers")
    for (let i = 0; i < liNumbers.length; i++) {
        liNumbers[i].addEventListener("click", function () {
            const j = parseInt(this.innerText)
            document.getElementById("countDropdown").innerText = j
            document.getElementById("countDropdownRes").innerText = j
            document.getElementById("countInputRes").innerText = ""
            document.getElementById("countInput").innerText = ""
            document.getElementById("ulCountRes").classList.remove("show")
            document.getElementById("ulCount").classList.remove("show")
            document.getElementById("countDropdownRes").classList.remove("show")
            document.getElementById("countDropdown").classList.remove("show")
            count_value = j
            console.log("j = " + count_value)
        })
    }
}

function addInput(stock) {
    document.getElementById("countInputRes").innerHTML = `
    <a class="dropdown-item cursor-active"><input type="number" class="form-control" id="inputCountRes" min="1" max="${stock}" value="5" style="width: 100px;"></a>
    <small class="m-2 text-danger d-none" id="stockInsuficienteRes">No hay stock suficiente</small>
    `
    document.getElementById("countInput").innerHTML = `
    <a class="dropdown-item cursor-active"><input type="number" class="form-control" id="inputCount" min="1" max="${stock}" value="5" style="width: 100px;"></a>
    <small class="m-2 text-danger d-none" id="stockInsuficiente">No hay stock suficiente</small>
    `

    const inputCount = document.getElementById("inputCount")
    const inputCountRes = document.getElementById("inputCountRes")

    document.getElementById("countDropdown").innerText = inputCount.value
    document.getElementById("countDropdownRes").innerText = inputCountRes.value
    count_value = inputCount ? parseInt(inputCount.value) : parseInt(inputCountRes.value)
    console.log("parseInt = " + count_value)

    const cartArray = JSON.parse(localStorage.getItem("cart"))
    let count = 0;
    if (cartArray) {
        cartArray.forEach(element => {
            if (element.id === parseInt(id)) {
                count = element.count
            }
        });
    }

    inputCount.addEventListener("keyup", function (e) {
        let i = parseInt(e.target.value)
        if (i) {
            if (i < 0) {
                document.getElementById("inputCount").value = 1
            }
            else if (i > stock - count) {
                document.getElementById("stockInsuficiente").classList.remove("d-none")
                document.getElementById("inputCount").classList.remove("is-valid")
                document.getElementById("inputCount").classList.add("is-invalid")
            }
            else {
                if (!document.getElementById("stockInsuficiente").classList.contains("d-none")) {
                    document.getElementById("stockInsuficiente").classList.add("d-none")
                }
                document.getElementById("inputCount").classList.remove("is-invalid")
                document.getElementById("inputCount").classList.add("is-valid")
                document.getElementById("countDropdown").innerText = i
                count_value = i
            }
        }
        else {
            document.getElementById("stockInsuficiente").classList.add("d-none")
            document.getElementById("inputCount").classList.remove("is-valid")
            document.getElementById("inputCount").classList.add("is-invalid")
            document.getElementById("countDropdown").innerText = 1
            count_value = 0
        }
        
        console.log("i = " + count_value)

    })

    document.getElementById("inputCountRes").addEventListener("keyup", function (e) {
        let i = parseInt(e.target.value)
        if (i) {
            if (i < 0) {
                document.getElementById("inputCountRes").value = 1
            }
            else if (i > stock - count) {
                document.getElementById("stockInsuficienteRes").classList.remove("d-none")
                document.getElementById("inputCountRes").classList.remove("is-valid")
                document.getElementById("inputCountRes").classList.add("is-invalid")
            }
            else {
                if (!document.getElementById("stockInsuficienteRes").classList.contains("d-none")) {
                    document.getElementById("stockInsuficienteRes").classList.add("d-none")
                }
                document.getElementById("inputCountRes").classList.remove("is-invalid")
                document.getElementById("inputCountRes").classList.add("is-valid")
                document.getElementById("countDropdownRes").innerText = i
                count_value = i
            }
        }
        else {
            document.getElementById("stockInsuficienteRes").classList.add("d-none")
            document.getElementById("inputCountRes").classList.remove("is-valid")
            document.getElementById("inputCountRes").classList.add("is-invalid")
            document.getElementById("countDropdownRes").innerText = 1
            count_value = 0
        }
        
        console.log("i = " + count_value)
    })
}

function showImagesGallery(images) {
    if (images.length > 0) {
        let htmlContentToAppend = "";
        for (let i = 0; i < images.length; i++) {
            let imageSrc = images[i];
            if (i === 0) {
                htmlContentToAppend += `
                <div class="carousel-item active">
                    <img src="${imageSrc}" class="d-block w-100">
                </div>
                `
            } else {
                htmlContentToAppend += `
                <div class="carousel-item">
                    <img src="${imageSrc}" class="d-block w-100">
                </div>
                `
            }
        }
        document.getElementById("carouselImages").innerHTML = htmlContentToAppend;

        if (images.length > 1) {
            htmlContentToAppend = "";
            for (let i = 0; i < images.length; i++) {
                const imageSrc = images[i];
                if (i === 0) {
                    htmlContentToAppend += `
                    <button type="button" data-bs-target="#carouselProductIndicators" 
                        onclick="setCarouselActiveButton(${i})" data-bs-slide-to="${i}" 
                        class="active btn" aria-current="true" aria-label="Slide ${i + 1}">
                            <img src="${imageSrc}" class="indicators">
                    </button>
                    `
                }
                else {
                    htmlContentToAppend += `
                    <button type="button" data-bs-target="#carouselProductIndicators" 
                        onclick="setCarouselActiveButton(${i})" data-bs-slide-to="${i}" 
                        class="btn" aria-current="true" aria-label="Slide ${i + 1}">
                            <img src="${imageSrc}" class="indicators">
                    </button>
                    `
                }
            }
            document.getElementById("imgIndicators").innerHTML = htmlContentToAppend;
        }
    }
}

function addDescription(description) {
    document.getElementById("desc").innerText = description;
}

function showPaymentMethods(currency, cost) {
    if (currency === "USD" && cost > 10000) {
        document.getElementById("creditMethod").classList.add("d-none")
        document.getElementById("creditMethodRes").classList.add("d-none")
        document.getElementById("bankMethodRes").classList.remove("col-6")
        document.getElementById("bankMethodRes").classList.add("col-12")
        document.getElementById("bankMethod").classList.remove("col-6")
        document.getElementById("bankMethod").classList.add("col-12")
    }
}

function showRelatedProducts(relatedProducts) {
    let htmlContentToAppend = "";
    let htmlContentToAppend2 = "";
    for (let i = 0; i < relatedProducts.length; i++) {
        let relatedProduct = relatedProducts[i];
        htmlContentToAppend += `
        <div class="card cursor-active cardHover mt-4" onclick="product_info(${relatedProduct.id})">
            <img class="bd-placeholder-img card-img-top" src="${relatedProduct.image}">
            <h5 class="m-3 text-center">${relatedProduct.name}</h5>
        </div>
        `
        htmlContentToAppend2 += `
        <div class="col-12 col-sm-6">
            <div class="card cursor-active cardHover mt-4" onclick="product_info(${relatedProduct.id})">
                <img class="bd-placeholder-img card-img-top" src="${relatedProduct.image}">
                <h4 class="m-3 text-center">${relatedProduct.name}</h4>
            </div>
        </div>
        `
    }
    document.getElementById("relatedProducts").innerHTML = htmlContentToAppend;
    document.getElementById("relatedProductsRes").innerHTML = htmlContentToAppend2;
}


function ScoreToStars(score) {
    let htmlContentToAppend = ""
    for (i = 1; i <= 5; i++) {
        if (i <= score) htmlContentToAppend += `<i class="fa fa-star checked"></i>`
        else htmlContentToAppend += `<i class="fa fa-star"></i>`
    }
    return htmlContentToAppend
}

function changeDayFormat(date) {
    if (iOS()) {
        return new Date().toLocaleString()
    }
    const day = date.getDate() <= 9 ? "0" + date.getDate() : date.getDate()
    const month = (date.getMonth() + 1) <= 9 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)
    const year = date.getFullYear()
    const hour = (date.getHours() <= 9) ? "0" + date.getHours() : date.getHours()
    const minute = (date.getMinutes() <= 9) ? "0" + date.getMinutes() : date.getMinutes()
    return `${day}/${month}/${year} - ${hour}:${minute}`
}

function showComments(comments) {
    if (comments.length < 1) {
        document.getElementById("commentsTitle").innerText = ""
    }
    let htmlContentToAppend = "";
    for (let i = 0; i < comments.length; i++) {
        let comment = comments[i];
        htmlContentToAppend += `
        <hr>
        <div class="d-flex justify-content-between">
        <div class="d-flex gap-2">
            <img class="rounded-circle" src="${comment.img}" style="width: 20px; height: 20px;">
            <h6>${comment.user}</h6>
        </div>
        <small class="text-muted">${changeDayFormat(new Date(comment.dateTime))}</small>
        </div>
        <div class="ps-4 stars">${ScoreToStars(comment.score)}</div>
        <p class="ps-4 pt-2 text-break">${comment.description}</p>       
        `
    }
    document.getElementById("comments").innerHTML = htmlContentToAppend;
}

const ratingStars = [...document.getElementsByClassName("ratingStar")]

function executeRating(stars) {
    const starClassActive = "ratingStar fa fa-star checked"
    const starClassInactive = "ratingStar fa fa-star"
    const starsLength = stars.length
    let i
    stars.map((star) => {
        star.onclick = () => {
            i = stars.indexOf(star)

            if (star.className === starClassInactive)
                for (i; i >= 0; --i) stars[i].className = starClassActive
            else
                for (i; i < starsLength - 1; ++i) stars[i + 1].className = starClassInactive
        }
    })
}

executeRating(ratingStars)

function checkScore() {
    let j = 0
    for (let i = 0; i < 5; i++)
        if (ratingStars[i].classList.contains("checked")) j++
    return j
}

function padTo2Digits(num) { return num.toString().padStart(2, '0') }

function formatDate(date) {
    return (
        [
            date.getFullYear(),
            padTo2Digits(date.getMonth() + 1),
            padTo2Digits(date.getDate()),
        ].join('-') +
        ' ' +
        [
            padTo2Digits(date.getHours()),
            padTo2Digits(date.getMinutes()),
            padTo2Digits(date.getSeconds()),
        ].join(':')
    )
}

document.getElementById("commentBtn").addEventListener("click", function () {
    const profileArray = JSON.parse(localStorage.getItem("profile"))
    const profileData = profileArray.find(({ logged }) => logged === true)
    const commentArray = JSON.parse(localStorage.getItem(`comments-${id}`))
    const commentData = commentArray.find(({ email }) => email === profileData.email)
    if (!commentData) {
        let id = productInfo.id
        const comment = document.getElementById("textAreaComment").value
        document.getElementById("textAreaComment").value = ""
        if (comment !== "") {
            const score = checkScore()
            const dateTime = formatDate(new Date())
            const user = profileData.name ?? "Anónimo"
            const img = profileData.picture ?? "img/img_perfil.png"
            const newComment = {
                score: score,
                description: comment,
                user: user,
                dateTime: dateTime,
                img: img,
                email: profileData.email
            }
            let commentsArray = localStorage.getItem(`comments-${id}`) ? JSON.parse(localStorage.getItem(`comments-${id}`)) : []
            commentsArray.unshift(newComment)
            localStorage.setItem(`comments-${id}`, JSON.stringify(commentsArray))
            showComments(commentsArray)
        }
    }
    else {
        document.getElementById("comment-alert").innerHTML = `<strong>Ya has comentado este producto!</strong> No puedes comentar más de una vez.`
        document.getElementById("comment-alert").classList.add("show")
        setTimeout(() => {
            document.getElementById("comment-alert").classList.remove("show")
        }, 3000)
    }
})

function addToCart() {
    let value = count_value
    const cartArray = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : {}
    let pinfo = {}
    if (Object.values(cartArray).length > 0) pinfo = cartArray.find((product) => product.id === productInfo.id)
    if (pinfo && Object.values(pinfo).length > 0) value += pinfo.count
    if (value > productInfo.stock) {
        addOutOfStockAlert()
        return false
    }
    else {
        addToCartAlert('Puedes verlo en el carrito de compras.')
        return cart(count_value, productInfo)
    }
}

const buy = async () => {
    let added = await cart(1, productInfo)
    if (added === true) {
        addToCartAlert('')
        setTimeout(() => {
        window.location = "cart.html"
        }, 1000)
    }
}