window.addEventListener("scroll", checkElementVisibilityScroll);
window.addEventListener("load", checkElementVisibilityScroll);

var navbar = document.getElementById("nav-bar");
var homeSection = document.getElementById("home-section");
var skillBars = document.getElementsByClassName("progress-bar");
var statInfo = document.querySelectorAll("#statistics-section .statistics-info");
var loadingScreen = document.querySelector(".loading-screen");
let navbarMoved = false;

initiateWebsiteLoading();
assignToPreviewButton();
function checkElementVisibilityScroll() {
    moveNavbar();
    animateSkills();
    checkCounterVisibility();
}

function moveNavbar() {
    if(homeSection.getBoundingClientRect().bottom < 0 && !navbarMoved) {
        navbar.classList.toggle("nav-scroll");
        navbarMoved = true;
    }
    else if(homeSection.getBoundingClientRect().bottom > 0 && navbarMoved) {
        navbar.classList.toggle("nav-scroll")
        navbarMoved = false;
    }
}


function animateSkills() {
    for(let i = 0; i < skillBars.length; i++) {
        if(skillBars[i].getBoundingClientRect().top < document.documentElement.clientHeight && skillBars[i].getAttribute("data-visible") == "false") {
            skillBars[i].style.width = `${skillBars[i].parentElement.getAttribute("aria-valuenow")}%`;
            skillBars[i].setAttribute("data-visible", "true");
        }
    }
}

const getNumber = (counter) => {
    return parseFloat(counter.dataset.currentValue);
};

const updateText = (counter, text) => {
    let numberDisplay = counter.querySelector("h3");
    numberDisplay.textContent = text;
};

const animate = (counter, countTo, duration) => {
    let startTime = null;

    let currentTime = Date.now();

    const step = (currentTime) => {
        if (!startTime) {
            startTime = currentTime;
        }

        const progress = Math.min((currentTime - startTime) / duration, 1);

        const currentNum = Math.floor(progress * countTo);

        updateText(counter, currentNum);

        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            window.cancelAnimationFrame(window.requestAnimationFrame(step));
        }
    };

    window.requestAnimationFrame(step);
};

Array.from(statInfo).forEach((counter) => {
    const countTo = getNumber(counter);
    const animationDuration = parseFloat(2000);
    
    if(counter.getBoundingClientRect().bottom < document.documentElement.clientHeight)
        animate(counter, countTo, animationDuration);
});

function checkCounterVisibility() {
    Array.from(statInfo).forEach((counter) => {
        const countTo = getNumber(counter);
        const animationDuration = parseFloat(2000);
        
        if(counter.getBoundingClientRect().top < document.documentElement.clientHeight && counter.getAttribute("data-played") == "false") {
            animate(counter, countTo, animationDuration);
            counter.setAttribute("data-played", "true");
        }
        else if(counter.getBoundingClientRect().top > document.documentElement.clientHeight && counter.getAttribute("data-played") == "true")
            counter.setAttribute("data-played", "false");
    });
}

function initiateWebsiteLoading() {
    let loadingChildren = loadingScreen.getElementsByClassName("child");
    Array.from(loadingChildren).forEach((item) => {
        item.style.animationPlayState = "running";
    })

    function removeLoadingParent() {
        loadingScreen.remove();
    }

    setTimeout(removeLoadingParent, 1300);
}

/* ===== Work Image Preview Functions ===== */

function assignToPreviewButton() {
    let anchorTags = document.querySelectorAll(".work-item-overlay .icons :last-child a");

    Array.from(anchorTags).forEach((item) => {
        item.addEventListener("click", function(event, elmnt) { 
            openWorkImagePreview(event, elmnt);
        });
    })
}

function openWorkImagePreview(event, elmnt) {
    let div = document.createElement("div");
    div.classList.add("work-image-preview");

    let closeButton = document.createElement("button");
    closeButton.classList.add("close-button");
    closeButton.addEventListener("click", function() {
        let closeButtonAncestor = document.querySelector(".work-image-preview");
        document.body.classList.remove("overflow-hidden");
        closeButtonAncestor.remove();
    });
    closeButton.insertAdjacentHTML('beforeend', '<i class="fa-solid fa-x"></i>');
    let currentImage = (elmnt) ? elmnt.cloneNode() : event.target.closest(".work-item-overlay").previousElementSibling.cloneNode();
    let imageTab = (elmnt) ? elmnt.closest(".tab-pane") : event.target.closest(".tab-pane");


    let nextSlideButton = document.createElement("button");
    nextSlideButton.classList.add("next-slide");
    nextSlideButton.addEventListener("click", nextImage);
    nextSlideButton.insertAdjacentHTML('beforeend', '<i class="fa-solid fa-caret-right"></i>');

    let previousSlideButton = document.createElement("button");
    previousSlideButton.classList.add("previous-slide");
    previousSlideButton.addEventListener("click", nextImage);
    previousSlideButton.insertAdjacentHTML('beforeend', '<i class="fa-solid fa-caret-right"></i>');

    div.insertAdjacentHTML('beforeend', `
    <div class="work-image-container">
        <span class="image-index" data-image-tab="${imageTab.getAttribute("id")}"><span class="index">${currentImage.getAttribute("data-image-index")}</span> of <span class="total-images">${imageTab.querySelectorAll("img").length}</span></span>
    </div>
`)
    document.body.appendChild(div);
    div.appendChild(nextSlideButton);
    div.appendChild(previousSlideButton);

    div.querySelector(".work-image-container").prepend(currentImage);
    div.querySelector(".work-image-container").prepend(closeButton);

    if(elmnt) {
        div.previousElementSibling.remove();
    }

    document.body.classList.add("overflow-hidden");
}

function nextImage() {
    let currentImageIndex = this.parentElement.querySelector("img").getAttribute("data-image-index");
    let imageIndexSpan = this.parentElement.querySelector(".image-index");

    let imageTab = document.querySelector(`#${imageIndexSpan.getAttribute("data-image-tab")}`);
    if(currentImageIndex == imageIndexSpan.querySelector(".total-images").textContent) {
        openWorkImagePreview(event, imageTab.querySelector(`img`));
    }
    else {
        let querySearch = `[data-image-index='${++currentImageIndex}']`;
        openWorkImagePreview(event, imageTab.querySelector(querySearch));
    }
}

function previousImage() {
    let currentImageIndex = this.parentElement.querySelector("img").getAttribute("data-image-index");
    let imageIndexSpan = this.parentElement.querySelector(".image-index");

    let imageTab = document.querySelector(`#${imageIndexSpan.getAttribute("data-image-tab")}`);
    if(currentImageIndex <= imageIndexSpan.querySelector(".total-images").textContent) {
        let querySearch = `[data-image-index='${--currentImageIndex}]`;
        openWorkImagePreview(event, imageTab.querySelector(querySearch));
    }
    else if(currentImageIndex == "1") {
        let querySearch = `[data-image-index='${imageIndexSpan.querySelector(".total-images").textContent}']`;
        openWorkImagePreview(event, imageTab.querySelector(querySearch));
    }
}