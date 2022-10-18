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

document.addEventListener("DOMContentLoaded", async () =>{
    let productInfo = {}
    const productInfoArray = await getJSONData(P_INFO_URL);
    if (productInfoArray.status === "ok") {
        productInfo = productInfoArray.data;

        // hacer:
        //  el stock puede variar si ya se ha comprado antes
        //  utilizar localstorage para hacerlo
        //  que busque por la id
        productInfo.stock = productInfo.currency === "USD" ? Math.round(40000/productInfo.cost) + 1 : Math.round(40000/productInfo.cost * 23) + 1
        let discount = Math.round(productInfo.cost/1000) > 100 ? 25 : Math.round(productInfo.cost/1000)
        productInfo.discount = productInfo.soldCount < 15 ? discount : 0
        productInfo.saleCost = Math.round(productInfo.cost*100/(100-productInfo.discount))
        console.log(productInfo)
    }


    document.getElementById("categoryName").innerText = productInfo.category
    document.getElementById("productName").innerText = productInfo.name
    detectInterval();

    addResume(productInfo);
});


/* 
nameRes
resumeRes
resume

carouselProduct

buyRes
addCartRes
buy
addCart

acceptedCreditCardsRes
acceptedCreditCards

rating
comments
profilePic_Comments

relatedProductsRes
relatedProducts

desc

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
        <h6 class="card-text">Cantidad: <input type="number" style="width: 30px;" value="1"> (${stock} disponibles)</h6>
    </div>
    `

    document.getElementById("resume").innerHTML = `

    `
}