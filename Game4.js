// Game variables
const bin = document.getElementById("bin");
const message = document.getElementById("message");
const levelDisplay = document.getElementById("level");
const bgMusic = document.getElementById("bgMusic");
const catchSound = document.getElementById("catchSound");

const trashTypes = ["🍌","🍕","🥨","🥑","🥐"];
let level = 1;
let trashCount = 3;
let recycled = 0;
let started = false;

document.body.addEventListener("click", () => {
  if (!started) {
    started = true;
    bgMusic.play();
    startGame();
  }
});

function startGame() {
  levelDisplay.textContent = "Level " + level;
  message.textContent = "Catch the trash and drop it in the bin!";
  createTrash(trashCount);
  chaosLoop();
}

function createTrash(num) {
  for (let i = 0; i < num; i++) {
    const trash = document.createElement("div");
    trash.className = "trash";
    trash.textContent = trashTypes[Math.floor(Math.random()*trashTypes.length)];
    trash.style.fontSize = (50 - level*2) + "px";
    trash.style.left = Math.random()*80 + "vw";
    trash.style.top = Math.random()*60 + "vh";
    trash.draggable = true;

    // Drag start
    trash.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", "trash");
      trash.dataset.dragging = "true";
    });

    // Drag end
    trash.addEventListener("dragend", () => {
      trash.dataset.dragging = "";
    });

    document.body.appendChild(trash);
  }
}

// Bin drop logic
bin.addEventListener("drop", e => {
  const draggingTrash = document.querySelector(".trash[data-dragging='true']");
  if (draggingTrash) {
    catchSound.currentTime = 0;
    catchSound.play();
    draggingTrash.remove();
    recycled++;
    bin.style.transform = "scale(1.3)";
    setTimeout(() => bin.style.transform = "scale(1)", 200);

    if (document.querySelectorAll(".trash").length === 0) {
      nextLevel();
    }
  }
});

function nextLevel() {
  level++;
  trashCount += 2;
  levelDisplay.textContent = "Level " + level;
  message.textContent = "Level up! New trash incoming...";
  setTimeout(() => {
    createTrash(trashCount);
  }, 1000);
}

// Trash wiggle / escape logic
document.addEventListener("mousemove", e => {
  document.querySelectorAll(".trash").forEach(trash => {
    const rect = trash.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width/2);
    const dy = e.clientY - (rect.top + rect.height/2);
    const distance = Math.sqrt(dx*dx + dy*dy);
    if (distance < 100) {
      trash.style.left = Math.min(window.innerWidth-50, Math.max(0, rect.left - dx/10)) + "px";
      trash.style.top = Math.min(window.innerHeight-50, Math.max(0, rect.top - dy/10)) + "px";
    }
  });
});

// Random chaos with cat paw 
function chaosLoop() {
  if (Math.random() < 0.002) {
    message.textContent = "🐾 A cat shuffled the trash!";
    document.querySelectorAll(".trash").forEach(trash => {
      trash.style.left = Math.random()*80 + "vw";
      trash.style.top = Math.random()*60 + "vh";
      trash.classList.add("wiggle");
      setTimeout(() => trash.classList.remove("wiggle"), 1000);
    });
  }
  requestAnimationFrame(chaosLoop);
}
