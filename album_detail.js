
let id;

function populate(json) {
  setTimeout(3000);
  let tracklistHtml = json.albums[id].tracklist.map(track => `<li>${track}</li>`).join("");
  document.getElementById("album").innerHTML = `
    <div class="container mt-4">
      <div class="row justify-content-center d-flex align-items-stretch">
        <!-- Album details and image column -->
        <div class="col-md-6">
          <div class="card mb-4" style="width: 100%;">
            <img src="${json.albums[id].cover}" alt="${json.albums[id].name} Cover" class="card-img-top"/>
          </div>
          <div class="card" style="width: 100%;">
            <div class="card-body">
              <p><strong>Name:</strong> ${json.albums[id].name}</p>
              <p><strong>Artist:</strong> ${json.albums[id].artist}</p>
              <p><strong>Released:</strong> ${json.albums[id].year}</p>
              <p><strong>Genres:</strong> ${json.albums[id].genres.join(', ')}</p>
            </div>
          </div>
        </div>

        <!-- Tracklist column -->
        <div class="col-md-4">
          <div class="card" style="width: 100%;">
            <div class="card-body">
              <h3>Track List</h3>
              <ul>
                ${tracklistHtml}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}


function fetchUser() {
  
  return new Promise((resolve, reject) => {
    fetch("./data.json")
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
        id = localStorage.getItem("albumDetails");
        populate(data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
}

fetchUser();