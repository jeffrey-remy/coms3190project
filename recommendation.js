function displayRecommendation(albums) {
    const arrayRecommendations = albums.recommendations;
    const arrayAlbums = albums.albums;

    // iterate through recommendations and get the first one marked as active
    let recommendedAlbum = "";
    let n = 0;
    while (!recommendedAlbum) {
        let rec = arrayRecommendations[n];
        if (rec.active) {
            recommendedAlbum = rec;
        }
        n++;
    }

    // iterate through data.json to find matching album by title
    let albumDetails;
    for (let album of arrayAlbums) {
        if (album.name === recommendedAlbum.albumName) {
            albumDetails = album;
        }
    }

    let title = albumDetails.name;
    let cover = albumDetails.cover;
    let artist = albumDetails.artist;
    let year = albumDetails.year;
    let genres = albumDetails.genres;

    let review = recommendedAlbum.review;
    let rating = recommendedAlbum.rating;

    // update html in recommendation.html
    let recommendationDiv = document.getElementById("recommendationSection");
    recommendationDiv.innerHTML = "";

    let recommendationItem = document.createElement("div");
    recommendationItem.innerHTML = `
        <div class="card">
            <div class="embed-responsive embed-responsive-1by1">
                <img class="card-img-top embed-responsive-item" src="${cover}" alt="Album cover of ${title}">
            </div>
        </div>
    `;
    recommendationDiv.appendChild(recommendationItem);

    let recommendationText = document.getElementById("recommendationText");
    let recommendationTextItem = document.createElement("div"); 
    recommendationTextItem.innerHTML = `
        <div class="container">
            <h2><a href="#" onclick="loadAlbumDetailsPage('${title}')" style="text-decoration: none;">${title}</a></h2>
            <h4>by ${artist}</h4>
            <h6>${year}</h6>
            <h6>${genres.join(', ')}</h6>
            <br>
            <p>${review}</p>
            <h3>Our Rating: ${rating}/5</h3>
        </div>
    `
    recommendationText.appendChild(recommendationTextItem);
}

// if user clicks on a specific album, load the album detail page with that album
function loadAlbumDetailsPage(title) {
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
            let albumDetailUrl = window.location.href.replace("catalog.html", "album_detail.html");
            console.log(albumDetailUrl);
            window.location.replace(albumDetailUrl);
        })
        .catch(err => console.log("Error: " + err));
}

// get current recommendation from data.json and load it into recommendation.html
function getRecommendation() {
    fetch("data.json")
        .then(response => response.json())
        .then(albums => displayRecommendation(albums))
        .catch(err => console.log("Error: " + err));
}

getRecommendation();