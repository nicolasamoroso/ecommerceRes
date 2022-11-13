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
      if (response.ok)
        return response.json();
      else
        throw Error(response.statusText);
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
burger.addEventListener("click", () => {
  burger.classList.contains("active") ? burger.classList.remove("active") : burger.classList.add("active")
})

burger.addEventListener("doubleclick", () => {
  burger.classList.contains("active") ? burger.classList.remove("active") : burger.classList.add("active")
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

//Función que cambia el color de los filtros si están activos
function changeColor(a, b, c) {
  document.getElementById(a).classList.add("bg-sort-active");
  if (document.getElementById(b).classList.contains("bg-sort-active")) 
    document.getElementById(b).classList.remove("bg-sort-active");
  if (document.getElementById(c).classList.contains("bg-sort-active"))
    document.getElementById(c).classList.remove("bg-sort-active");
}

function showTopSaleProducts(array) {
  for (let i = 0; i < array.length; i++) {
    let product = array[i]
    if (product.products.length > 0) {
      document.getElementById("lstTopSale").innerHTML += `
      <div class="mt-3">
        <h2 class="accordion-header" id="btnCat-${i}">
          <button class="accordion-button collapsed p-0" type="button" data-bs-toggle="collapse"
            data-bs-target="#collapseCat-${i}" aria-expanded="false" aria-controls="collapseCat-${i}">
            <i class="fa-solid fa-arrow-down-from-line"></i> <span class="text-muted">${product.catName}</span>
          </button>
        </h2>
        <div class="accordion" id="productCat-${i}">
          <div id="collapseCat-${i}" class="accordion-collapse collapse" aria-labelledby="btnCat-${i}"
            data-bs-parent="#productCat-${i}">
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
  if (cant > product.stock) {
    const string = `
    <strong>
      Superó el límite de stock para este producto!
    </strong>`
    addOutOfStockAlert(string)
    return false
  }
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
        const newProductArray = JSON.parse(localStorage.getItem("newProductArray"))
        if (newProductArray) {
          const productsArray = newProductArray.find(({catID}) => catID === 101) 
          if (productsArray) {
            const product = productsArray.products.find(({id}) => id === prod.id)
            if (product) {
              if (product.stock === 0) return

              prod.count = 1
              prod.stock = product.stock
              prod.description = product.description
              cartArray.push(prod)
            }
          }
        }
      })
    }
    localStorage.setItem("cart", JSON.stringify(cartArray))
  }
  else cartArray = JSON.parse(localStorage.getItem("cart"))

  let same_product = cartArray.find(product => product.id === newProduct.id)

  if (same_product) {
    if (same_product.count + newProduct.count <= same_product.stock) {
      same_product.count += newProduct.count
      same_product.stock = newProduct.stock
    }
    else {
      const string = `
      <strong>
        Usted ya tiene el máximo de stock para este producto en el carrito!
      </strong>`
      addOutOfStockAlert(string)
      return false
    }
  }
  else cartArray.push(newProduct)

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

let catchProfile = {}
document.addEventListener("DOMContentLoaded", () => {
  refreshCountCart()
  addFooter()
  const profile = JSON.parse(localStorage.getItem("profile"))
  
  if (!profile) {
    window.location = "login.html"
    return
  }

  catchProfile = profile.find(({logged}) => logged === true)
  
  if (!catchProfile) {
    window.location = "login.html"
    return
  }

  resizeProfile()
})

function continueBuying() {
  if (localStorage.getItem("catID")) window.location = "products.html"
  else window.location = "categories.html"
}

function iOS() {
  const ua = navigator.userAgent.toLowerCase(); 
  if (ua.indexOf('safari') != -1) return ua.indexOf('chrome') > -1 ? false : true;
  return false
}

function iOSMobile() {
  var iDevices = [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ]

  if (!!navigator.platform) {
    while (iDevices.length) 
      if (navigator.platform === iDevices.pop()) 
        return true;
  }
  return false;
}

function addToCartAlert(string) {
  document.getElementById("add-success").innerHTML = `
    <strong>
      Producto agregado al carrito!
    </strong> 
    ${string}
  `
  document.getElementById("add-success").classList.add("show")
  setTimeout(() => {
    document.getElementById("add-success").classList.remove("show")
  }, 2500);
}

function addOutOfStockAlert(string) {
  document.getElementById("add-error").innerHTML = string
  document.getElementById("add-error").classList.add("show")
  setTimeout(() => {
    document.getElementById("add-error").classList.remove("show")
  }, 2500);
}

function signOut() {
  if (localStorage.getItem("profile")) {
    const profileArray = JSON.parse(localStorage.getItem("profile"))
    const catchProfile = profileArray.find(function({logged}) {
      return logged === true
    })
    if (catchProfile) {
      catchProfile.logged = false
      localStorage.setItem("profile", JSON.stringify(profileArray));
    }
  }
  localStorage.removeItem("cart")
  window.location = "login.html"
}

let resize = false

window.addEventListener("resize", function() {
  if (!resize && window.innerWidth <= 991) {
    resize = true
    resizeProfile()
  }
  else if (resize && window.innerWidth > 991) {
    resize = false
    resizeProfile()
  }
})

function resizeProfile() {
  const pic = catchProfile.picture ?? "img/img_perfil.png"
  const user = catchProfile.username ?? "username"
  if (window.innerWidth <= 991) {
    document.getElementById("username").textContent = user
    document.getElementById("imgUser").src = pic
  }
  else {
    document.getElementById("usernameRes").textContent = user
    document.getElementById("imgUserRes").src = pic
  }
}

function toggleValidate(id, bool) {
  const element = document.getElementById(id)
  if (bool) {
    element.classList.remove("is-invalid")
    element.classList.add("is-valid")
  }
  else {
    element.classList.remove("is-valid")
    element.classList.add("is-invalid")
  }
}

const addFooter = () => {
  document.getElementsByTagName("footer")[0].innerHTML = `
    <hr>
    <div class="container-fluid container-lg">
      <div class="row mb-3">
        <div class="col-6 col-md-4 text-muted">
          <h6 class="text-dark">Categorias</h6>
          <div class="px-2 preFooterList">
            <ul class="list-unstyled">
              <li><a onclick="setCatID(101)">Autos</a></li>
              <li><a onclick="setCatID(102)">Juguetes</a></li>
              <li><a onclick="setCatID(103)">Muebles</a></li>
              <li><a onclick="setCatID(104)">Herramientas</a></li>
              <li><a onclick="setCatID(105)">Computadoras</a></li>
              <li><a onclick="setCatID(106)">Vestimenta</a></li>
              <li><a onclick="setCatID(107)">Electrodomésticos</a></li>
              <li><a onclick="setCatID(108)">Deporte</a></li>
              <li><a onclick="setCatID(109)">Celulares</a></li>
            </ul>
          </div>
        </div>
        <div class="col-6 col-md-4 text-muted px-0 px-md-3">
          <h6 class="text-dark">Lo más vendido</h6>
          <div class="px-2 preFooterList">
            <ul class="list-unstyled">
              <li><a onclick="product_info(50922)">Fiat Way</a></li>
              <li><a onclick="product_info(50923)">Suzuki Celerio</a></li>
              <li><a onclick="product_info(50924)">Peugeot 208</a></li>
              <li><a onclick="product_info(50743)">Play Station 5</a></li>
            </ul>
          </div>
        </div>
        <div class="col-6 col-md-4 text-muted mt-3 mt-md-0">
          <h6 class="text-dark">Información útil</h6>
          <div class="px-2 preFooterList">
            <ul class="list-unstyled">
              <li><a href="/blog.html">Blog</a></li>
              <li><a href="/contact.html">Contacto</a></li>
              <li><a href="/help.html">FAQ</a></li>
            </ul>
          </div>
        </div>
      </div>
      <hr>
      <p class="mb-0 text-muted">Este sitio forma parte de <a href="https://jovenesaprogramar.edu.uy/"
          target="_blank">Jovenes a Programar</a> -
        2022</p>
      <div class="d-flex justify-content-between">
        <p class="text-muted">Clickea <a target="_blank" href="Letra.pdf">aquí</a> para descargar la letra del
          obligatorio.</p>
        <a href="#">Volver arriba</a>
      </div>
    </div>
  `
}
