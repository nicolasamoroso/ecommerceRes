const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_BY_PROD_COUNT_MAX = "Cant. max";
const ORDER_BY_PROD_COUNT_MIN = "Cant. min";
let currentCategoriesArray = [];
let currentSortCriteria = undefined;
let minCount = undefined;
let maxCount = undefined;
let minCountRes = undefined
let maxCountRes = undefined
let ya_lo_hice = false;

let newProductArray = []

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


function sortCategories(criteria, array){
    let result = [];
    if (criteria === ORDER_ASC_BY_NAME)
    {
        result = array.sort(function(a, b) {
            if ( a.name < b.name ){ return -1; }
            if ( a.name > b.name ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_DESC_BY_NAME){
        result = array.sort(function(a, b) {
            if ( a.name > b.name ){ return -1; }
            if ( a.name < b.name ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_BY_PROD_COUNT_MAX) {
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.productCount);
            let bCount = parseInt(b.productCount);

            if ( aCount > bCount ){ return -1; }
            if ( aCount < bCount ){ return 1; }
            return 0;
        });
        ya_lo_hice = true;
    }
    else if(criteria === ORDER_BY_PROD_COUNT_MIN) {
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.productCount);
            let bCount = parseInt(b.productCount);

            if ( aCount < bCount ){ return -1; }
            if ( aCount > bCount ){ return 1; }
            return 0;
        });
        ya_lo_hice = false;
    }

    return result;
}

function showCategoriesList(currentCategoriesArray){
    let htmlContentToAppend = "";
    if (currentCategoriesArray.length === 0)
        document.getElementById("category-subtitle").innerHTML = "No hay categorías para este sitio.</p>"
    else {
        document.getElementById("category-subtitle").innerText = "Verás aquí todas las categorías del sitio."
        currentCategoriesArray.forEach(({productCount, id, imgSrc, description, name}) => {
            if (((minCount == undefined) || (minCount != undefined && parseInt(productCount) >= minCount)) &&
                ((maxCount == undefined) || (maxCount != undefined && parseInt(productCount) <= maxCount)) ||
                ((minCountRes == undefined) || (minCountRes != undefined && parseInt(productCount) >= minCountRes)) &&
                ((maxCountRes == undefined) || (maxCountRes != undefined && parseInt(productCount) <= maxCountRes))) {

                htmlContentToAppend += `
                <div class="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4 mt-1" onclick="setCatID(${id})">
                    <div class="card cursor-active h-100 cardHover">
                        <div class="card-header p-0 m-auto">
                            <img src="${imgSrc}" alt="${description}" class="img-fluid imgCat">
                        </div>
                        <div class="card-body">
                            <h4>${name}</h4>
                            <p>${description}</p>
                        </div>
                        <div class="card-footer">
                            <small class="text-muted">${productCount} artículos</small> 
                        </div>
                    </div>
                </div>
                `
            }
        });
    }
    document.getElementById("catList").innerHTML = htmlContentToAppend;
}

function sortAndShowCategories(sortCriteria, categoriesArray){
    currentSortCriteria = sortCriteria;

    if(categoriesArray != undefined)
        currentCategoriesArray = categoriesArray

    currentCategoriesArray = sortCategories(currentSortCriteria, currentCategoriesArray);

    //Muestro las categorías ordenadas
    showCategoriesList(currentCategoriesArray);
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
const GOLD = 0.13;
document.addEventListener("DOMContentLoaded", async (e) =>{

    if (localStorage.getItem("categoriesArray")) {
        currentCategoriesArray = JSON.parse(localStorage.getItem("categoriesArray"))
        if (localStorage.getItem("newProductArray")) 
            newProductArray = JSON.parse(localStorage.getItem("newProductArray"))
    }
    else {
        const categories = await getJSONData(CATEGORIES_URL)
        if (categories.status === "ok") {
            currentCategoriesArray = categories.data;
            for (let i = 0; i < currentCategoriesArray.length; i++) {
                const element = currentCategoriesArray[i]
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
            
            localStorage.setItem("categoriesArray", JSON.stringify(currentCategoriesArray))
            localStorage.setItem("newProductArray", JSON.stringify(newProductArray))
        }
    }

    showCategoriesList(currentCategoriesArray)
    showTopSaleProducts(newProductArray)
    
    function sortAsc() {
        sortAndShowCategories(ORDER_ASC_BY_NAME);
        changeColor("asc", "desc", "count");
    }

    function sortDesc() {
        sortAndShowCategories(ORDER_DESC_BY_NAME);
        changeColor("desc", "asc", "count");
    }

    function sortCount() {
        if (!ya_lo_hice) {
            document.getElementById("up-downRes").classList.remove("fa-sort-amount-down")
            document.getElementById("up-downRes").classList.add("fa-sort-amount-up")
            document.getElementById("up-down").classList.remove("fa-sort-amount-down")
            document.getElementById("up-down").classList.add("fa-sort-amount-up")
            sortAndShowCategories(ORDER_BY_PROD_COUNT_MAX);
        }
        else {
            document.getElementById("up-downRes").classList.remove("fa-sort-amount-up")
            document.getElementById("up-downRes").classList.add("fa-sort-amount-down")
            document.getElementById("up-down").classList.remove("fa-sort-amount-up")
            document.getElementById("up-down").classList.add("fa-sort-amount-down")
            sortAndShowCategories(ORDER_BY_PROD_COUNT_MIN);
        }
        changeColor("count", "asc", "desc");
    }

    function clearRangeFilter() {
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";
    
        minCount = undefined
        maxCount = undefined
        minCountRes = undefined
        maxCountRes = undefined
    
        showCategoriesList(currentCategoriesArray);
    }

    function rangeFilterCount() {
        const min = document.getElementById("rangeFilterCountMin").value
        const max = document.getElementById("rangeFilterCountMax").value
        const minRes = document.getElementById("rangeFilterCountMinRes").value
        const maxRes = document.getElementById("rangeFilterCountMaxRes").value
        
        minCount = min;
        maxCount = max;
        minCountRes = minRes;
        maxCountRes = maxRes;
    
        
        if (((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0) || 
            ((minCountRes != undefined) && (minCountRes != "") && (parseInt(minCountRes)) >= 0)) {

            minCount = parseInt(minCount);
            minCountRes = parseInt(minCountRes);
        }
        else {
            minCount = undefined;
            minCountRes = undefined;
        }
    
        if (((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0) ||
            ((maxCountRes != undefined) && (maxCountRes != "") && (parseInt(maxCountRes)) >= 0)) {

            maxCount = parseInt(maxCount);
            maxCountRes = parseInt(maxCountRes);
        }
        else {
            maxCount = undefined;
            maxCountRes = undefined;
        }
    
        showCategoriesList(currentCategoriesArray);
    }
    
    document.getElementById("sortAsc").addEventListener("click", sortAsc);
    document.getElementById("sortDesc").addEventListener("click", sortDesc);
    document.getElementById("sortByCount").addEventListener("click", sortCount);
    document.getElementById("clearRangeFilter").addEventListener("click", clearRangeFilter);
    document.getElementById("rangeFilterCount").addEventListener("click", rangeFilterCount);

    /* responsive buttons */
    document.getElementById("sortAscRes").addEventListener("click", sortAsc);
    document.getElementById("sortDescRes").addEventListener("click", sortDesc);
    document.getElementById("sortByCountRes").addEventListener("click", sortCount);
    document.getElementById("clearRangeFilterRes").addEventListener("click", clearRangeFilter);
    document.getElementById("rangeFilterCountRes").addEventListener("click", rangeFilterCount);

    function sortAsc() {
        sortAndShowCategories(ORDER_ASC_BY_NAME);
        changeColor("asc", "desc", "count");
    }

    function sortDesc() {
        sortAndShowCategories(ORDER_DESC_BY_NAME);
        changeColor("desc", "asc", "count");
    }

    function sortCount() {
        if (!ya_lo_hice) {
            document.getElementById("up-downRes").classList.remove("fa-sort-amount-down")
            document.getElementById("up-downRes").classList.add("fa-sort-amount-up")
            document.getElementById("up-down").classList.remove("fa-sort-amount-down")
            document.getElementById("up-down").classList.add("fa-sort-amount-up")
            sortAndShowCategories(ORDER_BY_PROD_COUNT_MAX);
        }
        else {
            document.getElementById("up-downRes").classList.remove("fa-sort-amount-up")
            document.getElementById("up-downRes").classList.add("fa-sort-amount-down")
            document.getElementById("up-down").classList.remove("fa-sort-amount-up")
            document.getElementById("up-down").classList.add("fa-sort-amount-down")
            sortAndShowCategories(ORDER_BY_PROD_COUNT_MIN);
        }
        changeColor("count", "asc", "desc");
    }

    function clearRangeFilter() {
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";
    
        minCount = undefined;
        maxCount = undefined;
    
        showCategoriesList(currentCategoriesArray);
    }
    
    document.getElementById("sortAsc").addEventListener("click", sortAsc);
    document.getElementById("sortDesc").addEventListener("click", sortDesc);
    document.getElementById("sortByCount").addEventListener("click", sortCount);
    document.getElementById("clearRangeFilter").addEventListener("click", clearRangeFilter);
    document.getElementById("rangeFilterCount").addEventListener("click", rangeFilterCount);

    /* responsive buttons */
    document.getElementById("sortAscRes").addEventListener("click", sortAsc);
    document.getElementById("sortDescRes").addEventListener("click", sortDesc);
    document.getElementById("sortByCountRes").addEventListener("click", sortCount);
    document.getElementById("clearRangeFilterRes").addEventListener("click", clearRangeFilter);
    document.getElementById("rangeFilterCountRes").addEventListener("click", rangeFilterCount);

    const location = window.location.href;
    localStorage.setItem("prev_location", JSON.stringify(location));
});


const searchBar = document.getElementById("searchBar")

searchBar.addEventListener("keyup", (e) => {
    const searchString = e.target.value;
    const filteredCategoriesArray = currentCategoriesArray.filter(category => category.name.toLowerCase().includes(searchString.toLowerCase()) || 
        category.description.toLowerCase().includes(searchString.toLowerCase()) ||
        category.productCount.toString().includes(searchString)
    )
    showCategoriesList(filteredCategoriesArray);
    if (filteredCategoriesArray.length === 0) {
        document.getElementById("category-subtitle").innerHTML = `
        <p class="lead">No hay categorías que coincidan con tu búsqueda.</p>
        `
        document.getElementById("catList").innerHTML = "";
    }
})