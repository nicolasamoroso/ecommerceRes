let id = 0
document.addEventListener("DOMContentLoaded", async () =>{
    let productInfo = {}
    const productInfoArray = await getJSONData(P_INFO_URL);
    if (productInfoArray.status === "ok") {
        productInfo = productInfoArray.data;
        console.log(productInfo);
        // hacer:
        //  el stock puede variar si ya se ha comprado antes
        //  utilizar localstorage para hacerlo
        //  que busque por la id
        productInfo.stock = productInfo.currency === "USD" ? Math.round(40000/productInfo.cost) + 1 : Math.round(40000/productInfo.cost * 23) + 1
        let discount = Math.round(productInfo.cost/1000) > 100 ? 25 : Math.round(productInfo.cost/1000)
        productInfo.discount = productInfo.soldCount < 15 ? discount : 0
        productInfo.saleCost = Math.round(productInfo.cost*100/(100-productInfo.discount))

        if (!localStorage.getItem(`comments-${productInfo.id}`)) {
            console.log("aaaa")
            const productInfoComments = await getJSONData(P_INFO_COMMENTS_URL);
            if (productInfoComments.status === "ok") {
                productInfo.comments = productInfoComments.data;
    
                productInfo.comments.forEach(comment => {
                    comment.img = "img/img_perfil.png"
                })
    
                productInfo.comments.sort((a, b) => {
                    return new Date(b.dateTime) - new Date(a.dateTime);
                });

                localStorage.setItem(`comments-${productInfo.id}`, JSON.stringify(productInfo.comments))
            }
        }
        else {
            productInfo.comments = JSON.parse(localStorage.getItem(`comments-${productInfo.id}`))
        }
    }

    id = productInfo.id

    document.getElementById("categoryName").innerText = productInfo.category
    document.getElementById("productName").innerText = productInfo.name
    detectInterval();

    addResume(productInfo);
    showImagesGallery(productInfo.images);
    addDescription(productInfo.description);
    // showCreditCard(productInfo.cost);
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

/* 
buyRes
addCartRes
buy
addCart

acceptedCreditCardsRes
acceptedCreditCards

rating
comments
profilePic_Comments
*/

function addResume(pInfo) {
    const {name, cost, category, score, stock, currency, soldCount, discount, saleCost} = pInfo

    document.getElementById("nameRes").innerHTML = `
    <small class="text-muted mb-0 d-md-none">${soldCount} vendidos</small>
    <h3 class="d-md-none mb-3">${name}</h3>
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
        <h6 class="card-text">Cantidad: <input type="number" style="width: 30px;" value="1"> (${stock > 1 ? stock + " disponibles" : stock + " disponible"})</h6>
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
        <h6 class="card-text">Cantidad: <input type="number" style="width: 30px;" value="1"> (${stock > 1 ? stock + " disponibles" : stock + " disponible"})</h6>
    </div>
    `
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
                    <button type="button" data-bs-target="#carouselProductIndicators" onclick="setCarouselActiveButton(${i})" data-bs-slide-to="${i}" class="active btn" aria-current="true" aria-label="Slide ${i+1}">
                        <img src="${imageSrc}" class="indicators">
                    </button>
                    `
                }
                else {
                    htmlContentToAppend += `
                    <button type="button" data-bs-target="#carouselProductIndicators" onclick="setCarouselActiveButton(${i})" data-bs-slide-to="${i}" class="btn" aria-current="true" aria-label="Slide ${i+1}">
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

function showRelatedProducts(relatedProducts) {
    let htmlContentToAppend = "";
    let htmlContentToAppend2 = "";
    for (let i = 0; i < relatedProducts.length; i++) {
        let relatedProduct = relatedProducts[i];
        htmlContentToAppend += `
        <div class="card cursor-active cardHover mt-4">
            <img class="bd-placeholder-img card-img-top" src="${relatedProduct.image}">
            <h5 class="m-3 text-center">${relatedProduct.name}</h5>
        </div>
        `
        htmlContentToAppend2 += `
        <div class="col-12 col-sm-6">
            <div class="card cursor-active cardHover mt-4">
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
    const day = date.getDate() <= 9 ? "0" + date.getDate() : date.getDate()
    const month = (date.getMonth() + 1) <= 9 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)
    const year = date.getFullYear()
    const hour = (date.getHours() <= 9) ? "0" + date.getHours() : date.getHours()
    const minute = (date.getMinutes() <= 9) ? "0" + date.getMinutes() : date.getMinutes()
    return `${hour}:${minute} - ${day}/${month}/${year}`
}

function showComments(comments) {
    let htmlContentToAppend = "";
    for (let i = 0; i < comments.length; i++) {
        let comment = comments[i];
        htmlContentToAppend += `
        <hr>
        <div class="d-flex justify-content-between">
        <div class="d-flex gap-2">
            <img id="profilePic_Comments" class="rounded-circle" src="${comment.img}" style="width: 20px; height: 20px;">
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
        for (i; i < starsLength; ++i) stars[i+1].className = starClassInactive
    };
  });
}

executeRating(ratingStars)

function checkScore() {
    let j = 0
    for (let i = 0; i < 5; i++)
        if (ratingStars[i].classList.contains("checked")) j++
    return j
}

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

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
    );
}
  
  

document.getElementById("commentBtn").addEventListener("click", function () {
    const comment = document.getElementById("textAreaComment").value
    document.getElementById("textAreaComment").value = ""
    if(comment !== "") {
        const score = checkScore()
        const dateTime = formatDate(new Date())
        const {user, img} = localStorage.getItem("profile") ? JSON.parse(localStorage.getItem("profile")) : {user: "Anónimo", img: "img/img_perfil.png"}
        
        let commentsArray = localStorage.getItem(`comments-${id}`) ? JSON.parse(localStorage.getItem(`comments-${id}`)) : []
        commentsArray.unshift({user, img, score, description: comment, dateTime})
        localStorage.setItem(`comments-${id}`, JSON.stringify(commentsArray))

        showComments(commentsArray)
    }
})