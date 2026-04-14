const cards = document.querySelectorAll(".card");
const overlay = document.getElementById("overlay");
const overlayImg = document.getElementById("overlay-img");
const overlayText = document.getElementById("overlay-text");

cards.forEach(card => {
  card.addEventListener("click", () => {

    const img = card.querySelector("img");

    overlay.appendChild(overlayImg);
    overlay.appendChild(overlayText);
    overlayImg.style.display = "flex";
    overlayImg.src = img.src;

    console.log("test");
    console.log(overlayText);

    let out;

    switch (card.id) {
      case "chart2":
        out = "Graphing the incidence of new COVID cases 3 years from the outset of the pandemic reveals some interesting patterns. Comprehensive reporting didn’t start for cases until mid-May, when France’s first lockdown was ending. From this point you can see cases start to rise in August, all the way until October when France shuts down again. Cases finally start to get under control with vaccination and distancing measures throughout 2021. In the beginning of 2022, we see a huge spike in cases with the Omicron variant, which was far more contagious than previous variants of the disease.";
        break;
      case "chart3":
        out = "Deaths tend to follow a similar pattern to cases, but there’s a huge spike in deaths right at the pandemic’s onset. As the pandemic continued in full swing during late 2020 and early 2021, death rates remained high. The increase in preparation and knowledge of the disease likely helped France get death rates under control as time went on, however. Deaths do once again spike when Omicron spreads in early 2022.";
        break;
      case "chart4":
        out = "After the COVID vaccine’s release in late 2020, French vaccination efforts begin in full in early 2021. This graph shows new incidences of full vaccination courses, when a person received the recommended dosage for each vaccine type. Even with the rise of the Omicron variant in early 2022, vaccination rates never reach the heights that they did earlier in the pandemic.";
        break;
      default:
        out = "error";
        break;
    }

    overlayText.innerHTML = '<p>'+out+'</p>';

    overlay.style.display = "flex";
  });
});

// ❌ close overlay
overlay.addEventListener("click", () => {
  overlay.style.display = "none";
});