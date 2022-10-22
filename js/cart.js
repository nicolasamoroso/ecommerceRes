let typeOfCurrency = "USD"

document.addEventListener('DOMContentLoaded', async () => {
    let cartArray = []
    if (!localStorage.getItem("cart")) {
        const cartData = await getJSONData(C_INFO_URL)
        if (cartData.status === 'ok') {
            let cart = cartData.data.articles
            cart.forEach(prod => {
                prod.stock = prod.currency === "USD" ? Math.round(40000 / prod.unitCost) + 1 : Math.round(40000 / prod.unitCost * 23) + 1
                cartArray.push(prod)
            })

        }
        localStorage.setItem("cart", JSON.stringify(cartArray))
    }
    else cartArray = JSON.parse(localStorage.getItem("cart"))


    addItemsToCart(cartArray)
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
                      <img src="${image}" alt="${name}" class="img-fluid rounded">
                    </div>
                    <div class="col-8 flex-column d-flex justify-content-around">
                      <div class="row">
                        <div class="col-12 col-sm-7">
                          <h5 class="mb-0">${name}</h5>
                          <small class="text-muted">${typeOfCurrency} ${verifyCurrency(currency, unitCost, i) * count}</small>
                        </div>
                        <div class="col-sm-5 d-flex justify-content-end">
                          <h6 class="fw-bold d-none d-sm-block" id="totalPerProduct-${i}">${typeOfCurrency} ${verifyCurrency(currency, unitCost, i) * count}</h6>
                        </div>
                      </div>
                      <p class="d-none d-sm-block mb-0">Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi,
                        adipisci.</p>
                      <small class="fw-bold mb-0 d-sm-none text-end" id="totalPerProductRes-${i}">${typeOfCurrency} ${verifyCurrency(currency, unitCost, i) * count}</small>

                      <div class="col-11 ms-2">
                        <div class="row d-none d-sm-flex justify-content-center gap-3">
                         
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-12 d-sm-none mt-3">
                  <div class="row justify-content-center">
                    
                  </div>
                </div>
              </div>
        `
    }


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

function countDeleteFav() {
    return `
    <div class="col text-center px-0">
                            <div class="countGroup d-flex m-auto" style="height: 28px;">
                              <button class="controlGroupMin d-flex align-items-center mx-auto">-</button>
                              <label class="counter">1</label>
                              <button class="controlGroupPlus d-flex align-items-center mx-auto">+</button>
                            </div>
                          </div>
                          <div class="col px-0">
                            <div class="deleteGroup d-flex m-auto" style="height: 28px;">
                              <button class="deleteBtn d-flex align-items-center justify-content-center">
                                <svg width="20" height="20" viewBox="0 0 15 15" fill="none"
                                  xmlns="http://www.w3.org/2000/svg">
                                  <path
                                    d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4L3.5 4C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z"
                                    fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
                                </svg>
                              </button>
                            </div>
                          </div>
                          <div class="col px-0">
                            <div class="deleteGroup d-flex m-auto" style="height: 28px;">
                              <button class="deleteBtn d-flex align-items-center justify-content-center">
                                <i class="fa-regular fa-heart"></i>
                              </button>
                              </div>
                            </div>
                              `
}