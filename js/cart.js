let typeOfCurrency = "USD"
let cartArray = []
let isMobile = iOS() ? iOSMobile() : navigator.userAgentData.mobile

document.addEventListener('DOMContentLoaded', async () => {
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

  addItemsToCart(cartArray)
  updateTotalCosts(cartArray)
  refreshCountCart()
  checkOutBtn()
})


//Función que agrega los productos al carrito
function addItemsToCart(cartArray) {
  let cartItems = document.getElementById("items")
  cartItems.innerHTML = ""
  for (let i = 0; i < cartArray.length; i++) {
    const { image, name, id, currency, unitCost, count, description } = cartArray[i];
    cartItems.innerHTML += `
    <hr>
    <div class="row">
      <div class="col-12">
        <div class="row">
          <div class="col-4 pe-0 h-100">
            <img src="${image}" alt="${name}" class="img-fluid rounded imgHoverCartProduct"
              onclick="product_info(${id})">
          </div>
          <div class="col-8 flex-column d-flex justify-content-around">
            <div class="row">
              <div class="col-12 col-sm-7 pe-0">
                <h5 class="mb-0 nameHoverCartProduct" onclick="product_info(${id})">${name}</h5>
                <small class="text-muted">${typeOfCurrency} ${verifyCurrency(currency, unitCost, i)}</small>
              </div>
              <div class="col-sm-5 d-flex justify-content-end">
                <h6 class="fw-bold d-none d-sm-block" id="totalPerProduct-${i}">${typeOfCurrency}
                  ${verifyCurrency(currency, unitCost, i) * count}</h6>
              </div>
            </div>
            <p class="d-none d-sm-block mb-0 text-break">${description}</p>
            <small class="fw-bold mb-0 d-sm-none text-end" id="totalPerProductRes-${i}">${typeOfCurrency}
              ${verifyCurrency(currency, unitCost, i) * count}</small>
            <div class="col-11 mx-auto">
              <div class="row d-none d-sm-flex justify-content-center gap-3">
                ${addCountDeleteFavBtns(id, i, count, false)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 d-block d-sm-none mt-3">
        <div class="row justify-content-center">
          ${addCountDeleteFavBtns(id, i, count, true)}
        </div>
      </div>
    </div>
    `
  }
}

//Función onclick para cambiar el estado del "botón" de favoritos
function fav(idProductCart) {
  document.getElementById(`noFav-${idProductCart}`).classList.toggle("d-none")
  document.getElementById(`noFavRes-${idProductCart}`).classList.toggle("d-none")
  document.getElementById(`Fav-${idProductCart}`).classList.toggle("d-none")
  document.getElementById(`FavRes-${idProductCart}`).classList.toggle("d-none")
}

//Función que verifica que tipo de moneda es y convierte sus valores a USD/UYU
function verifyCurrency(currency, unitCost) {
  if (currency === "UYU" && typeOfCurrency === "USD") return `${Math.trunc(unitCost / 42)}`
  else if (currency !== "UYU" && typeOfCurrency === "UYU") return `${Math.trunc(unitCost * 42)}`
  return `${unitCost}`
}

/*
  Función agrega los botones de cantidad, eliminar y favorito.
  Si es mobile, se agrega el botón de cantidad en la parte inferior.
*/
function addCountDeleteFavBtns(id, i, count, res) {
  return `
  <div class="col text-center px-sm-0">
    <div class="countGroup d-flex m-auto" style="height: 28px;">
      <button class="controlGroupMin d-flex align-items-center mx-auto flex-row-reverse" 
        ${isMobile ? 
          `ontouchend="mouseUp()" ontouchstart="mouseDown('negative', ${id})" onclick="removeIfIsMinusThanOne('negative', ${id})"`
          : 
          `onmouseup="mouseUp()" onmousedown="mouseDown('negative', ${id})" onclick="removeIfIsMinusThanOne('negative', ${id})"`
        }
      >-</button>
      ${res ?
        `<label class="counter d-block d-sm-none" id="countProductRes-${i}">${count}</label>`
        :
        `<label class="counter d-none d-sm-block" id="countProduct-${i}">${count}</label>`
      }
      <button class="controlGroupPlus d-flex align-items-center mx-auto" 
        ${isMobile ? 
          `ontouchend="mouseUp()" ontouchstart="mouseDown('positive', ${id})"` 
          : 
          `onmouseup="mouseUp()" onmousedown="mouseDown('positive', ${id})"`
        }
      >+</button>
    </div>
  </div>
  <div class="col px-sm-0" onclick="removeProduct(${id})">
    <div class="deleteGroup d-flex m-auto" style="height: 28px;">
      <button class="deleteBtn d-flex align-items-center justify-content-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" 
        fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
      <path 
        d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"
      />
    </svg>
      </button>
    </div>
  </div>
  <div class="col px-sm-0">
    <div class="favGroup d-flex m-auto" style="height: 28px;" onclick="fav(${id})">
      <button class="favBtn d-flex align-items-center justify-content-center">
        ${res ?
          `<div class="d-block d-sm-none">
            <i class="fa-regular fa-heart" id="noFavRes-${id}"></i>
            <i class="fa-solid fa-heart d-none" id="FavRes-${id}"></i>
          </div>`
          :
          `<div class="d-none d-sm-block">
            <i class="fa-regular fa-heart" id="noFav-${id}"></i>
            <i class="fa-solid fa-heart d-none" id="Fav-${id}"></i>
          </div>`
        }
      </button>
    </div>
  </div>
  `
}

//Función que verifica si el contador es menor a 0, si es así, lo pone en 0.
function removeIfIsMinusThanOne(type, id) {
  const i = cartArray.findIndex(product => product.id === id)
  if (cartArray[i].count < 1 && type === "negative" && !removeProduct(id)) {
    cartArray[i].count = 0
  }
}

function removeProduct(id) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: "El producto se eliminará del carrito!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar!',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire(
        'Eliminado!',
        'El producto ha sido eliminado.',
        'success'
      )

      cartArray = cartArray.filter(product => product.id !== id)
      localStorage.setItem("cart", JSON.stringify(cartArray))
      addItemsToCart(cartArray)
      refreshCountCart()
      updateTotalCosts(cartArray)
      if (cartArray.length === 0) checkOutBtn()
      return true
    }
    else {
      const i = cartArray.findIndex(product => product.id === id)
      if (cartArray[i].count === 0) cartArray[i].count = 1
      document.getElementById(`countProduct-${i}`).textContent = cartArray[i].count
      document.getElementById(`countProductRes-${i}`).textContent = cartArray[i].count
      localStorage.setItem("cart", JSON.stringify(cartArray))
      addItemsToCart(cartArray)
      updateTotalCosts(cartArray)
      return false
    }
  })
}

//Función que habilita o deshabilita el botón de checkout.
function checkOutBtn() {
  if (JSON.parse(localStorage.getItem("cart")).length === 0)
    document.getElementById("checkout").setAttribute("disabled", "true")
  else
    document.getElementById("checkout").removeAttribute("disabled")
}

let startTime = 0
let stepInterval = 1;
let intTime = "500"
let count = 0

//Función que detiene el contador de mouseDown
function mouseUp() { 
  clearTimeout(count)
}

/* Función que aumenta o disminuye el contador de productos en el carrito 
  (si se deja apretado va aumentando o disminuyendo dependiendo del tiempo que transcurrió) 
*/
function mouseDown(type, id) {
  startTime = new Date().getTime()
  const i = cartArray.findIndex(product => product.id === id)

  stepInterval = () => {
    const newTime = new Date().getTime();
    const elapsedTime = newTime - startTime;

    if (elapsedTime < 1000) intTime = updateCount(type, i, 1, "500")
    else if (elapsedTime < 2000) intTime = updateCount(type, i, 2, "250")
    else if (elapsedTime < 3000) intTime = updateCount(type, i, 3, "150")
    else if (elapsedTime < 6000) intTime = updateCount(type, i, 5, "70")
    else if (elapsedTime > 6000) intTime = updateCount(type, i, 10, "40")

    if (cartArray[i].count > cartArray[i].stock) {
      const string = `
        <strong>
          Usted ya tiene el máximo de stock para este producto!
        </strong>
      `
      addOutOfStockAlert(string)
      cartArray[i].count = cartArray[i].stock
    }
    else if (cartArray[i].count < 1) {
      removeProduct(id)
      clearTimeout(count)
      return
    }

    document.getElementById(`countProduct-${i}`).textContent = cartArray[i].count
    document.getElementById(`countProductRes-${i}`).textContent = cartArray[i].count

    localStorage.setItem("cart", JSON.stringify(cartArray))
    updateTotalCosts(cartArray)
    changeProductTotal(cartArray[i].unitCost, cartArray[i].count, i)

    count = setTimeout(stepInterval, intTime);
  }
  stepInterval()
}

//Función que calcula y actualiza la cantidad de un producto
function updateCount(type, i, value, intTime) {
  cartArray[i].count = type === "positive" ?
  cartArray[i].count + value : cartArray[i].count - value
  if (cartArray[i].count < 1) cartArray[i].count = 0
  return intTime
}

//Función que calcula y actualiza el total del resumen de la compra
function changeTotal(type, id) {
  const i = cartArray.findIndex(product => product.id === id)
  let count = type === "positive" ? cartArray[i].count + 1 : cartArray[i].count - 1

  if (count < 1) {
    const removed = removeProduct(id)
    if (!removed) count = 1
  }

  if (cartArray.length !== 0) {
    if (!cartArray[i].stock) cartArray[i].stock = 99
    if (cartArray[i].stock >= count) {
      cartArray[i].count = count
      localStorage.setItem("productBuyArray", JSON.stringify(cartArray))
      document.getElementById(`countProduct-${i}`).textContent = count
      document.getElementById(`countProductRes-${i}`).textContent = count
      updateTotalCosts(cartArray)
      changeProductTotal(cartArray[i].unitCost, count, i)
    }
  }
}

//Función que cambia el total de un producto dependiendo del tipo de moneda y la cantidad
function changeProductTotal(unitCost, count, i) {
  document.getElementById(`totalPerProduct-${i}`).innerText = `
  ${typeOfCurrency} ${verifyCurrency(cartArray[i].currency, unitCost, i) * count}`
  document.getElementById(`totalPerProductRes-${i}`).innerText = `
  ${typeOfCurrency} ${verifyCurrency(cartArray[i].currency, unitCost, i) * count}`
}

let perccentage = 0

//Función que calcula y actualiza el total de la compra
function updateTotalCosts(productA) {
  let subtotal = 0
  for (let i = 0; i < productA.length; i++) {
    const product = productA[i]
    subtotal = subtotal +
      (verifyCurrency(product.currency, product.unitCost) * product.count)
  }
  document.getElementById("subtotal-value").innerHTML = `${typeOfCurrency} ${subtotal}`

  let shipping = 0
  if (perccentage !== 0) shipping = subtotal * perccentage
  document.getElementById("total-value").innerHTML = `
  ${typeOfCurrency} ${Math.round(subtotal + shipping, -1)}
  `

  const credit = document.getElementById("credit")
  if (typeOfCurrency === "USD" && Math.round(subtotal + shipping, -1) >= 10000) {
    if (credit.checked) {
      credit.checked = false
      addDisabledAttribute("creditNumber")
      addDisabledAttribute("cvv")
      addDisabledAttribute("expirationDate")
    }
    credit.setAttribute("disabled", "true")
    credit.classList.add("is-invalid")
  }
  else {
    credit.removeAttribute("disabled")
    credit.classList.remove("is-invalid")
  }
}

//Función que actualiza la variable "typeOfCurrency" y recarga todos los datos
function setTypeOfCurrency(type) {
  typeOfCurrency = type
  addItemsToCart(cartArray)
  updateTotalCosts(cartArray)
}

document.getElementById("usd").addEventListener("click", function() {
  setTypeOfCurrency("USD")
})

document.getElementById("uyu").addEventListener("click", function() {
  setTypeOfCurrency("UYU")
})

/* 
  Función que actualiza el contenido del envio dependiendo del tipo de envio y 
  actualiza el total en el resumen de la compra 
*/
function addPerccentage(perccentageValue, perccentageString) {
  document.getElementById("shipping-value").textContent = perccentageString
  perccentage = perccentageValue
  updateTotalCosts(cartArray)
}

document.getElementById("premium").addEventListener("click", function() {
  addPerccentage(0.15, "15%")
})

document.getElementById("express").addEventListener("click", function() {
  addPerccentage(0.07, "7%")
})

document.getElementById("standard").addEventListener("click", function() {
  addPerccentage(0.05, "5%")
})

document.getElementById("free-shipping").addEventListener("click", function() {
  addPerccentage(0, "Gratis")
})


//Verifica que tipo de resolución tiene el dispositivo, si cambió y si es un dispositivo apple.
window.addEventListener("resize", function() {
  let mobile = iOS() ? iOSMobile() : navigator.userAgentData.mobile
  if (mobile !== isMobile) {
    isMobile = mobile
    addItemsToCart(cartArray)
  }
})

//Función que valida la dirección y habilita el botón de envío si es correcta
function validateAddress() {
  const street = document.getElementById("street").value
  const number = document.getElementById("number").value
  const corner = document.getElementById("corner").value
  if (street.length > 0 && number.length > 3 && corner.length > 0)
    document.getElementById("BtnSigDireccion").removeAttribute("disabled")
  else
    document.getElementById("BtnSigDireccion").setAttribute("disabled", true)
}

//Validación de la dirección
document.querySelectorAll("#street, #number, #corner").forEach(input => {
  input.addEventListener("input", function() {
    if ((input.value.length > 0 && input.id !== "number") || 
        (input.id === "number" && input.value.length > 3)) 
          toggleValidate(input.id, true)
    else 
      toggleValidate(input.id, false)

    validateAddress()
  })
})

//Función que valida el número de tarjeta o el número de cuenta bancaria
function validatePayment() {
  const creditNumber = document.getElementById("creditNumber").value
  const cvv = document.getElementById("cvv").value
  const date = document.getElementById("expirationDate").value

  if (creditNumber.length === 16 && cvv.length === 3 && date.length === 5
    || document.getElementById("bankNumber").value.length === 20)
    document.getElementById("BtnNextPayment").removeAttribute("disabled")
  else
    document.getElementById("BtnNextPayment").setAttribute("disabled", "true")
}

document.getElementById("credit").addEventListener("click", function() {
  document.getElementById("creditNumber").removeAttribute("disabled")
  document.getElementById("cvv").removeAttribute("disabled")
  document.getElementById("expirationDate").removeAttribute("disabled")

  addDisabledAttribute("bankNumber")

  validatePayment()
})

document.getElementById("bank").addEventListener("click", function() {
  document.getElementById("bankNumber").removeAttribute("disabled")

  addDisabledAttribute("creditNumber")
  addDisabledAttribute("cvv")
  addDisabledAttribute("expirationDate")

  validatePayment()
})

//Función que deshabilita un elemento
function addDisabledAttribute(id) {
  const element = document.getElementById(id)
  element.value = ""
  element.setAttribute("disabled", "true")
  element.classList.remove("is-valid")
  element.classList.remove("is-invalid")
}

//Validación de los campos de pago (excepto la fecha de vencimiento)
document.querySelectorAll("#creditNumber, #cvv, #bankNumber").forEach(input => {
  input.addEventListener("input", function() {
    if ((input.id === "creditNumber" && input.value.length === 16) ||
        (input.id === "cvv" && input.value.length === 3) ||
        (input.id === "bankNumber" && input.value.length === 20)) 
          toggleValidate(input.id, true)
    else 
      toggleValidate(input.id, false)

    validatePayment()
  })
})

function validateExpDate(evt) {
  let event = evt || window.event;

  if (event.type === 'paste') {
    key = evt.clipboardData.getData('text/plain');
  } else {
    var key = event.keyCode || event.which;
    key = String.fromCharCode(key);
  }
  let regex = /[0-9]|\./;
  if (!regex.test(key)) {
    event.returnValue = false;
    if (event.preventDefault) event.preventDefault();
  }
}

document.getElementById("expirationDate").addEventListener("keyup", function (e) {
  if (this.value.length === 0) {
    toggleValidate("expirationDate", false)
    validatePayment()
    return
  }
  if (this.value.length > 2 && this.value.indexOf("/") === -1)
    this.value = this.value.slice(0, 2) + '/' 
})

document.getElementById("expirationDate").addEventListener("input", function (e) {
  const date = this.value.split("/")
  if (e.key !== "Backspace") {
    if (date[0] && date[0].length === 2 && date[0] > 12)
      this.value = date[1] ? "12/" + date[1] : "12"

    if (date[1] && date[1].length === 2) {
      if (date[1] > 99) this.value = date[0] + "/99"
      else if (date[1] < 22) this.value = date[0] + "/22"
    }
  }

  if (this.value.length === 3 && this.value.indexOf("/") === -1)
    this.value = this.value.slice(0, 2) + '/' + this.value.slice(2);
  else if (this.value.indexOf("/") !== 2)
    this.value = this.value.replace("/", "")
  else if (this.value.length === 5 && !this.value.includes("00"))
    toggleValidate("expirationDate", true)
  else toggleValidate("expirationDate", false)

  validatePayment()
})

document.getElementById("BtnNextPayment").addEventListener("click", resumeOfPurchase)


//Función que muestra el resumen de la compra
function resumeOfPurchase() {
  const dateTime = new Date().toLocaleString()
  const date = parseInt(dateTime.split("/")[0])
  const month = parseInt(dateTime.split("/")[1])
  const day = new Date().getDay()

  const dayOfWeek = {
    0: "Domingo",
    1: "Lunes",
    2: "Martes",
    3: "Miércoles",
    4: "Jueves",
    5: "Viernes",
    6: "Sábado"
  }

  const shipping = {
    0.15: [2, 5],
    0.07: [5, 8],
    0.05: [12, 15],
    0: [0]
  }

  const profileArray = JSON.parse(localStorage.getItem("profile"))
  const profile = profileArray.find(({logged}) => logged === true)
  document.getElementById("purchase").innerHTML = `
  <p class="mb-0 fw-bold">Total a pagar: <span
    class="fw-normal">${document.getElementById("total-value").innerText}</span></p>
  <p class="mb-0 fw-bold">Forma de pago: 
    <span
      class="fw-normal">${document.getElementById("creditNumber").value.length > 0 ?
      'Tarjeta de crédito' : 'Transferencia bancaria'}
    </span>
  </p>
  <p class="mb-0 fw-bold">Correo del comprador: 
    <span class="fw-normal">${profile.email}</span>
  </p>
  <p class="mb-0">${dayOfArrival(dayOfWeek, shipping, day, date, month)}</p>
  `
}

//Función que calcula el día de llegada del producto
function dayOfArrival(dayOfWeek, shipping, day, date, month) {
  if (shipping[perccentage][0] === 0)
    return `Su compra se puede retirar en el local a las 12:00hs del ${dayOfWeek[day + 1 > 6 ? 0 : day + 1]}`

  function checkDate(date, month) {
    if (month === 2 && date > 28) {
      date = date - 28
      month++
    }
    else if ((month === 4 || month === 6 || month === 9 || month === 11) && date > 30) {
      date = date - 30
      month++
    }
    else if (date > 31) {
      date = date - 31
      month++
    }
    return { date, month }
  }
  let newDate0 = checkDate(date + shipping[perccentage][0], month)
  let newDate1 = checkDate(date + shipping[perccentage][1], month)
  let newDay0 = new Date(`${newDate0.month}/${newDate0.date}/2022`).getDay()
  let newDay1 = new Date(`${newDate1.month}/${newDate1.date}/2022`).getDay()
  return `Su compra llegará entre los días 
  ${dayOfWeek[newDay0]} ${newDate0.date} y ${dayOfWeek[newDay1]} ${newDate1.date}`
}

/*
  Función que actualiza la cantidad de vendidos y del stock de cada producto y
  borra todos los datos del localStorage "cart" 
*/
document.getElementById("buy").addEventListener("click", function() {
  document.getElementById("buy").setAttribute("disabled", "true")
  document.getElementById("buy").innerHTML = "Procesando..."

  let productsArray = JSON.parse(localStorage.getItem("newProductArray"))
  for (let i = 0; i < productsArray.length; i++) {
    const element = productsArray[i].products;
    for (let j = 0; j < element.length; j++) {
      const element2 = element[j];
      const cartArrayID = cartArray.find(({id}) => id === element2.id)
      if (cartArrayID) {
        element2.stock = element2.stock - cartArrayID.count
        element2.soldCount = element2.soldCount + cartArrayID.count

        const { stock, soldCount } = element2
        localStorage.setItem(`stock_soldCount_pInfo-${element2.id}`, JSON.stringify({ stock, soldCount }))
      }
    } 
  }
  localStorage.setItem("newProductArray", JSON.stringify(productsArray))


  cartArray = []
  localStorage.setItem("cart", JSON.stringify(cartArray))

  addItemsToCart(cartArray)
  refreshCountCart()
  updateTotalCosts(cartArray)
  checkOutBtn()

  document.getElementById("success-alert").classList.add("show")
  setTimeout(function () {
    document.getElementById("success-alert").classList.remove("show")
  }, 2500) 
})