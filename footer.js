// load footer from footer.html
function loadFooter() {
fetch("footer.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("footer").innerHTML = data;
    })
    .catch(error => console.log("Error loading footer:", error));
}

// Call the function to load the footer when the page loads
loadFooter();