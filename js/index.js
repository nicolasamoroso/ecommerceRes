let categoriesArray = []
let arrayOfProducts = []

document.addEventListener("DOMContentLoaded", async () =>{
    const categories = await getJSONData(CATEGORIES_URL)
    if (categories.status === "ok") {
        categoriesArray = categories.data;
        for (let i = 0; i < categoriesArray.length; i++) {
            const element = categoriesArray[i]
            const product = await getJSONData(PRODUCTS_URL + element.id + EXT_TYPE)
            if (product.status === "ok") {
                const productArray = product.data
                if (productArray.products.length > 0) arrayOfProducts = arrayOfProducts.concat(productArray.products)
            }
        }
    }

    showPopularCategories()
    showSaleProducts()
    showTopSales()
})

function showPopularCategories() {
    categoriesArray.forEach(({name, imgSrc}) => {
        document.getElementById("popularCategories").innerHTML += `
        <div class="col-4 col-md-1 col-sm-2 text-center">
            <img src="${imgSrc}" class="img-fluid imgCatInIndex">
            <h6 class="popularCat text-break">${name}</h6>
        </div>
        `
    });
}

function showSaleProducts() {
    let topNotSales = arrayOfProducts.filter(({soldCount}) => soldCount < 15).sort((a, b) => b.soldCount - a.soldCount)
    topNotSales.forEach(({name, cost, currency, image}) => {
        let stock = Math.round(40000/cost) + 1
        if (currency === "UYU") stock *= 23
        let discount = Math.round(cost/100)
        if (discount > 100) discount = 25
        if (discount < 10) discount = 10
        document.getElementById("sales").innerHTML += `
        <div class="col-6 col-md-4 col-lg-3">
            <div class="mb-4 cursor-active cardSales">
                <img class="card-img-top" src="${image}">
                <div class="card-body">
                    <h6 class="fw-bold nameProductSale text-break">${name}</h6>
                    <div class="discount">
                        <small class="text-muted text-decoration-line-through">${currency} ${Math.round(cost*100/(100-discount))}</small>
                        <span class="badge bg-danger saleDiscount">-${discount}%</span>
                    </div>
                    <p class="mb-0 priceSales">${currency} ${cost}</p>
                    <small class="stockAvailable text-muted">${stock} en stock</small>
                </div>
            </div>
        </div>
        `
    })
}

function showTopSales() {
    let topSales = arrayOfProducts.filter(({soldCount}) => soldCount > 15).sort((a, b) => b.soldCount - a.soldCount)

    topSales.forEach(({name, cost, currency, soldCount, image}) => {
        document.getElementById("topSales").innerHTML += `
        <div class="col-6 col-md-4 col-lg-3">
            <div class="mb-4 cursor-active cardSales">
                <img class="card-img-top" src="${image}">
                <div class="card-body">
                    <h6 class="fw-bold nameProductSale text-break">${name}</h6>
                    <p class="mb-0 priceSales">${currency} ${cost}</p>
                    <small class="stockAvailable text-muted">${soldCount} vendidos</small>
                </div>
            </div>
        </div>
        `
    })
}