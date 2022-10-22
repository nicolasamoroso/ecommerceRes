const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

const LIST_URL = PRODUCTS_URL + localStorage.catID + EXT_TYPE;
const id = localStorage.getItem("product-info")
const P_INFO_URL = PRODUCT_INFO_URL + id + EXT_TYPE;
const P_INFO_COMMENTS_URL = PRODUCT_INFO_COMMENTS_URL + localStorage.getItem("product-info") + EXT_TYPE;

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

function product_info(id) {
  if (!id) return
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
          <a class="col-6 col-sm-4 col-md-12 text-decoration-underline" onclick="product_info(${id})">${name}</a>
          `
        }
      })
    }
  }
}

function cart(value, pinfo) {
  let newProduct = { 
    name: pinfo.name,
    count: value,
    unitCost: pinfo.cost,
    currency: pinfo.currency,
    image: pinfo.image ?? pinfo.images[0],
    id: pinfo.id,
    stock: pinfo.stock
  }

  let cart = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : []

  let same_product = cart.find(product => product.id === newProduct.id)

  if (same_product) {
    if (same_product.count + newProduct.count <= same_product.stock) {
      same_product.count += newProduct.count
      same_product.stock = newProduct.stock
    }
    else {
      console.log("valor mayor al stock")
      return false
    }
  }
  else {
    cart.push(newProduct)
  }

  localStorage.setItem("cart", JSON.stringify(cart))
  return true
}

function cartBtn(id, catName) {
  let array = JSON.parse(localStorage.getItem("newProductArray"))
  let cat = array.find(cat => cat.catName === catName).products
  let pinfo = cat.find(prod => prod.id === id)

  let added = cart(1, pinfo)
  if (added) 
    window.location = "cart.html"
  else 
    console.log("valor mayor al stock")
}