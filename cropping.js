// Variables //
let cropper;

// Constants //
const image = document.getElementById("image");
const input = document.getElementById("imageInput");
const canvas = document.getElementById("canvas");
const cropButton = document.getElementById("cropButton");

// Functions //
input.addEventListener("change", function(e){

    const files = e.target.files;

    if(files && files.length > 0){
        const reader = new FileReader();
        reader.onload = function(event){
            image.src = event.target.result;
            image.onload = function(){

                // Kill Previous Instance //
                if(cropper){
                    cropper.destroy();
                } // End If //

                cropper = new Cropper(image,{
                    aspectRatio:1,
                    viewMode:1,
                    dragMode:'move',
                    autoCropArea:1,
                    responsive:true,
                    movable:true,
                    zoomable:false,
                    scalable:false,
                    rotatable:false
                });

            } // End Function //

        } // End Function //

        reader.readAsDataURL(files[0]);

    } // End If //

}); // End Event Listener //

cropButton.addEventListener("click", function(){

    if(!cropper) return;

    const croppedCanvas = cropper.getCroppedCanvas({ width:500, height:500 });

    canvas.width = 500;
    canvas.height = 500;

    const ctx = canvas.getContext("2d");

    ctx.clearRect(0,0,500,500);
    ctx.drawImage(croppedCanvas,0,0);

    // Base64 string <!> MAY NEED BLOB <!> //
    const imageData = croppedCanvas.toDataURL("image/png");

    console.log(imageData);

});