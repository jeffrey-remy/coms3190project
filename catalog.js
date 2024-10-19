function loadAlbums(albums, filter) {
    const arrayAlbums = albums.albums;

    console.log(arrayAlbums);

    // by default, show all albums without a filter
    let filteredAlbums = arrayAlbums;

    // if filter is nonempty, check for a more specific filter to apply to filteredAlbums
    if (filter) {

    }

    var albumCatalog = document.getElementById("album-catalog");
    albumCatalog.innerHTML = "";

    console.log(filteredAlbums.length);
    for (let i = 0; i < filteredAlbums.length; i++) {
        let album = filteredAlbums[i];

        console.log(album);
        
        let title = album.name;
        let artist = album.artist;
        let year = album.year;
        let genres = album.genres;
        let cover = album.cover;

        console.log(title);

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

function defaultDisplayAlbums() {
    fetch("./data.json")
        .then(response => response.json())
        .then(albums => loadAlbums(albums, ""))
        .catch(err => console.log("Error: " + err)); 
}

defaultDisplayAlbums();