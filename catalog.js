function loadAlbums(albums, genre, search) {
    const arrayAlbums = albums.albums;

    // get all genres and number of albums with each given genre 
    let genreCounts = countGenres(arrayAlbums);

    // use genreCounts to construct genre options for genre filter dropdown
    let genreDropdown = document.getElementById("genre-selector");
    genreDropdown.innerHTML = `
        <li><a class="dropdown-item" href="#" onclick="displayAlbumsDefault()">All Genres</a></li>
        <li><hr class="dropdown-divider"></li>
    `;
    for (let genrePair of genreCounts) {
        let genreOption = document.createElement("li");

        // create each genre option with name and number of albums in the catalog associated with the genre
        genreOption.innerHTML = `
            <li><a class="dropdown-item" href="#" onclick="displayAlbumsByGenre('${genrePair[0]}')">${genrePair[0]} (${genrePair[1]})</a></li>
        `;
        genreDropdown.appendChild(genreOption);
    }

    
    let filteredAlbums = [];
    // if genre is nonempty, filter by that genre
    console.log(genre);
    if (genre) {
        for (let album of arrayAlbums) {
            // only include album if it has the specified genre
            if (album.genres.includes(genre)) {
                filteredAlbums.push(album);
            }
        }
    }
    // otherwise, show all albums 
    else {
        filteredAlbums = arrayAlbums;
    }

    var albumCatalog = document.getElementById("album-catalog");
    albumCatalog.innerHTML = "";

    for (let i = 0; i < filteredAlbums.length; i++) {
        let album = filteredAlbums[i];
        
        let title = album.name;
        let artist = album.artist;
        let year = album.year;
        let genres = album.genres;
        let cover = album.cover;

        // construct Bootstrap card containing album details
        let albumCard = document.createElement("div");
        albumCard.innerHTML = `
            <div class="card">
                <div class="embed-responsive embed-responsive-1by1">
                    <img class="card-img-top embed-responsive-item" src="${cover}" alt="Album cover of ${title}">
                </div>
                <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">${artist}</p>
                    <p class="card-text"><small class="text-muted">${year}</small></p>
                </div>
            </div>
        `;
        albumCatalog.appendChild(albumCard);
    }
}

// go through the given albums and count the genres they are described as
// return a sorted map with genre name keys and integer values representing the count (i.e., "Rock": 5)
function countGenres(albums) {
    let genreCounts = new Map();
    for (let i = 0; i < albums.length; i++) {
        let album = albums[i];

        // iterate through the album's genres
        for (let j = 0; j < album.genres.length; j++) {
            let genre = album.genres[j];
            // check if a given genre has already been found
            if (genreCounts.has(genre)) {
                // if so, increment the value by 1
                let currCount = genreCounts.get(genre);
                genreCounts.set(genre, currCount + 1);
            }
            // if it has not been found, add it to the map
            else {
                genreCounts.set(genre, 1);
            }
        }
    }

    // create a sorted map in decreasing order of counts
    let sortedMap = new Map([...genreCounts.entries()].sort((a, b) => b[1] - a[1]))

    // return final sorted map
    return sortedMap;
}

function displayAlbumsDefault() {
    fetch("./data.json")
        .then(response => response.json())
        .then(albums => loadAlbums(albums, "", ""))
        .catch(err => console.log("Error: " + err)); 
}

// load all albums matching a specified genre
function displayAlbumsByGenre(genre) {
    fetch("./data.json")
        .then(response => response.json())
        .then(albums => loadAlbums(albums, genre, ""))
        .catch(err => console.log("Error: " + err)); 
}

displayAlbumsDefault();