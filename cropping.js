// Variables //
const MAX_IMAGES = 4;

let cropper = null;
let selectedSlot = null;

// Storing images to allow for multiple submissions //
let images = new Array(MAX_IMAGES).fill(null);

const image = document.getElementById("image");
const imageInput = document.getElementById("imageInput");
const cropButton = document.getElementById("cropButton");

const imageSlots = document.getElementById("imageSlots");
const results = document.getElementById("results");
const editor = document.getElementById("editor");

// Image Slots for Uploads //
function createImageSlots() {

    imageSlots.innerHTML = "";

    for (let i = 0; i < MAX_IMAGES; i++) {
        
        const slot = document.createElement("div");
        slot.classList.add("image-slot");
        slot.dataset.index = i;
        const number = document.createElement("div");
        number.classList.add("slot-number");
        number.textContent = `Image ${i + 1}`;
        slot.appendChild(number);

        // Displaying selected cropped images //
        if (images[i]) {
            const img = document.createElement("img");
            img.src = images[i];
            slot.appendChild(img);
        } // End If //
        else {
            const text = document.createElement("div");
            text.classList.add("empty-slot");
            text.textContent = "Click to Upload";
            slot.appendChild(text);
        } // End Else //

        // Allows Slots to be clicked and reselected //
        slot.addEventListener("click", function() {
            selectSlot(i);
        });

        imageSlots.appendChild(slot);

    } // End For //

} // End Function //

// Select Slot for Image Upload //
function selectSlot(index) {
    
    selectedSlot = index;
    editor.style.display = "block";

    // Handles if an image has already been uploaded //
    if (images[index]) {
        loadImage(images[index]);
    } // End If //
    // No image fresh upload //
    else {
        if (cropper) {
            cropper.destroy();
            cropper = null;
        } // End If //
        image.src = "";
        imageInput.value = "";
    } // End Else //

} // End Function //

// Image Upload //
imageInput.addEventListener("change", function(event) {

    const file = event.target.files[0];
    if (!file) {
        return;
    } // End If //

    const reader = new FileReader();

    reader.onload = function(event) {
        loadImage(event.target.result);
    };

    reader.readAsDataURL(file);

});

// Allow Photo to be Cropped in the Cropper //
function loadImage(imageSource) {

    // Destroy Cropper Instance //
    if (cropper) {
        cropper.destroy();
        cropper = null;
    } // End If //

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

} // End Function //

// Save Current Crop //
cropButton.addEventListener("click", function() {

    if (!cropper || selectedSlot === null) {
        alert("Please select an image first.");
        return;
    } // End If //


    const croppedCanvas = cropper.getCroppedCanvas({
        width: 500,
        height: 500
    });

    const croppedImage = croppedCanvas.toDataURL("image/png");
    images[selectedSlot] = croppedImage;

    // Refresh UI //
    createImageSlots();
    displayFinal();

    alert(`Image ${selectedSlot + 1} saved!`);

});

// Display Final Submissions //
function displayFinal() {

    results.innerHTML = "";

    images.forEach(function(imageData, index) {
        if (imageData) {
            const img = document.createElement("img");
            img.classList.add("result-image");
            img.src = imageData;
            img.alt = `Image ${index + 1}`;
            results.appendChild(img)
        } // End If //
    });

} // End Function

// Initialization Time Wahoo //
createImageSlots();
displayFinal();
