$(document).ready(function () {
  const artistInput = $("#search-input");
  const leftContainer = $("#left-container"); // Container to display results

  const settings = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "54c8dfbd4dmshc1bdeeb54f4a2cfp151f6djsn268c474afaf3",
      "X-RapidAPI-Host": "spotify-scraper.p.rapidapi.com",
    },
  };

  // Function to save data to local storage
  // function saveDataToLocalStorage(data) {
  //   localStorage.setItem("artitstData", JSON.stringify(data));
  // }

  // Function to load data from local storage
  // function loadFromLocalStorage() {
  //   const storedData = JSON.parse(localStorage.getItem("displayedData"));

  //   if (storedData) {
  //     // Display the stored data on the page
  //     displayArtistData(storedData);
  //   }
  // }

  function getArtistDataByName() {
    const artist = artistInput.val();
    const queryURL1 = `https://spotify-scraper.p.rapidapi.com/v1/artist/search?name=${artist}`;
    fetch(queryURL1, settings)
      .then((response) => response.json())
      .then((data) => {
        getArtistDataByID(data.id);
      });
  }

  function getArtistDataByID(artistID) {
    const queryURL2 = `https://spotify-scraper.p.rapidapi.com/v1/artist/overview?artistId=${artistID}`;

    fetch(queryURL2, settings)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        displayArtistData(data);
      });
  }

  function displayArtistData(data) {
    //Collect all important data from API
    let artistName = data.name;
    let discography = data.discography.topTracks;
    let artistImage = data.visuals.gallery[0][0].url;
    let song = data.shareUrl;

    // Create an array of top tracks with name and a random image URL
    let topTracksArray = discography.map(function (track) {
      // Get a random album cover URL
      let randomTrackImage =
        track.album.cover[Math.floor(Math.random() * track.album.cover.length)];

      return {
        trackImage: randomTrackImage.url,
        trackName: track.name,
        trackLength: track.durationText,
      };
    });

    // Display the data in the left container
    leftContainer.empty(); // Clear previous results

    // Create HTML elements and append them to the left container
    let heroContainer = $("<div class='hero-container'>");
    heroContainer.append(
      `<img class="hero-image" src="${artistImage}" alt="${artistName}">`
    );
    heroContainer.append(`<div class="overlay"></div>`);
    heroContainer.append(`<div class="hero-text">${artistName}</div>`);
    // Append the hero image to the herocontainer
    leftContainer.append(heroContainer);

    // Create and append a container div for tracks
    let trackContainer = $("<div class='track-container'>");

    // Create and append the entire list of top tracks
    let trackList = $(`<div>`);
    topTracksArray.forEach((track, index) => {
      trackList.append(
        `<div class="flex-container"> 
        <div class="flex-item">${index + 1}</div> 
        <div class="flex-item"> <img class="track-image " src="${
          track.trackImage
        }"></div>
        <div class="flex-item">${track.trackName}</div> 
        <div class="flex-item">${track.trackLength}</div> 
        <div class="flex-item"><a href="${song}" target="_blank">Go to playlist</a></div>
        </div> `
      );
    });

    // Append the entire list to the track container
    $("<p>")
      .text("Popular Songs")
      .addClass("track-header")
      .appendTo(trackContainer);

    trackContainer.append(trackList);

    // Append the track container to the leftcontainer
    leftContainer.append(trackContainer);
  }

  // loadFromLocalStorage();
  $("#search-form").submit(function (event) {
    event.preventDefault();
    getArtistDataByName();
  });
});
