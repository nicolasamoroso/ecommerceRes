function setCarouselActiveButton(index) {
    const buttons = document.querySelectorAll(".c-indicators button");
    buttons.forEach(button => {
        button.classList.remove("active");
    });
    buttons[index].classList.add("active");
}

function detectInterval() {
    const carousel = document.getElementById("carouselProductIndicators");
    carousel.addEventListener('slide.bs.carousel', function (event) {
        setCarouselActiveButton(event.to);
    })
}

document.addEventListener("DOMContentLoaded", function(e){
    detectInterval();
});