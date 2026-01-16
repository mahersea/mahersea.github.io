const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 400;

// Load and convert image to binary color
const image = new Image();
image.src = "test.png"; // Replace with your image path
image.onload = () => {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let pixels = imageData.data;
    
    // Convert image to binary (black & white)
    for (let i = 0; i < pixels.length; i += 4) {
        let grayscale = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
        let color = grayscale > 128 ? 255 : 100;
        pixels[i] = pixels[i + 1] = pixels[i + 2] = color;
    }
    ctx.putImageData(imageData, 0, 0);

    // Start animation
    animateWind();
};

function animateWind() {
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let pixels = imageData.data;
    
    function blowWind() {
        let newPixels = new Uint8ClampedArray(pixels);
        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                let index = (y * canvas.width + x) * 4;
                if (pixels[index] === 0) { // Only move black pixels
                    let newX = x + Math.sin(y * 0.1) * 2; // Simulate wind
                    let newIndex = (y * canvas.width + Math.floor(newX)) * 4;
                    if (newIndex >= 0 && newIndex < newPixels.length) {
                        newPixels[newIndex] = 0;
                        newPixels[newIndex + 1] = 0;
                        newPixels[newIndex + 2] = 0;
                        newPixels[newIndex + 3] = 255;
                    }
                }
            }
        }
        ctx.putImageData(new ImageData(newPixels, canvas.width, canvas.height), 0, 0);
        requestAnimationFrame(blowWind);
    }
    requestAnimationFrame(blowWind);
}
