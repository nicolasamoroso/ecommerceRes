let productsArray = [];
let cat_name = "";
const ORDER_BY_PROD_PRICE_MIN = "$ min";    
const ORDER_BY_PROD_PRICE_MAX = "$ max";
const ORDER_DESC_BY_REL = "Rel.";
let currentSort = undefined;
let minPrice = undefined;
let maxPrice = undefined;
let minPriceRes = undefined;
let maxPriceRes = undefined;
    
document.addEventListener("DOMContentLoaded", async (e) => {
    productsArray = JSON.parse(localStorage.getItem("newProductArray"));

    showTopSaleProducts(productsArray)

    productsArray = productsArray.filter(product => product.catID === parseInt(localStorage.catID))[0]
    cat_name = productsArray.catName
    productsArray = productsArray.products

    showProductsList(productsArray)

    document.getElementById("categoryName").innerText = cat_name;

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
        document.getElementById("rangeFilterPriceMinRes").value = "";
        document.getElementById("rangeFilterPriceMaxRes").value = "";

    
        minPrice = undefined;
        maxPrice = undefined;
        minPriceRes = undefined;
        maxPriceRes = undefined;

        showProductsList(productsArray);
    }
    
    function rangeFilterPrice() {
        const min = document.getElementById("rangeFilterPriceMin").value 
        const max = document.getElementById("rangeFilterPriceMax").value
        const minRes = document.getElementById("rangeFilterPriceMinRes").value
        const maxRes = document.getElementById("rangeFilterPriceMaxRes").value

        minPrice = min
        maxPrice = max
        minPriceRes = minRes
        maxPriceRes = maxRes

        if (((minPrice != undefined) && (minPrice != "") && (parseInt(minPrice)) >= 0) || 
            ((minPriceRes != undefined) && (minPriceRes != "") && (parseInt(minPriceRes)) >= 0)) {

            minPrice = parseInt(minPrice) 
            minPriceRes = parseInt(minPriceRes)
        }
        else {
            minPrice = undefined
            minPriceRes = undefined
        }

        if (((maxPrice != undefined) && (maxPrice != "") && (parseInt(maxPrice)) >= 0) ||
            ((maxPriceRes != undefined) && (maxPriceRes != "") && (parseInt(maxPriceRes)) >= 0)) {
                
            maxPrice = parseInt(maxPrice)
            maxPriceRes = parseInt(maxPriceRes)
        }
        else {
            maxPrice = undefined
            maxPriceRes = undefined
        }

        showProductsList(productsArray)
    }

    document.getElementById("sortRelDesc").addEventListener("click", sortRelDesc)
    document.getElementById("sortByPriceUp").addEventListener("click", sortByPriceUp)
    document.getElementById("sortByPriceDown").addEventListener("click", sortByPriceDown)
    document.getElementById("clearRangeFilter").addEventListener("click", clearRangeFilter)
    document.getElementById("rangeFilterPrice").addEventListener("click", rangeFilterPrice)

    document.getElementById("sortRelDescRes").addEventListener("click", sortRelDesc)
    document.getElementById("sortByPriceUpRes").addEventListener("click", sortByPriceUp)
    document.getElementById("sortByPriceDownRes").addEventListener("click", sortByPriceDown)
    document.getElementById("clearRangeFilterRes").addEventListener("click", clearRangeFilter)
    document.getElementById("rangeFilterPriceRes").addEventListener("click", rangeFilterPrice)

});


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
    if (!productsArray || productsArray.length === 0)
        document.getElementById("product-subtitle").innerHTML = `<h4 class="mb-4 text-muted">No hay productos para la categoría <span class="text-dark">${cat_name}</span></h4>`;
    else {
        document.getElementById("product-subtitle").innerHTML = `<h4 class="mb-4 text-muted">Verás aquí todos los productos de la categoría <span class="text-dark">${cat_name}</span></h4>`;
        productsArray.forEach(({ id, image, description, name, currency, cost, soldCount, saleCost, discount, stock }) => {
            if (((minPrice == undefined) || (minPrice != undefined && parseInt(soldCount) >= minPrice)) &&
                ((maxPrice == undefined) || (maxPrice != undefined && parseInt(soldCount) <= maxPrice)) ||
                ((minPriceRes == undefined) || (minPriceRes != undefined && parseInt(soldCount) >= minPriceRes)) &&
                ((maxPriceRes == undefined) || (maxPriceRes != undefined && parseInt(soldCount) <= maxPriceRes))) {
                document.getElementById("prodList").innerHTML  += `
                <div class="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4 mt-1">
                    <div class="card cursor-active h-100">
                        <button id="buyBtn-${id}" class="col-4 col-xs-3 btn btn-success position-absolute buyBtn" onclick="cartBtn(${id}, cat_name)">Comprar</button>
                        <div class="card-header p-0 m-auto" onclick="product_info(${id})">
                            <span class="badge bg-danger position-absolute prodDiscount">${discount === 0 ? "" : '-' + discount + '%'}</span>
                            <img src="${image}" alt="${description}" class="img-fluid imgProd">
                        </div>
                        <div class="card-body d-flex flex-column justify-content-between cardHover" onclick="product_info(${id})">
                            <div>
                                <h4>${name}</h4>
                                <p>${description}</p>
                            </div>
                            <span class="text-muted text-decoration-line-through">${discount === 0 ? "" : currency + saleCost}</span>
                            <div class="row">
                                <h5 class="col-7 col-xs-9 fw-bold medium">${currency} ${cost}</h5>
                            </div>
                        </div>
                        <div class="card-footer" onclick="product_info(${id})">
                            <small class="text-muted">${soldCount} vendidos</small> 
                        </div>
                    </div>
                </div>
                `
                if (stock <= 0) {
                    document.getElementById(`buyBtn-${id}`).classList.add("disabled");
                }
            }
        });
    }
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
        document.getElementById("prodList").innerHTML = "";
    }

    showProductsList(filteredProductsArray);
    
})