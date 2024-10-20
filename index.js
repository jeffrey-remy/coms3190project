function addAlbumsToCarousel(albums) {
    const arrayAlbums = albums.albums;
    
    // generate 3 unique random indices; get the albums at these generated indices
    let randomIndices = [];
    let numberOfAlbums = 3;
    while (randomIndices.length != numberOfAlbums) {
        let randNum = Math.floor(Math.random() * arrayAlbums.length);
        
        // only include unique indices
        if (!randomIndices.includes(randNum)) {
            randomIndices.push(randNum);
        }
    }

    let activeAssigned = false;
    // add albums with given indices from data.json to carousel
    let carousel = document.getElementById("home-carousel");
    carousel.innerHTML = "";
    for (let index of randomIndices) {
        let album = arrayAlbums[index];

        let cover = album.cover;
        let title = album.name;
        let artist = album.artist;

        // first item should be active
        let active = "";
        if (!activeAssigned) {
            active = "active";
            activeAssigned = true;
        }

        console.log(active);

        let carouselItem = document.createElement("div");
        carouselItem.innerHTML = `
            <div class="carousel-item ${active}">
                <a href ="#" onclick="loadAlbumDetailsPage('index.html', '${title}')">
                    <img class="d-block w-100" src="${cover}" alt="First slide">
                    <div style="background-color: rgba(0, 0, 0, 0.5);" class="carousel-caption d-none d-md-block">
                        <h4>${title}</h4>
                        <p>${artist}</p>
                    </div>
                </a>
            </div>
        `;
        carousel.appendChild(carouselItem);
    }
}

// if user clicks on a specific album, load the album detail page with that album
function loadAlbumDetailsPage(incomingPage, title) {
    // get index of selected album in data.json
    fetch("./data.json")
        .then(response => response.json())
        .then(albums => {
            let arrayAlbums = albums.albums;
            let index = 0;
            for (let i = 0; i < arrayAlbums.length; i++) {
                // if album title matches the specified title, this is the right index
                if (arrayAlbums[i].name === title) {
                    index = i;
                }
            }
            // set index into localStorage, to be retrieved in album_detail.js
            localStorage.setItem("albumDetails", index);
            console.log(localStorage.getItem("albumDetails"));

            // then load album_detail.html
            let albumDetailUrl = window.location.href.replace(incomingPage, "album_detail.html");
            console.log(albumDetailUrl);
            window.location.replace(albumDetailUrl);
        })
        .catch(err => console.log("Error: " + err));
}

// add random albums from data.json to the carousel on the home page 
function populateCarousel() {
    fetch("data.json")
        .then(response => response.json())
        .then(albums => addAlbumsToCarousel(albums))
        .catch(err => console.log("Error: " + err));
}

// defined albumDetails in localStorage for later use
localStorage.setItem("albumDetails", -1);

populateCarousel();