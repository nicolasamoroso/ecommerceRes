let typeOfCurrency = "USD"
let cartArray = []
let isMobile =  iOS() ? iOSMobile() : false
// if isMobile === true, if (is Mobile Safari)
function iOSMobile() {
  var iDevices = [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ];
  if (!!navigator.platform) {
    while (iDevices.length) {
      if (navigator.platform === iDevices.pop()){ return true; }
    }
  }
  return false;
}

console.log(iOSMobile())

document.addEventListener('DOMContentLoaded', async () => {
  if (!localStorage.getItem("cart")) {
    const cartData = await getJSONData(C_INFO_URL)
    if (cartData.status === 'ok') {
      let cart = cartData.data.articles
      cart.forEach(prod => {
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
            <img src="${image}" alt="${name}" class="img-fluid rounded imgHoverCartProduct" onclick="product_info(${id})">
          </div>
          <div class="col-8 flex-column d-flex justify-content-around">
            <div class="row">
              <div class="col-12 col-sm-7 pe-0">
                <h5 class="mb-0 nameHoverCartProduct" onclick="product_info(${id})">${name}</h5>
                <small class="text-muted">${typeOfCurrency} ${verifyCurrency(currency, unitCost, i)}</small>
              </div>
              <div class="col-sm-5 d-flex justify-content-end">
                <h6 class="fw-bold d-none d-sm-block" id="totalPerProduct-${i}">${typeOfCurrency} ${verifyCurrency(currency, unitCost, i) * count}</h6>
              </div>
            </div>
            <p class="d-none d-sm-block mb-0 text-break">${description}</p>
            <small class="fw-bold mb-0 d-sm-none text-end" id="totalPerProductRes-${i}">${typeOfCurrency} ${verifyCurrency(currency, unitCost, i) * count}</small>
            <div class="col-11 mx-auto">
              <div class="row d-none d-sm-flex justify-content-center gap-3">
                ${count_Delete_Fav(id, i, count)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 d-sm-none mt-3">
        <div class="row justify-content-center">
          ${count_Delete_Fav(id, i, count)}
        </div>
      </div>
    </div>
    `
  }
}

function fav(idProductCart) {
  document.getElementById(`noFav-${idProductCart}`).classList.toggle("d-none")
  document.getElementById(`Fav-${idProductCart}`).classList.toggle("d-none")
}

function verifyCurrency(currency, unitCost) {
  if (currency === "UYU") {
    if (typeOfCurrency === "USD") return `${Math.trunc(unitCost / 42)}`
    else return `${unitCost}`
  }
  else {
    if (typeOfCurrency === "UYU") return `${Math.trunc(unitCost * 42)}`
    else return `${unitCost}`
  }
}

function count_Delete_Fav(id, i, count) {
  return `
  <div class="col text-center px-sm-0">
    <div class="countGroup d-flex m-auto" style="height: 28px;">
      <button class="controlGroupMin d-flex align-items-center mx-auto flex-row-reverse" ${isMobile ? `ontouchend="mouseUp()" ontouchstart="mouseDown('negative', ${id})"` : `onmouseup="mouseUp()" onmousedown="mouseDown('negative', ${id})"`} >-</button>
      <label class="counter" id="countProduct-${i}">${count}</label>
      <button class="controlGroupPlus d-flex align-items-center mx-auto" ${isMobile ? `ontouchend="mouseUp()" ontouchstart="mouseDown('positive', ${id})"` : `onmouseup="mouseUp()" onmousedown="mouseDown('positive', ${id})"`}>+</button>
    </div>
  </div>
  <div class="col px-sm-0" onclick="remove(${id})">
    <div class="deleteGroup d-flex m-auto" style="height: 28px;">
      <button class="deleteBtn d-flex align-items-center justify-content-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
      <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
    </svg>
      </button>
    </div>
  </div>
  <div class="col px-sm-0">
    <div class="favGroup d-flex m-auto" style="height: 28px;" onclick="fav(${id})">
      <button class="favBtn d-flex align-items-center justify-content-center">
        <i class="fa-regular fa-heart" id="noFav-${id}"></i>
        <i class="fa-solid fa-heart d-none" id="Fav-${id}"></i>
      </button>
    </div>
  </div>
  `
}

function remove(id) {
  if (confirm("¿Está seguro que desea eliminar el producto?")) {
    cartArray = cartArray.filter(product => product.id !== id)
    localStorage.setItem("cart", JSON.stringify(cartArray))
    addItemsToCart(cartArray)
    refreshCountCart()
    updateTotalCosts(cartArray)
    if (cartArray.length === 0) checkOutBtn()
    return true
  }
  return false
}

let startTime = 0
let stepInterval = 1;
let intTime = "500"
let count = 0

function mouseUp() {
  clearTimeout(count)
}

function mouseDown(type, id) {
  startTime = new Date().getTime()
  const i = cartArray.findIndex(product => product.id === id)

  stepInterval = () => {
    const newTime = new Date().getTime();
    const elapsedTime = newTime - startTime;
    if (cartArray[i].count === 1 && type === "negative") {
      remove(id)
      return
    }

    if (elapsedTime < 1000) {
      cartArray[i].count = type === "positive" ? cartArray[i].count + 1 : cartArray[i].count - 1
      intTime = "500"
    }
    else if (elapsedTime < 2000) {
      cartArray[i].count = type === "positive" ? cartArray[i].count + 2 : cartArray[i].count - 2
      intTime = "250"
    }
    else if (elapsedTime < 3000) {
      cartArray[i].count = type === "positive" ? cartArray[i].count + 3 : cartArray[i].count - 3
      intTime = "150"
    }
    else if (elapsedTime < 6000) {
      cartArray[i].count = type === "positive" ? cartArray[i].count + 5 : cartArray[i].count - 5
      intTime = "70"
    }
    else if (elapsedTime > 6000) {
      cartArray[i].count = type === "positive" ? cartArray[i].count + 10 : cartArray[i].count - 10
      intTime = "40"
    }

    if (cartArray[i].count < 1) cartArray[i].count = 1
    if (cartArray[i].count > cartArray[i].stock) cartArray[i].count = cartArray[i].stock


    document.getElementById(`countProduct-${i}`).innerText = cartArray[i].count
    localStorage.setItem("cart", JSON.stringify(cartArray))

    updateTotalCosts(cartArray)
    changeProductTotal(cartArray[i].unitCost, cartArray[i].count, i)

    count = setTimeout(stepInterval, intTime);
  }
  stepInterval()
}

function changeTotal(type, id) {
  const i = cartArray.findIndex(product => product.id === id)
  let count = type === "positive" ? cartArray[i].count + 1 : cartArray[i].count - 1

  if (count < 1) {
    const removed = remove(id)
    if (!removed) count = 1
  }

  if (cartArray.length !== 0) {
    if (!cartArray[i].stock) cartArray[i].stock = 99
    if (cartArray[i].stock >= count) {
      cartArray[i].count = count
      localStorage.setItem("productBuyArray", JSON.stringify(cartArray))
      document.getElementById(`countProduct-${i}`).innerText = count
      updateTotalCosts(cartArray)
      changeProductTotal(cartArray[i].unitCost, count, i)
    }
  }
}

function changeProductTotal(unitCost, count, i) {
  document.getElementById(`totalPerProduct-${i}`).innerText = `${typeOfCurrency} ${verifyCurrency(cartArray[i].currency, unitCost, i) * count
    }
  `
}

let perccentage = 0
function updateTotalCosts(productA) {
  let subtotal = 0
  for (let i = 0; i < productA.length; i++) {
    const product = productA[i]
    subtotal = subtotal + (verifyCurrency(product.currency, product.unitCost) * product.count)
  }
  document.getElementById("subtotal-value").innerHTML = `${typeOfCurrency} ${subtotal}`

  let shipping = 0
  if (perccentage !== 0) shipping = subtotal * perccentage
  document.getElementById("total-value").innerHTML = `${typeOfCurrency} ${Math.round(subtotal + shipping, -1)}`
}

document.getElementById("usd").addEventListener("click", function () {
  typeOfCurrency = "USD"
  addItemsToCart(cartArray)
  updateTotalCosts(cartArray)
})

document.getElementById("uyu").addEventListener("click", function () {
  typeOfCurrency = "UYU"
  addItemsToCart(cartArray)
  updateTotalCosts(cartArray)
})

document.getElementById("premium").addEventListener("click", function () {
  document.getElementById("shipping-value").textContent = "15%"
  perccentage = 0.15
  updateTotalCosts(cartArray)
})

document.getElementById("express").addEventListener("click", function () {
  document.getElementById("shipping-value").textContent = "7%"
  perccentage = 0.07
  updateTotalCosts(cartArray)
})

document.getElementById("standard").addEventListener("click", function () {
  document.getElementById("shipping-value").textContent = "5%"
  perccentage = 0.05
  updateTotalCosts(cartArray)
})

document.getElementById("free-shipping").addEventListener("click", function () {
  document.getElementById("shipping-value").textContent = "Gratis"
  perccentage = 0
  updateTotalCosts(cartArray)
})

// detect when close mobile inspector and reload page
window.addEventListener("resize", function () {
  let mobile = navigator.userAgentData.mobile;
  if (mobile !== isMobile) {
    isMobile = mobile
    addItemsToCart(cartArray)
  }
})

document.getElementById("street").addEventListener("keyup", function () {
  if (this.value.length > 0) {
    document.getElementById("street").classList.remove("is-invalid")
    document.getElementById("street").classList.add("is-valid")
  }
  else {
    document.getElementById("street").classList.remove("is-valid")
    document.getElementById("street").classList.add("is-invalid")
  }
  validateDireccion()
})

document.getElementById("number").addEventListener("keyup", function () {
  if (this.value.length > 3) {
    document.getElementById("number").classList.remove("is-invalid")
    document.getElementById("number").classList.add("is-valid")
  }
  else {
    document.getElementById("number").classList.remove("is-valid")
    document.getElementById("number").classList.add("is-invalid")
  }
  validateDireccion()
})

document.getElementById("corner").addEventListener("keyup", function () {
  if (this.value.length > 0) {
    document.getElementById("corner").classList.remove("is-invalid")
    document.getElementById("corner").classList.add("is-valid")
  }
  else {
    document.getElementById("corner").classList.remove("is-valid")
    document.getElementById("corner").classList.add("is-invalid")
  }
  validateDireccion()
})

function validateDireccion() {
  const street = document.getElementById("street").value
  const number = document.getElementById("number").value
  const corner = document.getElementById("corner").value
  if (street.length > 0 && number.length > 3 && corner.length > 0) {
    document.getElementById("BtnSigDireccion").removeAttribute("disabled")
  }
  else {
    document.getElementById("BtnSigDireccion").setAttribute("disabled", true)
  }
}

document.getElementById("credit").addEventListener("click", function () {
  document.getElementById("creditNumber").removeAttribute("disabled")
  document.getElementById("cvv").removeAttribute("disabled")
  document.getElementById("date").removeAttribute("disabled")

  const bankNumber = document.getElementById("bankNumber")
  bankNumber.value = ""
  bankNumber.setAttribute("disabled", "true")
  bankNumber.classList.remove("is-valid")
  bankNumber.classList.remove("is-invalid")

  validatePayment()
})

document.getElementById("bank").addEventListener("click", function () {
  document.getElementById("bankNumber").removeAttribute("disabled")

  const creditNumber = document.getElementById("creditNumber")
  creditNumber.value = ""
  creditNumber.setAttribute("disabled", "true")
  creditNumber.classList.remove("is-valid")
  creditNumber.classList.remove("is-invalid")

  const cvv = document.getElementById("cvv")
  cvv.value = ""
  cvv.setAttribute("disabled", "true")
  cvv.classList.remove("is-valid")
  cvv.classList.remove("is-invalid")

  const date = document.getElementById("date")
  date.value = ""
  date.setAttribute("disabled", "true")
  date.classList.remove("is-valid")
  date.classList.remove("is-invalid")

  validatePayment()
})

document.getElementById("creditNumber").addEventListener("keyup", function () {
  if (this.value.length === 16) {
    document.getElementById("creditNumber").classList.remove("is-invalid")
    document.getElementById("creditNumber").classList.add("is-valid")
  }
  else {
    document.getElementById("creditNumber").classList.remove("is-valid")
    document.getElementById("creditNumber").classList.add("is-invalid")
  }
  validatePayment()
})

document.getElementById("cvv").addEventListener("keyup", function () {
  if (this.value.length === 3) {
    document.getElementById("cvv").classList.remove("is-invalid")
    document.getElementById("cvv").classList.add("is-valid")
  }
  else {
    document.getElementById("cvv").classList.remove("is-valid")
    document.getElementById("cvv").classList.add("is-invalid")
  }
  validatePayment()
})

document.getElementById("date").addEventListener("keyup", function (e) {
  if (isNaN(e.key) && e.key !== "Backspace") {
    this.value = this.value.substring(0, this.value.length - 1)
  }

  const date = this.value.split("/")
  if (e.key !== "Backspace") {
    if (date[0] && date[0].length === 2 && date[0] > 12) {
      this.value = date[1] ? "12/" + date[1] : "12"
    }
    if (date[1] && date[1].length === 2) {
      if (date[1] > 99) {
        this.value = date[0] + "/99"
      }
      else if (date[1] < 22) {
        this.value = date[0] + "/22"
      }
    }
  }

  if (this.value.indexOf("/") === -1 && this.value.length > 2 && e.key !== "Backspace" && !this.value.includes("00")) {
    this.value = this.value.slice(0, 2) + "/" + this.value.slice(2)
  }
  else if (this.value.length === 2 && e.key !== "Backspace") {
    this.value += "/"
  }
  else if (this.value.length === 5 && !this.value.includes("00")) {
    document.getElementById("date").classList.remove("is-invalid")
    document.getElementById("date").classList.add("is-valid")
  }
  else {
    document.getElementById("date").classList.remove("is-valid")
    document.getElementById("date").classList.add("is-invalid")
  }

  validatePayment()
})

document.getElementById("bankNumber").addEventListener("keyup", function () {
  if (this.value.length === 20) {
    document.getElementById("bankNumber").classList.remove("is-invalid")
    document.getElementById("bankNumber").classList.add("is-valid")
  }
  else {
    document.getElementById("bankNumber").classList.remove("is-valid")
    document.getElementById("bankNumber").classList.add("is-invalid")
  }
  validatePayment()
})

function validatePayment() {
  const creditNumber = document.getElementById("creditNumber").value
  const cvv = document.getElementById("cvv").value
  const date = document.getElementById("date").value

  if (creditNumber.length === 16 && cvv.length === 3 && date.length === 5 || document.getElementById("bankNumber").value.length === 20) {
    document.getElementById("BtnSigPayment").removeAttribute("disabled")
  }
  else {
    document.getElementById("BtnSigPayment").setAttribute("disabled", "true")
  }
}

document.getElementById("BtnSigPayment").addEventListener("click", function () {
  resumeOfPurchase()
})

document.getElementById("buy").addEventListener("click", function () {
  document.getElementById("buy").setAttribute("disabled", "true")
  document.getElementById("buy").innerHTML = "Procesando..."
  setTimeout(function () {
    document.getElementById("buy").innerHTML = "Compra realizada con éxito"
    document.getElementById("buy").classList.remove("btn-primary")
    document.getElementById("buy").classList.add("btn-success")
  }, 2000)
  cartArray = []
  localStorage.setItem("cart", JSON.stringify(cartArray))
  addItemsToCart(cartArray)
  refreshCountCart()
  updateTotalCosts(cartArray)
  checkOutBtn()
})

function checkOutBtn() {
  if (JSON.parse(localStorage.getItem("cart")).length === 0)
    document.getElementById("checkout").setAttribute("disabled", "true")
  else
    document.getElementById("checkout").removeAttribute("disabled")
}

function resumeOfPurchase() {
  const d = iOS() ? new Date().toISOString().slice(0, 19).replace('T', ' ') : new Date().toISOString().slice(0, 19).replace('T', ' ').replace('-', '/').replace('-', '/')
  let day = iOS() ? new Date(d).getDay() + 1 : new Date(d).getDay()
  let date = iOS() ? new Date(d).getDate() : new Date(d).getDate()
  let month = iOS() ? new Date(d).getMonth() : new Date(d).getMonth() + 1
  // let year = d.slice(0, 4)
  // let hour = d.slice(11, 13)
  // let minutes = d.slice(14, 16)
  // const d = new Date()
  // let day = d.getDay()
  // let date = d.getDate()
  // let month = d.getMonth() + 1

  const dia = {
    0: "Domingo",
    1: "Lunes",
    2: "Martes",
    3: "Miércoles",
    4: "Jueves",
    5: "Viernes",
    6: "Sábado"
  }

  const envio = {
    0.15: [2, 5],
    0.07: [5, 8],
    0.05: [12, 15],
    0: [0]
  }

  document.getElementById("purchase").innerHTML = `
  <p class="mb-0 fw-bold">Total a pagar: <span class="fw-normal">${document.getElementById("total-value").innerText}</span></p>
  <p class="mb-0 fw-bold">Forma de pago: <span class="fw-normal">${document.getElementById("creditNumber").value.length > 0 ? 'Tarjeta de crédito' : 'Transferencia bancaria'}</span></p>
  <p class="mb-0 fw-bold">Correo del comprador: <span class="fw-normal">example@mail.com</span></p>
  <p class="mb-0">${DiaDeLlegada(dia, envio, day, date, month)}</p>
  `
}

function DiaDeLlegada(dia, envio, day, date, month) {
  if (envio[perccentage][0] === 0)
    return `Su compra se puede retirar en el local a las 12:00hs del ${dia[day + 1]}`

  let dayOfArrival = {
    0: day + envio[perccentage][0],
    1: day + envio[perccentage][1]
  }

  let dateOfArrival = {
    0: date + envio[perccentage][0],
    1: date + envio[perccentage][1]
  }

  if (dayOfArrival[0] > 6)
    while (dayOfArrival[0] > 6)
      dayOfArrival[0] -= 7

  if (dayOfArrival[1] > 6)
    while (dayOfArrival[1] > 6)
      dayOfArrival[1] -= 7

  function checkDate(date, month) {
    if (month === 2 && date > 28)
      return date - 28
    else if ((month === 4 || month === 6 || month === 9 || month === 11) && date > 30)
      return date - 30
    else if (date > 31)
      return date - 31

    return date
  }

  dateOfArrival[0] = checkDate(dateOfArrival[0], month)
  dateOfArrival[1] = checkDate(dateOfArrival[1], month)
  return `Su compra llegará entre los días ${dia[dayOfArrival[0]]} ${dateOfArrival[0]} y ${dia[dayOfArrival[1]]} ${dateOfArrival[1]}`
}