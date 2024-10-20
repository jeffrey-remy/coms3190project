  // Function to load the navbar from the external file
  function loadNavbar() {
    fetch("NavBar.html")
      .then(response => response.text())
      .then(data => {
        document.getElementById("navbar").innerHTML = data;
      })
      .catch(error => console.log("Error loading navbar:", error));
  }

  // Call the function to load the navbar when the page loads
  loadNavbar();