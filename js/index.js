let categoriesArray = []
let newProductArray = []

document.addEventListener("DOMContentLoaded", async () =>{
    if (localStorage.getItem("categoriesArray")) {
        categoriesArray = JSON.parse(localStorage.getItem("categoriesArray"))
        if (localStorage.getItem("newProductArray")) 
            newProductArray = JSON.parse(localStorage.getItem("newProductArray"))
    }
    else {
        const categories = await getJSONData(CATEGORIES_URL)
        if (categories.status === "ok") {
            categoriesArray = categories.data;
            for (let i = 0; i < categoriesArray.length; i++) {
                const element = categoriesArray[i]
                const product = await getJSONData(PRODUCTS_URL + element.id + EXT_TYPE)
                if (product.status === "ok") {
                    const productArray = product.data
                    productArray.products.forEach(element => {
                        element.stock = element.currency === "USD" ? Math.round(40000/element.cost) + 1 : Math.round(40000/element.cost * 23) + 1
                        let discount = Math.round(element.cost/1000) > 100 ? 25 : Math.round(element.cost/1000)
                        element.discount = element.soldCount < 15 ? discount : 0
                        element.saleCost = Math.round(element.cost*100/(100-element.discount))
                    })
                    newProductArray.push(productArray)
                }
            }
            
            localStorage.setItem("categoriesArray", JSON.stringify(categoriesArray))
            localStorage.setItem("newProductArray", JSON.stringify(newProductArray))
        }
    }

    showPopularCategories()
    showSaleProducts()
    showTopSales()
})

function showPopularCategories() {
    categoriesArray.forEach(({name, imgSrc, id}) => {
        document.getElementById("popularCategories").innerHTML += `
        <div class="col-4 col-md-1 col-sm-2 text-center cursor-active imgHoverContainer" onclick="setCatID(${id})">
            <img src="${imgSrc}" class="img-fluid imgCatInIndex">
            <h6 class="popularCat text-break">${name}</h6>
        </div>
        `
    });
}

function showSaleProducts() {
    let salesProducts = []
    newProductArray.forEach(({products}) => { salesProducts.push(products.filter(({soldCount}) => soldCount < 15))})
    salesProducts = salesProducts.flat()
    salesProducts.sort((a, b) => b.soldCount - a.soldCount)

    salesProducts.forEach(({name, cost, currency, image, saleCost, discount, stock, id}) => {
        document.getElementById("sales").innerHTML += `
        <div class="col-6 col-md-4 col-lg-3" onclick="product_info(${id})">
            <div class="mb-4 cursor-active cardSales cardHover">
                <img class="card-img-top" src="${image}">
                <div class="card-body">
                    <h6 class="fw-bold nameProductSale text-break">${name}</h6>
                    <div class="discount">
                        <span class="text-muted text-decoration-line-through">${currency} ${saleCost}</span>
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
    let topSales = []
    newProductArray.forEach(({products}) => {topSales.push(products.filter(({soldCount}) => soldCount > 15))})
    topSales = topSales.flat()
    topSales.sort((a, b) => b.soldCount - a.soldCount)

    topSales.forEach(({name, cost, currency, soldCount, image, id}) => {
        document.getElementById("topSales").innerHTML += `
        <div class="col-6 col-md-4 col-lg-3" onclick="product_info(${id})">
            <div class="mb-4 cursor-active cardSales cardHover">
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