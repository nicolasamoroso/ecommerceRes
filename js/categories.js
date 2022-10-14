const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_BY_PROD_COUNT_MAX = "Cant. max";
const ORDER_BY_PROD_COUNT_MIN = "Cant. min";
let currentCategoriesArray = [];
let currentSortCriteria = undefined;
let minCount = undefined;
let maxCount = undefined;
let ya_lo_hice = false;

let arrayOfProducts = []

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

function setCatID(id) {
    localStorage.setItem("catID", id);
    window.location = "products.html"
}

function showCategoriesList(currentCategoriesArray){

    if (currentCategoriesArray.length === 0) {
        document.getElementById("subtitle-category").innerHTML = "No hay categorías para este sitio.</p>"
        document.getElementById("catList").innerHTML = "";
    }
    else {
        document.getElementById("subtitle-category").innerText = "Verás aquí todas las categorías del sitio."
        
        let htmlContentToAppend = "";
        for(let i = 0; i < currentCategoriesArray.length; i++){
            let category = currentCategoriesArray[i];
            if (((minCount == undefined) || (minCount != undefined && parseInt(category.productCount) >= minCount)) &&
                ((maxCount == undefined) || (maxCount != undefined && parseInt(category.productCount) <= maxCount))){

                htmlContentToAppend += `
                <div class="col-12 col-sm-6 col-md-6 col-lg-4" onclick="setCatID(${category.id})">
                    <div class="card cursor-active">
                        <img src="${category.imgSrc}" alt="${category.description}" class="imgCategories">
                        <div class="card-body">
                            <h4>${category.name}</h4>
                            <p>${category.description}</p>
                        </div>
                        <div class="card-footer">
                            <small class="text-muted">${category.productCount} artículos</small> 
                        </div>
                    </div>
                </div>
                `
            }
        }
        document.getElementById("catList").innerHTML = htmlContentToAppend;
    }
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

    await getJSONData(CATEGORIES_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            currentCategoriesArray = resultObj.data

            const start = JSON.parse(localStorage.getItem("productStart"));
            const end = JSON.parse(localStorage.getItem("productEnd"));
            if (start || end) {
                const concatCat = start.concat(end).filter((item) => item !== null);
                if (concatCat) {
                    currentCategoriesArray.forEach((cat) => {
                        const existe = concatCat.filter(({category, percentage}) =>
                            category === cat.name &&
                            percentage === GOLD);
                        if (existe && existe.length > 0) 
                            cat.imgSrc = existe[0].image[0].dataURL
                        const pCount = concatCat.filter(element => element.category === cat.name);
                        if (pCount.length > 0) 
                            cat.productCount = pCount.length + parseInt(cat.productCount);
                    });
                }
            }
            
            showCategoriesList(currentCategoriesArray)
            //sortAndShowCategories(ORDER_ASC_BY_NAME, resultObj.data);
        }
    });

    for (let i = 0; i < currentCategoriesArray.length; i++) {
        const element = currentCategoriesArray[i]
        const product = await getJSONData(PRODUCTS_URL + element.id + EXT_TYPE)
        if (product.status === "ok") {
            const productArray = product.data
            if (productArray.products.length > 0) arrayOfProducts = arrayOfProducts.concat(productArray.products)
        }
    }


    showTopSaleProducts()
    
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

    function rangeFilterCount() {
        const min = document.getElementById("rangeFilterCountMin") ? document.getElementById("rangeFilterCountMin").value : document.getElementById("rangeFilterCountMinRes").value
        const max = document.getElementById("rangeFilterCountMax") ? document.getElementById("rangeFilterCountMax").value : document.getElementById("rangeFilterCountMaxRes").value
        
        if (min > max) return alert("El valor mínimo no puede ser mayor al valor máximo.")

        minCount = min;
        maxCount = max;
    
        if ((min != undefined) && (min != "") && (parseInt(min)) >= 0) 
            minCount = parseInt(min);
        else 
            minCount = undefined;
    
        if ((max != undefined) && (max != "") && (parseInt(max)) >= 0)
            maxCount = parseInt(max);
        else
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
    const filteredCategoriesArray = currentCategoriesArray.filter(category => {
        return category.name.toLowerCase().includes(searchString.toLowerCase()) || 
        category.description.toLowerCase().includes(searchString.toLowerCase()) ||
        category.productCount.toString().includes(searchString);
    })
    showCategoriesList(filteredCategoriesArray);
    if (filteredCategoriesArray.length === 0) {
        document.getElementById("subtitle-category").innerHTML = `
        <p class="lead">No hay categorías que coincidan con tu búsqueda.</p>
        `
        document.getElementById("cat-list-container").innerHTML = "";
    }
})


function X() {
    var searchString = searchBar.value;
    if (searchString.length === 0) {
        showCategoriesList(currentCategoriesArray);
    }
}

function showTopSaleProducts() {
    const topSaleProducts = arrayOfProducts
                            .filter(product => product.soldCount > 5)
                            .sort((a, b) => b.soldCount - a.soldCount)
                            .slice(0, 10);
    for (let i = 0; i < topSaleProducts.length; i++) {
        let product = topSaleProducts[i];
        document.getElementById("lstTopSale").innerHTML += `
        <a class="col-6 col-sm-4 col-md-12" onclick="productInfo(${product.id})">${product.name}</a>
        `
    }
}