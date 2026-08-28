// // Variables //
// let cropper;

// // Constants //
// const image = document.getElementById("image");
// const input = document.getElementById("imageInput");
// const canvas = document.getElementById("canvas");
// const cropButton = document.getElementById("cropButton");

// // Functions //
// input.addEventListener("change", function(e){

//     const files = e.target.files;

//     if(files && files.length > 0){
//         const reader = new FileReader();
//         reader.onload = function(event){
//             image.src = event.target.result;
//             image.onload = function(){

//                 // Kill Previous Instance //
//                 if(cropper){
//                     cropper.destroy();
//                 } // End If //

//                 cropper = new Cropper(image,{
//                     aspectRatio:1,
//                     viewMode:1,
//                     dragMode:'move',
//                     autoCropArea:1,
//                     responsive:true,
//                     movable:true,
//                     zoomable:false,
//                     scalable:false,
//                     rotatable:false
//                 });

//             } // End Function //

//         } // End Function //

//         reader.readAsDataURL(files[0]);

//     } // End If //

// }); // End Event Listener //

// cropButton.addEventListener("click", function(){

//     if(!cropper) return;

//     const croppedCanvas = cropper.getCroppedCanvas({ width:500, height:500 });

//     canvas.width = 500;
//     canvas.height = 500;

//     const ctx = canvas.getContext("2d");

//     ctx.clearRect(0,0,500,500);
//     ctx.drawImage(croppedCanvas,0,0);

//     // Base64 string <!> MAY NEED BLOB <!> //
//     const imageData = croppedCanvas.toDataURL("image/png");

//     console.log(imageData);

// });

const MAX_IMAGES = 4;

let cropper = null;
let selectedSlot = null;

// Store the cropped images.
//
// Example:
//
// images = [
//     "data:image/png;base64,...",
//     null,
//     "data:image/png;base64,...",
//     null
// ];

let images = new Array(MAX_IMAGES).fill(null);

const image = document.getElementById("image");
const imageInput = document.getElementById("imageInput");
const cropButton = document.getElementById("cropButton");

const imageSlots = document.getElementById("imageSlots");
const results = document.getElementById("results");
const editor = document.getElementById("editor");

// --------------------------------------------------
// CREATE IMAGE SLOTS
// --------------------------------------------------

function createImageSlots() {

imageSlots.innerHTML = "";

for (let i = 0; i < MAX_IMAGES; i++) {

    const slot = document.createElement("div");

    slot.classList.add("image-slot");

    slot.dataset.index = i;


    // Slot number

    const number = document.createElement("div");

    number.classList.add("slot-number");

    number.textContent = `Image ${i + 1}`;

    slot.appendChild(number);


    // If image exists, display it

    if (images[i]) {

        const img = document.createElement("img");

        img.src = images[i];

        slot.appendChild(img);

    } else {

        const text = document.createElement("div");

        text.classList.add("empty-slot");

        text.textContent = "Click to Upload";

        slot.appendChild(text);

    }


    // Click slot

    slot.addEventListener("click", function() {

        selectSlot(i);

    });


    imageSlots.appendChild(slot);

}


}

// --------------------------------------------------
// SELECT SLOT
// --------------------------------------------------

function selectSlot(index) {


selectedSlot = index;

editor.style.display = "block";


// If image already exists,
// load it directly into Cropper.

if (images[index]) {

    loadImageIntoCropper(images[index]);

} else {

    // No image yet.
    // Clear previous editor.

    if (cropper) {

        cropper.destroy();

        cropper = null;

    }

    image.src = "";

    imageInput.value = "";

}


}

// --------------------------------------------------
// UPLOAD NEW IMAGE
// --------------------------------------------------

imageInput.addEventListener("change", function(event) {


const file = event.target.files[0];

if (!file) {
    return;
}


const reader = new FileReader();


reader.onload = function(event) {

    loadImageIntoCropper(event.target.result);

};


reader.readAsDataURL(file);

});

// --------------------------------------------------
// LOAD IMAGE INTO CROPPER
// --------------------------------------------------

function loadImageIntoCropper(imageSource) {

// Destroy previous Cropper

if (cropper) {

    cropper.destroy();

    cropper = null;

}


image.src = imageSource;


image.onload = function() {

    cropper = new Cropper(image, {

        aspectRatio: 1,

        viewMode: 1,

        dragMode: "move",

        autoCropArea: 1,

        responsive: true,

        movable: true,

        zoomable: true,

        scalable: false,

        rotatable: false

    });

};


}

// --------------------------------------------------
// SAVE CROPPED IMAGE
// --------------------------------------------------

cropButton.addEventListener("click", function() {

if (!cropper || selectedSlot === null) {

    alert("Please select an image first.");

    return;

}


const croppedCanvas = cropper.getCroppedCanvas({

    width: 500,

    height: 500

});


// Convert the crop to Base64

const croppedImage = croppedCanvas.toDataURL("image/png");


// Save image in its slot

images[selectedSlot] = croppedImage;


// Update interface

createImageSlots();

displayResults();


alert(`Image ${selectedSlot + 1} saved!`);


});

// --------------------------------------------------
// DISPLAY FINAL IMAGES
// --------------------------------------------------

function displayResults() {

results.innerHTML = "";


images.forEach(function(imageData, index) {

    if (imageData) {

        const img = document.createElement("img");

        img.classList.add("result-image");

        img.src = imageData;

        img.alt = `Image ${index + 1}`;

        results.appendChild(img);

    }

});

}

// --------------------------------------------------
// INITIALIZE
// --------------------------------------------------

createImageSlots();
displayResults();
