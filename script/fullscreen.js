const cards = document.querySelectorAll(".card");
const overlay = document.getElementById("overlay");
const overlayImg = document.getElementById("overlay-img");

cards.forEach(card => {
  card.addEventListener("click", () => {

    const img = card.querySelector("img");
    const svg = card.querySelector("svg");

    // 🖼 IMAGE CARD
    if (img) {
      overlay.innerHTML = ""; // clear previous SVG
      overlay.appendChild(overlayImg);
      overlayImg.style.display = "block";
      overlayImg.src = img.src;
    }

    // 📊 SVG CARD
    else if (svg) {
      overlay.innerHTML = ""; // clear image
      const clone = svg.cloneNode(true);
      overlay.appendChild(clone);
      overlayImg.style.display = "none";
    }

    overlay.style.display = "flex";
  });
});

// ❌ close overlay
overlay.addEventListener("click", () => {
  overlay.style.display = "none";
});