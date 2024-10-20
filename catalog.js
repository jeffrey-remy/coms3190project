function loadAlbums(albums, genre, query, artist, year, sort) {
    const arrayAlbums = albums.albums;

    // get all genres and number of albums with each given genre 
    let genreCounts = countGenres(arrayAlbums);

    // use genreCounts to construct genre options for genre filter dropdown
    let genreDropdown = document.getElementById("genre-selector");
    genreDropdown.innerHTML = `
        <li><a class="dropdown-item" href="#" onclick="displayAlbumsWithoutGenre()">All Genres</a></li>
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

    // update catalog page to reflect current genre being browsed
    let pageName = document.getElementById("catalog-page-name");
    // default title
    pageName.innerHTML = `<h2>All Albums</h2>`;

    // genre dropdown element; update if user selects a genre
    let genreDropdownTop = document.getElementById("genre-selector-top");
    // default genre selection
    genreDropdownTop.innerHTML = "Genre";

    // if sort is 3 (sorting by artist names alphabetically) then we do not want to filter by artist
    if (sort === 3) {
        artist = "";
    }

    // if genre is nonempty, filter by that genre
    if (genre) {
        for (let album of arrayAlbums) {
            // only include album if it has the specified genre
            if (album.genres.includes(genre)) {
                filteredAlbums.push(album);
            }
        }

        // update genre being browsed at top of page
        pageName.innerHTML = `<h2>All ${genre} Albums</h2>`;

        // update dropdown selection
        genreDropdownTop.innerHTML = genre;
    }
    // if query is nonempty, filter albums by the given query
    else if (query) {
        // only include albums that have a title or artist name that contains the query
        for (let album of arrayAlbums) {
            if (album.name.toLowerCase().includes(query) || album.artist.toLowerCase().includes(query)) {
                filteredAlbums.push(album);
            }
        }

        // update page to reflect search
        pageName.innerHTML = `<h2>Results For "${query}"</h2>`
    }
    // if artist is nonempty, filter albums by the given artist
    else if (artist) {
        // only include albums that match the artist name
        for (let album of arrayAlbums) {
            if (album.artist === artist) {
                filteredAlbums.push(album);
            }
        }

        // update page to reflect browsing artist
        pageName.innerHTML = `<h2>All Albums By ${artist}</h2>`
    }
    // if year is nonzero, filter albums by the given year
    else if (year) {
        // only include albums that released in the specified year
        for (let album of arrayAlbums) {
            if (album.year === year) {
                filteredAlbums.push(album);
            }
        }

        // update page to reflect browsing year
        pageName.innerHTML = `<h2>All Albums Released In ${year}</h2>`
    }
    // otherwise, show all albums 
    else {
        filteredAlbums = arrayAlbums;
    }

    // dropdown element to update based on sort
    let sortDropdownTop = document.getElementById("sort-selector-top");

    // if there is a specified sort, apply it to filteredAlbums
    if (sort === 0) {
        // chronological order
        filteredAlbums = filteredAlbums.sort((a, b) => a.year - b.year);
        // update dropdown
        sortDropdownTop.innerHTML = "Oldest To Newest";
    }
    else if (sort === 1) {
        // reverse chronological order
        filteredAlbums = filteredAlbums.sort((a, b) => b.year - a.year);
        // update dropdown
        sortDropdownTop.innerHTML = "Newest To Oldest";
    }
    else if (sort === 2) {
        // alphabetical titles
        filteredAlbums = filteredAlbums.sort((a, b) => (a.name > b.name) ? 1 : (a.name < b.name) ? -1 : 0);
        // update dropdown
        sortDropdownTop.innerHTML = "Title: A-Z";
    }
    else if (sort === 3) {
        // alphabetical artist names
        filteredAlbums = filteredAlbums.sort((a, b) => (a.artist > b.artist) ? 1 : (a.artist < b.artist) ? -1 : 0);
        // update dropdown
        sortDropdownTop.innerHTML = "Artist: A-Z";
    }
    else {
        sortDropdownTop.innerHTML = "Sort";
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
                    <a href="#" onclick="loadAlbumDetailsPage('${title}')"><img class="card-img-top embed-responsive-item" src="${cover}" alt="Album cover of ${title}"></a>
                </div>
                <div class="card-body">
                    <a href="#" style="text-decoration: none;" onclick="loadAlbumDetailsPage('${title}')"><h5 class="card-title">${title}</h5></a>
                    <a class="card-text" href="#" style="text-decoration: none;" onclick="displayAlbumsByArtist('${artist}')">${artist}</a>
                    <p class="card-text"><a class="text-muted" href="#" style="text-decoration: none;" onclick="displayAlbumsByExactYear(${year})">${year}</a></p>
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

function clearQuery() {
    currentQuery = "";
    // clear search query box
    let searchBox = document.getElementById("catalog-search");
    searchBox.value = "";
}

function resetFilters() {
    currentGenre = "";
    currentArtist = "";
    currentYear = 0;
    currentSort = -1;
    clearQuery();
}

function displayAlbumsDefault() {
    resetFilters();
    displayAlbums();
}

// load all albums matching a specified genre
function displayAlbumsByGenre(genre) {
    currentGenre = genre;
    currentArtist = "";
    currentYear = 0;
    clearQuery();

    displayAlbums();
}

// load all albums by a specific artist 
function displayAlbumsByArtist(artist) {
    currentArtist = artist;
    currentGenre = "";
    currentYear = 0;
    clearQuery();

    displayAlbums();
}

// load all albums with title or artist name matching a search query
function displayAlbumsBySearch() {
    // if submitted query is empty, ignore it (so we don't waste resources reloading page)
    let query = document.getElementById("catalog-search").value.toLowerCase();
    if (query) {
        // clear all other filters
        currentGenre = "";
        currentYear = 0;
        currentArtist = "";
        currentSort = -1;

        // update current query
        currentQuery = query;

        displayAlbums();
    }
}

// load all albums released in a specific year
function displayAlbumsByExactYear(year) {
    currentArtist = "";
    currentGenre = "";
    currentYear = year;
    clearQuery();

    displayAlbums();
}

// load all albums in a specific order
function displayAlbumsBySort(sort) {
    currentSort = sort;
    clearQuery();

    displayAlbums();
}

// remove genre from browsing filters
function displayAlbumsWithoutGenre() {
    // go back to default browsing, except for sort
    currentGenre = "";
    currentYear = 0;
    currentArtist = "";
    clearQuery();

    displayAlbums();
}

// remove sort from browsing filters
function displayAlbumsWithoutSort() {
    // update sort back to default, leave everything else as is
    currentSort = -1;
    clearQuery();

    displayAlbums();
}

// update album catalog page based on currently selected filters by user
function displayAlbums() {
    fetch("./data.json")
        .then(response => response.json())
        .then(albums => loadAlbums(albums, currentGenre, currentQuery, currentArtist, currentYear, currentSort))
        .catch(err => console.log("Error: " + err));
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
            window.location.replace("http://127.0.0.1:5500/album_detail.html");
        })
        .catch(err => console.log("Error: " + err));
}

localStorage.setItem("albumDetails", -1);

// keep track of attributes/filter user is currently browsing with
let currentGenre = "";
let currentQuery = "";
let currentArtist = "";
let currentYear = 0;
let currentSort = -1;

displayAlbumsDefault();