const fileInput = document.querySelector(".file-input");
const previewImg = document.querySelector(".preview-img img");
const filterName = document.querySelector(".filter-info .name");
const filterValue = document.querySelector(".filter-info .value");
const filterSlider = document.querySelector("#filter-range");
const filterButtons = document.querySelectorAll(".filter button");
const rotateButtons = document.querySelectorAll(".rotate .options button");
const resetButton = document.querySelector(".reset-filter");
const chooseImgBtn = document.querySelector(".choose-img");
const saveImgBtn = document.querySelector(".save-img");



let brightness = 100,
    saturation = 100,
    inversion = 0,
    grayscale = 0;
let rotate = 0;
let flipHorizontal = 1;
let flipVertical = 1;
let activeFilter = "brightness";



const applyFilters = () => {
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
    previewImg.style.filter = `
        brightness(${brightness}%)
        saturate(${saturation}%)
        invert(${inversion}%)
        grayscale(${grayscale}%)
    `;
};



filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".filter .options .active")?.classList.remove("active");
        btn.classList.add("active");
        activeFilter = btn.innerText.toLowerCase();
        filterName.innerText = btn.innerText;



        switch (activeFilter) {
            case "brightness":
                filterSlider.max = "200";
                filterSlider.value = brightness;
                filterValue.innerText = `${brightness}%`;
                break;
            case "saturation":
                filterSlider.max = "200";
                filterSlider.value = saturation;
                filterValue.innerText = `${saturation}%`;
                break;
            case "inversion":
                filterSlider.max = "100";
                filterSlider.value = inversion;
                filterValue.innerText = `${inversion}%`;
                break;
            case "grayscale":
                filterSlider.max = "100";
                filterSlider.value = grayscale;
                filterValue.innerText = `${grayscale}%`;
                break;
        }
    });
});



filterSlider.addEventListener("input", () => {
    const value = filterSlider.value;
    filterValue.innerText = `${value}%`;
    switch (activeFilter) {
        case "brightness":
            brightness = value;
            break;
        case "saturation":
            saturation = value;
            break;
        case "inversion":
            inversion = value;
            break;
        case "grayscale":
            grayscale = value;
            break;
    }
    applyFilters();
});



rotateButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const title = btn.title.toLowerCase();
        if (title.includes("left")) rotate -= 90;
        else if (title.includes("right")) rotate += 90;
        else if (title.includes("vertical")) flipVertical *= -1;
        else if (title.includes("horizontal")) flipHorizontal *= -1;
        applyFilters();
    });
});



resetButton.addEventListener("click", () => {
    brightness = 100;
    saturation = 100;
    inversion = 0;
    grayscale = 0;
    rotate = 0;
    flipHorizontal = 1;
    flipVertical = 1;
    filterButtons[0].click(); // Default to brightness
    applyFilters();
});



fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;
    previewImg.src = URL.createObjectURL(file);
    previewImg.addEventListener("load", () => {
        resetButton.click(); // reset when new image is loaded
    });
});



chooseImgBtn.addEventListener("click", () => fileInput.click());



saveImgBtn.addEventListener("click", () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");



    canvas.width = previewImg.naturalWidth;
    canvas.height = previewImg.naturalHeight;



    // Apply styles to canvas
    ctx.filter = `
        brightness(${brightness}%)
        saturate(${saturation}%)
        invert(${inversion}%)
        grayscale(${grayscale}%)
    `;



    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotate * Math.PI) / 180);
    ctx.scale(flipHorizontal, flipVertical);
    ctx.drawImage(
        previewImg,
        -canvas.width / 2,
        -canvas.height / 2,
        canvas.width,
        canvas.height
    );



    const link = document.createElement("a");
    link.download = "edited-image.png";
    link.href = canvas.toDataURL();
    link.click();
});

