let productsArray = [];
let cat_name = "";
const ORDER_BY_PROD_PRICE_MIN = "$ min";    
const ORDER_BY_PROD_PRICE_MAX = "$ max";
const ORDER_DESC_BY_REL = "Rel.";
let currentSort = undefined;
let minPrice = undefined;
let maxPrice = undefined;
    
document.addEventListener("DOMContentLoaded", async (e) => {

    productsArray = JSON.parse(localStorage.getItem("newProductArray"));
    cat_name = parseInt(localStorage.catID)

    productsArray = productsArray.filter(product => product.catID === parseInt(localStorage.catID))[0].products

    showProductsList(productsArray)

    function sortRelDesc() {
        sortAndShowProducts(ORDER_DESC_BY_REL);
        changeColor("desc", "price-up", "price-down");
    }
    
    function sortByPriceDown() {
        sortAndShowProducts(ORDER_BY_PROD_PRICE_MAX);
        changeColor("price-down", "desc", "price-up");
    }

    function sortByPriceUp() {
        sortAndShowProducts(ORDER_BY_PROD_PRICE_MIN);
        changeColor("price-up", "price-down", "desc");
    }

    function clearRangeFilter() {
        document.getElementById("rangeFilterPriceMin").value = "";
        document.getElementById("rangeFilterPriceMax").value = "";
    
        minPrice = undefined;
        maxPrice = undefined;

        showProductsList(productsArray);
    }
    
    function rangeFilterCount() {
        const min = document.getElementById("rangeFilterPriceMin") ? document.getElementById("rangeFilterPriceMin").value : document.getElementById("rangeFilterPriceMinRes").value
        const max = document.getElementById("rangeFilterPriceMax") ? document.getElementById("rangeFilterPriceMax").value : document.getElementById("rangeFilterPriceMaxRes").value

        minPrice = min
        maxPrice = max
    
        if ((minPrice != undefined) && (minPrice != "") && (parseInt(minPrice)) >= 0)
            minPrice = parseInt(minPrice) 
        else
            minPrice = undefined

        if ((maxPrice != undefined) && (maxPrice != "") && (parseInt(maxPrice)) >= 0)
            maxPrice = parseInt(maxPrice)
        else
            maxPrice = undefined

        showProductsList(productsArray)
    }

    document.getElementById("sortRelDesc").addEventListener("click", sortRelDesc)
    document.getElementById("sortByPriceUp").addEventListener("click", sortByPriceUp)
    document.getElementById("sortByPriceDown").addEventListener("click", sortByPriceDown)
    document.getElementById("clearRangeFilter").addEventListener("click", clearRangeFilter)
    document.getElementById("rangeFilterPrice").addEventListener("click", rangeFilterCount)

    document.getElementById("sortRelDescRes").addEventListener("click", sortRelDesc)
    document.getElementById("sortByPriceUpRes").addEventListener("click", sortByPriceUp)
    document.getElementById("sortByPriceDownRes").addEventListener("click", sortByPriceDown)
    document.getElementById("clearRangeFilterRes").addEventListener("click", clearRangeFilter)
    document.getElementById("rangeFilterPriceRes").addEventListener("click", rangeFilterCount)


    //guarda la ubicación actual por si llega a ir a un lugar no permitido.
    const location = window.location.href;
    localStorage.setItem("prev_location", JSON.stringify(location));
});

//cambia el background color de los botones que ordenan los productos
function changeColor(a, b, c) {
    document.getElementById(a).classList.remove("bg-sort");
    document.getElementById(a).classList.add("bg-sort-active");
    if (document.getElementById(b).classList.contains("bg-sort-active")) {
        document.getElementById(b).classList.remove("bg-sort-active");
        document.getElementById(b).classList.add("bg-sort");
    }
    if (document.getElementById(c).classList.contains("bg-sort-active")) {
        document.getElementById(c).classList.remove("bg-sort-active");
        document.getElementById(c).classList.add("bg-sort");
    }
}

function showProductsList(productsArray) {
    let htmlContentToAppend = "";
    if (!productsArray || productsArray.length === 0)
        document.getElementById("product-subtitle").innerHTML = `<h4 class="mb-4 text-muted">No hay productos para la categoría <span class="text-dark">${productsArray.catName}</span></h4>`;
    else {
        document.getElementById("product-subtitle").innerHTML = `<h4 class="mb-4 text-muted">Verás aquí todos los productos de la categoría <span class="text-dark">${productsArray.catName}</span></h4>`;
        productsArray.forEach(({id, image, description, name, currency, cost, soldCount, saleCost, discount}) => {
            if (((minPrice == undefined) || (minPrice != undefined && parseInt(soldCount) >= minPrice)) &&
                ((maxPrice == undefined) || (maxPrice != undefined && parseInt(soldCount) <= maxPrice))) {
                htmlContentToAppend += `
                <div class="col-12 col-sm-6 col-md-6 col-lg-4">
                    <div class="card cursor-active h-100">
                        <button class="col-4 col-xs-3 btn btn-success position-absolute buyBtn" onclick="buy(${id})">Comprar</button>
                        <div class="card-header p-0 m-auto" onclick="productInfo(${id})">
                            <span class="badge bg-danger position-absolute prodDiscount">${discount === 0 ? "" : '-' + discount + '%'}</span>
                            <img src="${image}" alt="${description}" class="img-fluid">
                        </div>
                        <div class="card-body d-flex flex-column justify-content-between cardHover" onclick="productInfo(${id})">
                            <div>
                                <h4>${name}</h4>
                                <p>${description}</p>
                            </div>
                            <span class="text-muted text-decoration-line-through">${discount === 0 ? "" : currency + saleCost}</span>
                            <div class="row">
                                <h5 class="col-7 col-xs-9 fw-bold medium">${currency} ${cost}</h5>
                            </div>
                        </div>
                        <div class="card-footer" onclick="productInfo(${id})">
                            <small class="text-muted">${soldCount} vendidos</small> 
                        </div>
                    </div>
                </div>
                `
            }
        });
    }
    document.getElementById("prodList").innerHTML = htmlContentToAppend;
}

function sortProducts(criteria, array){
    let result = [];
    if (criteria === ORDER_DESC_BY_REL) {
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.soldCount);
            let bCount = parseInt(b.soldCount);

            if ( aCount > bCount ){ return -1; }
            if ( aCount < bCount ){ return 1; }
            return 0;
        });
    }
    else if (criteria === ORDER_BY_PROD_PRICE_MAX) {
        result = array.sort(function(a, b) {
            let aCost = parseInt(a.cost);
            let bCost = parseInt(b.cost);

            if ( aCost > bCost ){ return -1; }
            if ( aCost < bCost ){ return 1; }
            return 0;
        });
    }
    else if(criteria === ORDER_BY_PROD_PRICE_MIN) {
        result = array.sort(function(a, b) {
            let aCost = parseInt(a.cost);
            let bCost = parseInt(b.cost);

            if ( aCost < bCost ){ return -1; }
            if ( aCost > bCost ){ return 1; }
            return 0;
        });
    }

    return result;
}

function sortAndShowProducts(sort, productArray){

    currentSort = sort;
    
    if(productArray != undefined)
        productsArray = productArray;

    productsArray = sortProducts(currentSort, productsArray);

    showProductsList(productsArray);
}


document.getElementById("searchBar").addEventListener("keyup", (e) => {

    const searchString = e.target.value;
    const filteredProductsArray = productsArray.filter(product => {
        return product.name.toLowerCase().includes(searchString.toLowerCase()) || 
               product.description.toLowerCase().includes(searchString.toLowerCase()) ||
               product.currency.toLowerCase().includes(searchString.toLowerCase()) ||
               product.cost.toString().includes(searchString)
    })

    if (filteredProductsArray.length === 0) {

        document.getElementById("product-subtitle").innerHTML = `
        <h4 class="mb-4 text-muted">
            No hay productos que coincidan con tu búsqueda para la categoría 
            <span class="text-dark">${cat_name}</span>
        </h4>
        `
        document.getElementById("product-list-container").innerHTML = "";
    }

    showProductsList(filteredProductsArray);
    
})

function X() {
    var searchString = document.getElementById("searchBar").value;
    if (searchString.length === 0) {
        showProductsList(productsArray);
    }
}
