let typeOfCurrency = "USD"
let cartArray = []
let isMobile = iOS() ? iOSMobile() : navigator.userAgentData.mobile

document.addEventListener('DOMContentLoaded', async () => {
  if (!localStorage.getItem("cart")) {
    const cartData = await getJSONData(C_INFO_URL)
    if (cartData.status === 'ok') {
      let cart = cartData.data.articles
      cart.forEach(prod => {
        prod.count = 1
        prod.stock = prod.currency === "USD" ? Math.round(40000 / prod.unitCost) + 1 : Math.round(40000 / prod.unitCost * 23) + 1
        prod.description = 'El modelo de auto que se sigue renovando y manteniendo su prestigio en comodidad.'
        cartArray.push(prod)
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

function fav(idProductCart) {
  document.getElementById(`noFav-${idProductCart}`).classList.toggle("d-none")
  document.getElementById(`noFavRes-${idProductCart}`).classList.toggle("d-none")
  document.getElementById(`Fav-${idProductCart}`).classList.toggle("d-none")
  document.getElementById(`FavRes-${idProductCart}`).classList.toggle("d-none")
}

function verifyCurrency(currency, unitCost) {
  if (currency === "UYU" && typeOfCurrency === "USD") return `${Math.trunc(unitCost / 42)}`
  else if (typeOfCurrency === "UYU") return `${Math.trunc(unitCost * 42)}`
  return `${unitCost}`
}

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
      cartArray[i].count = 1
      document.getElementById(`countProduct-${i}`).textContent = cartArray[i].count
      document.getElementById(`countProductRes-${i}`).textContent = cartArray[i].count
      localStorage.setItem("cart", JSON.stringify(cartArray))
      addItemsToCart(cartArray)
      return false
    }
  })
}

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

function mouseUp() { clearTimeout(count) }

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

    // if (cartArray[i].count < 1) cartArray[i].count = 1
    if (cartArray[i].count > cartArray[i].stock) {
      addOutOfStockAlert()
      cartArray[i].count = cartArray[i].stock
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

function updateCount(type, i, value, intTime) {
  cartArray[i].count = type === "positive" ? 
  cartArray[i].count + value : cartArray[i].count - value
  return intTime
}

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

function changeProductTotal(unitCost, count, i) {
  document.getElementById(`totalPerProduct-${i}`).innerText = `
  ${typeOfCurrency} ${verifyCurrency(cartArray[i].currency, unitCost, i) * count}`
  document.getElementById(`totalPerProductRes-${i}`).innerText = `
  ${typeOfCurrency} ${verifyCurrency(cartArray[i].currency, unitCost, i) * count}`
}

let perccentage = 0
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

window.addEventListener("resize", function() {
  let mobile = iOS() ? iOSMobile() : navigator.userAgentData.mobile
  if (mobile !== isMobile) {
    isMobile = mobile
    addItemsToCart(cartArray)
  }
})

document.getElementById("street").addEventListener("input", function() {
  if (this.value.length > 0) toggleValidate("street", true)
  else toggleValidate("street", false)

  validateAddress()
})

document.getElementById("number").addEventListener("input", function() {
  if (this.value.length > 3) toggleValidate("number", true)
  else toggleValidate("number", false)

  validateAddress()
})

document.getElementById("corner").addEventListener("input", function() {
  if (this.value.length > 0) toggleValidate("corner", true)
  else toggleValidate("corner", false)

  validateAddress()
})

function validateAddress() {
  const street = document.getElementById("street").value
  const number = document.getElementById("number").value
  const corner = document.getElementById("corner").value
  if (street.length > 0 && number.length > 3 && corner.length > 0)
    document.getElementById("BtnSigDireccion").removeAttribute("disabled")
  else
    document.getElementById("BtnSigDireccion").setAttribute("disabled", true)
}

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

function addDisabledAttribute(id) {
  const element = document.getElementById(id)
  element.value = ""
  element.setAttribute("disabled", "true")
  element.classList.remove("is-valid")
  element.classList.remove("is-invalid")
}

document.getElementById("creditNumber").addEventListener("input", function() {
  if (this.value.length === 16) toggleValidate("creditNumber", true)
  else toggleValidate("creditNumber", false)
  validatePayment()
})

document.getElementById("cvv").addEventListener("input", function() {
  if (this.value.length === 3) toggleValidate("cvv", true)
  else toggleValidate("cvv", false)
  validatePayment()
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

document.getElementById("bankNumber").addEventListener("input", function() {
  if (this.value.length === 20) toggleValidate("bankNumber", true)
  else toggleValidate("bankNumber", false)

  validatePayment()
})

document.getElementById("BtnNextPayment").addEventListener("click", function() {
  resumeOfPurchase()
})

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
    <span class="fw-normal">example@mail.com</span>
  </p>
  <p class="mb-0">${dayOfArrival(dayOfWeek, shipping, day, date, month)}</p>
  `
}

function dayOfArrival(dayOfWeek, shipping, day, date, month) {
  if (shipping[perccentage][0] === 0)
    return `Su compra se puede retirar en el local a las 12:00hs del ${dayOfWeek[day + 1]}`

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

document.getElementById("buy").addEventListener("click", function() {
  document.getElementById("buy").setAttribute("disabled", "true")
  document.getElementById("buy").innerHTML = "Procesando..."

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