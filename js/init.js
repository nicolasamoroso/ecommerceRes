const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

const LIST_URL = PRODUCTS_URL + localStorage.catID + EXT_TYPE;
const P_INFO_URL = PRODUCT_INFO_URL + localStorage.getItem("product-info") + EXT_TYPE;


let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

const getJSONData = async (url) =>{
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}

const burger = document.getElementById("btnBurger");
burger.addEventListener("click", function() {
    burger.classList.contains("active") ? burger.classList.remove("active") : burger.classList.add("active");
})

function setCatID(id) {
  localStorage.setItem("catID", id);
  window.location = "products.html"
}

function productInfo(id) {
  localStorage.setItem("product-info", id);
  window.location.href = "product-info.html"    
}

function buy(id) {
  console.log("compre " + id)
}

function showTopSaleProducts(array){
  for(let i = 0; i < array.length; i++){
    let product = array[i]
    if (product.products.length > 0) {
      document.getElementById("lstTopSale").innerHTML += `
      <div class="mt-3">
          <h2 class="accordion-header" id="btnCat-${i}">
              <button class="accordion-button collapsed p-0" type="button" data-bs-toggle="collapse" data-bs-target="#collapseCat-${i}" aria-expanded="false" aria-controls="collapseCat-${i}">
                  <i class="fa-solid fa-arrow-down-from-line"></i> <span class="text-muted">${product.catName}</span>
              </button>
          </h2>
          <div class="accordion" id="productCat-${i}">
              <div id="collapseCat-${i}" class="accordion-collapse collapse" aria-labelledby="btnCat-${i}" data-bs-parent="#productCat-${i}">
                  <div class="accordion-body d-lg-flex flex-lg-column text-muted pb-0">
                      <div class="row" id="lstCat-${i}">
                      </div>
                  </div>
              </div>
          </div>
      </div>
      `
      product.products.forEach(({id, name, soldCount}) => {
        if (soldCount > 10) {
          document.getElementById(`lstCat-${i}`).innerHTML += `
          <a class="col-6 col-sm-4 col-md-12" onclick="productInfo(${id})">${name}</a>
          `
        }
      })
    }
  }
}