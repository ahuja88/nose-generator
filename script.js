const imageUpload = document.getElementById('imageUpload');
const memeCanvas = document.getElementById('memeCanvas');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');
const ctx = memeCanvas.getContext('2d');

let userImage = new Image();
userImage.crossOrigin = 'anonymous'; // Set crossOrigin attribute
let noseImage = new Image();
noseImage.src = 'nosev1.png';
noseImage.crossOrigin = 'anonymous'; // Set crossOrigin attribute

let noseX = 0;
let noseY = 0;
let noseWidth = 50;
let noseHeight = 50;
let noseRotation = 0; // Initial rotation angle in degrees

let isDragging = false;
let isResizing = false;
let isRotating = false;
let startX, startY, startRotation;

const rotationHandleLength = 50; // Length of the rotation handle

noseImage.onload = () => {
  noseWidth = noseImage.width;
  noseHeight = noseImage.height;
};

imageUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    userImage.src = reader.result;
    userImage.onload = () => {
      memeCanvas.width = userImage.width;
      memeCanvas.height = userImage.height;
      ctx.drawImage(userImage, 0, 0);
      drawNose();
    };
  };

  reader.readAsDataURL(file);
});

function drawNose(showHandles = true) {
  ctx.clearRect(0, 0, memeCanvas.width, memeCanvas.height);
  ctx.drawImage(userImage, 0, 0);
  ctx.save();
  ctx.translate(noseX + noseWidth / 2, noseY + noseHeight / 2);
  ctx.rotate(noseRotation * Math.PI / 180);
  ctx.drawImage(noseImage, -noseWidth / 2, -noseHeight / 2, noseWidth, noseHeight);
  ctx.restore();
  if (showHandles) {
    drawResizeHandle();
    drawRotationHandle();
  }
}

function drawResizeHandle() {
    const handleSize = 8; // Adjust the size as needed
    const handleX = noseX + noseWidth - handleSize / 2;
    const handleY = noseY + noseHeight - handleSize / 2;
  
    ctx.beginPath();
    ctx.fillStyle = 'white'; // Change the color if desired
    ctx.moveTo(handleX, handleY);
    ctx.lineTo(handleX + handleSize, handleY);
    ctx.lineTo(handleX + handleSize / 2, handleY + handleSize / 2);
    ctx.lineTo(handleX, handleY + handleSize);
    ctx.closePath();
    ctx.fill();
  }

function drawRotationHandle() {
  const handleX = noseX + noseWidth / 2;
  const handleY = noseY - rotationHandleLength;
  ctx.beginPath();
  ctx.moveTo(noseX + noseWidth / 2, noseY);
  ctx.lineTo(handleX, handleY);
  ctx.strokeStyle = 'white';
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(handleX, handleY, 5, 0, 2 * Math.PI);
  ctx.fillStyle = 'green';
  ctx.fill();
}

memeCanvas.addEventListener('mousedown', (e) => {
  const rect = memeCanvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  if (
    mouseX >= noseX &&
    mouseX <= noseX + noseWidth &&
    mouseY >= noseY &&
    mouseY <= noseY + noseHeight
  ) {
    isDragging = true;
    startX = mouseX - noseX;
    startY = mouseY - noseY;
  } else if (isNearResizeHandle(mouseX, mouseY)) {
    isResizing = true;
    startX = mouseX;
    startY = mouseY;
    startWidth = noseWidth;
    startHeight = noseHeight;
  } else if (isNearRotationHandle(mouseX, mouseY)) {
    isRotating = true;
    const centerX = noseX + noseWidth / 2;
    const centerY = noseY;
    startRotation = Math.atan2(mouseY - centerY, mouseX - centerX) * 180 / Math.PI - noseRotation;
  }
});

memeCanvas.addEventListener('mousemove', (e) => {
  const rect = memeCanvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  if (isDragging) {
    noseX = mouseX - startX;
    noseY = mouseY - startY;
    drawNose();
  } else if (isResizing) {
    noseWidth = Math.max(20, mouseX - noseX);
    noseHeight = Math.max(20, mouseY - noseY);
    drawNose();
  } else if (isRotating) {
    const centerX = noseX + noseWidth / 2;
    const centerY = noseY;
    const angle = Math.atan2(mouseY - centerY, mouseX - centerX) * 180 / Math.PI;
    noseRotation = angle - startRotation;
    drawNose();
  }
});

memeCanvas.addEventListener('mouseup', () => {
  isDragging = false;
  isResizing = false;
  isRotating = false;
});

function isNearResizeHandle(x, y) {
  const resizeHandleSize = 10;
  return (
    Math.abs(x - (noseX + noseWidth)) <= resizeHandleSize &&
    Math.abs(y - (noseY + noseHeight)) <= resizeHandleSize
  );
}

function isNearRotationHandle(x, y) {
  const handleX = noseX + noseWidth / 2;
  const handleY = noseY - rotationHandleLength;
  const distance = Math.sqrt((x - handleX) ** 2 + (y - handleY) ** 2);
  return distance <= 10;
}

downloadBtn.addEventListener('click', () => {
  // Draw the image without handles
  drawNose(false);
  
  // Create a temporary link element
  const link = document.createElement('a');
  link.download = 'meme.png';
  link.href = memeCanvas.toDataURL('image/png');
  
  // Trigger the download
  link.click();
  
  // Redraw the image with handles
  drawNose(true);
});

resetBtn.addEventListener('click', () => {
    // Clear the entire canvas
    ctx.clearRect(0, 0, memeCanvas.width, memeCanvas.height);
    
    // Reset the userImage and noseImage variables
    userImage = new Image();
    userImage.crossOrigin = 'anonymous';
    ctx.drawImage(userImage, 0, 0);
    noseImage = new Image();
    noseImage.src = 'nosev1.png';
    noseImage.crossOrigin = 'anonymous';
    
    // Reset the nose position, size, and rotation
    noseX = 0;
    noseY = 0;
    noseWidth = 100;
    noseHeight = 100;
    noseRotation = 0;
    
    // Clear the file input
    imageUpload.value = '';
  });

  // Get a reference to the container element where you want to append the nose images
const containerElement = document.querySelector('.background-pattern');

// Function to create and append the nose image elements
function createNoseImages() {
  for (let i = 1; i <= 20; i++) {
    const noseImage = document.createElement('div');
    noseImage.classList.add('nose-image');
    containerElement.appendChild(noseImage);
  }
}

// Call the createNoseImages function to create and append the nose images
createNoseImages();

memeCanvas.addEventListener('touchstart', handleTouchStart, { passive: false });
memeCanvas.addEventListener('touchmove', handleTouchMove, { passive: false });
memeCanvas.addEventListener('touchend', handleTouchEnd, { passive: false });
memeCanvas.addEventListener('touchcancel', handleTouchCancel, { passive: false });

function handleTouchStart(e) {
    e.preventDefault(); // Prevent default touch behavior
    const touch = e.touches[0]; // Get the first touch point
    const rect = memeCanvas.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;
  
    if (
        mouseX >= noseX &&
        mouseX <= noseX + noseWidth &&
        mouseY >= noseY &&
        mouseY <= noseY + noseHeight
      ) {
        isDragging = true;
        startX = mouseX - noseX;
        startY = mouseY - noseY;
      } else if (isNearResizeHandle(mouseX, mouseY)) {
        isResizing = true;
        startX = mouseX;
        startY = mouseY;
        startWidth = noseWidth;
        startHeight = noseHeight;
      } else if (isNearRotationHandle(mouseX, mouseY)) {
        isRotating = true;
        const centerX = noseX + noseWidth / 2;
        const centerY = noseY;
        startRotation = Math.atan2(mouseY - centerY, mouseX - centerX) * 180 / Math.PI - noseRotation;
      }

  }
  
  function handleTouchMove(e) {
    e.preventDefault(); // Prevent default touch behavior
    const touch = e.touches[0]; // Get the first touch point
    const rect = memeCanvas.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;
  
    if (isDragging) {
        noseX = mouseX - startX;
        noseY = mouseY - startY;
        drawNose();
      } else if (isResizing) {
        noseWidth = Math.max(20, mouseX - noseX);
        noseHeight = Math.max(20, mouseY - noseY);
        drawNose();
      } else if (isRotating) {
        const centerX = noseX + noseWidth / 2;
        const centerY = noseY;
        const angle = Math.atan2(mouseY - centerY, mouseX - centerX) * 180 / Math.PI;
        noseRotation = angle - startRotation;
        drawNose();
      }
  }
  
  function handleTouchEnd(e) {
    e.preventDefault(); // Prevent default touch behavior
  
    isDragging = false;
    isResizing = false;
    isRotating = false;
  }

  function handleTouchCancel(e) {
    e.preventDefault(); // Prevent default touch behavior
  
    // Reset any ongoing touch interactions
    isDragging = false;
    isResizing = false;
    isRotating = false;
  }