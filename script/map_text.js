var options = document.getElementById("dataset-select");

var text = document.getElementById("map-text");

writeResult();

options.addEventListener('change', writeResult);

function writeResult() {
    var selected = options.value;

    console.log(options);

    let out;

    if (selected == "tx")
    {
        out = "Incidence refers to the number of people testing positive for COVID relative to the total number of people per department. This measure generally correlates with the population density of France, with a few interesting notes. Paris actually isn’t that bad, with by far the highest population density with not the worst incidence rates. That award goes to the departments of Rhône and Bouches du Rhone, home to the cities of Lyon and Marseille respectively.";
    } else if (selected == "to") {
        out = "Occupancy rates refer to the proportion of COVID patients in intensive care units relative to the number of total beds in hospitals. Unsurprisingly, this correlates strongly to population density, with Île-de-France, home to Paris, having the highest occupancy rate.";
    } else {
        out = "Virus reproduction is the average number of people that an infected person can contaminate. The Course region, which is an island, has the worst rates for this measure. This may be due to the closed off nature of the landmass.";
    }

    text.innerHTML = '<p>'+out+'</p>'
}