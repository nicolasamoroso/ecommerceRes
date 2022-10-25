const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

const idUser1 = 25801

const LIST_URL = PRODUCTS_URL + localStorage.catID + EXT_TYPE;
const id = localStorage.getItem("product-info")
const P_INFO_URL = PRODUCT_INFO_URL + id + EXT_TYPE;
const P_INFO_COMMENTS_URL = PRODUCT_INFO_COMMENTS_URL + localStorage.getItem("product-info") + EXT_TYPE;
const C_INFO_URL = CART_INFO_URL + idUser1 + EXT_TYPE;

let showSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "none";
}

const getJSONData = async (url) => {
  let result = {};
  showSpinner();
  return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function (response) {
      result.status = 'ok';
      result.data = response;
      hideSpinner();
      return result;
    })
    .catch(function (error) {
      result.status = 'error';
      result.data = error;
      hideSpinner();
      return result;
    });
}

const burger = document.getElementById("btnBurger");
burger.addEventListener("click", function () {
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

function showTopSaleProducts(array) {
  for (let i = 0; i < array.length; i++) {
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
      product.products.forEach(({ id, name, soldCount }) => {
        if (soldCount > 10) {
          document.getElementById(`lstCat-${i}`).innerHTML += `
          <a class="col-6 col-sm-4 col-md-12 text-decoration-underline" onclick="product_info(${id})">${name}</a>
          `
        }
      })
    }
  }
}

const cart = async (cant, product) => {
  let newProduct = {
    name: product.name,
    count: cant,
    unitCost: product.cost,
    currency: product.currency,
    image: product.image ?? product.images[0],
    id: product.id,
    stock: product.stock,
    description: product.description
  }

  let cartArray = []
  if (!localStorage.getItem("cart")) {
    const cartData = await getJSONData(C_INFO_URL)
    if (cartData.status === 'ok') {
      let cart = cartData.data.articles
      cart.forEach(prod => {
        prod.stock = prod.currency === "USD" ? Math.round(40000 / prod.cost) + 1 : Math.round(40000 / prod.cost * 23) + 1
        prod.description = 'El modelo de auto que se sigue renovando y manteniendo su prestigio en comodidad.'
        cartArray.push(prod)
      })
    }
    localStorage.setItem("cart", JSON.stringify(cartArray))
  }
  else {
    cartArray = JSON.parse(localStorage.getItem("cart"))
  }

  let same_product = cartArray.find(product => product.id === newProduct.id)

  if (same_product) {
    if (same_product.count + newProduct.count <= same_product.stock) {
      same_product.count += newProduct.count
      same_product.stock = newProduct.stock
    }
    else {
      addOutOfStockAlert()
      return false
    }
  }
  else {
    cartArray.push(newProduct)
  }

  localStorage.setItem("cart", JSON.stringify(cartArray))
  refreshCountCart()
  return true
}

const cartBtn = async (id, catName) => {
  let array = JSON.parse(localStorage.getItem("newProductArray"))
  let cat = array.find(cat => cat.catName === catName).products
  let pinfo = cat.find(prod => prod.id === id)

  let added = await cart(1, pinfo)
  if (added === true) {
    addToCartAlert('')
    setTimeout(() => {
      window.location = "cart.html"
    }, 1000)
  }
}

function refreshCountCart() {
  document.getElementById("cartLenght").innerText = JSON.parse(localStorage.getItem("cart")) ? JSON.parse(localStorage.getItem("cart")).length : 1 
}

document.addEventListener("DOMContentLoaded", function (e) {
  refreshCountCart()
});

function continueBuying() {
  if (localStorage.getItem("catID")) window.location = "products.html"
  else window.location = "categories.html"
}

function iOS() {
  const ua = navigator.userAgent.toLowerCase(); 
  if (ua.indexOf('safari') != -1) { 
    return ua.indexOf('chrome') > -1 ? false : true;
  }
  return false
}

function addToCartAlert(string) {
  document.getElementById("add-success").innerHTML = `<strong>Producto agregado al carrito!</strong> ${string}`
  document.getElementById("add-success").classList.add("show")
  setTimeout(() => {
    document.getElementById("add-success").classList.remove("show")
  }, 2500);
}

function addOutOfStockAlert() {
  document.getElementById("add-error").innerHTML = `<strong>Superó el límite de stock para este producto!</strong>`
  document.getElementById("add-error").classList.add("show")
  setTimeout(() => {
    document.getElementById("add-error").classList.remove("show")
  }, 2500);
}