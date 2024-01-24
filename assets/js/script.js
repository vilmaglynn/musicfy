$(document).ready(function () {
  const artistInput = $("#search-input");
  const leftContainer = $("#left-container"); // Container to display results
  const searchHistoryContainer = $("#searchHistoryContainer");

  const settings = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "e913f3ef8emsh776ddc5b5ecbbf6p1291ffjsn57259e810f11",
      "X-RapidAPI-Host": "spotify-scraper.p.rapidapi.com",
    },
  };

  // Function to save data to local storage
  function saveDataToLS(artist) {
    let artistHistory = JSON.parse(localStorage.getItem("artitstData")) || [];

    const alreadyInHistory = artistHistory.find(
      (artistFromLS) => artistFromLS === artist
    );

    if (!alreadyInHistory) {
      artistHistory.unshift(artist);
    }

    if (artistHistory.length > 5) {
      artistHistory.pop();
    }

    localStorage.setItem("artitstData", JSON.stringify(artistHistory));
  }

  // Function to load data from local storage
  function loadFromLocalStorage() {
    const artitstData = JSON.parse(localStorage.getItem("artitstData"));

    if (artitstData) {
      // Display the stored data on the page
      renderSearchHistory(artitstData);
    }
  }

  function renderSearchHistory(searchHistory) {
    searchHistoryContainer.empty();
    searchHistory.forEach((artist) => {
      const searchBtn = $("<button>");
      searchBtn.addClass("btn btn-secondary");
      searchBtn.text(artist);
      searchHistoryContainer.append(searchBtn);
    });
  }

  function getArtistDataByName() {
    const artist = artistInput.val();
    const queryURL1 = `https://spotify-scraper.p.rapidapi.com/v1/artist/search?name=${artist}`;
    fetch(queryURL1, settings)
      .then((response) => response.json())
      .then((data) => {
        getArtistDataByID(data.id);
      });
    saveDataToLS(artist);
    loadFromLocalStorage();
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

  $("#searchForm").submit(function (event) {
    event.preventDefault();
    getArtistDataByName();
  });

  // right container js code

  // New York Times API key and initialize the keyword with the last search term from localStorage or an empty string
  const apiKey = "1BKwuA8RAsCAYeeHCHUSDnV2SOhrOL48";
  // Get the last search input from localStorage or default to an empty string
  let keyword = localStorage.getItem("searchKeyword") || "";
  const pageSize = 6;

  // Get HTML elements using their IDs
  const searchInput = document.getElementById("searchButton");
  const searchButton = document.getElementById("search-input");
  const articlesContainer = document.getElementById("articlesContainer");

  // Function to fetch articles based on the current search
  const fetchArticles = (searchTerm) => {
    // API URL with the keyword and API key
    const queryURL = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchTerm}&api-key=${apiKey}`;

    // Fetch data from the API
    fetch(queryURL)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // Display the fetched articles
        displayArticles(data.response.docs);
        // Save the current keyword to localStorage
        localStorage.setItem("searchKeyword", searchTerm);
      })
      .catch((error) => {
        console.error("Error fetching articles:", error);
      });
  };

  // Function to display articles in the HTML
  const displayArticles = (articles) => {
    if (articles && articles.length > 0) {
      // Clear the articles container
      articlesContainer.innerHTML = "";

      // Use pageSize variable to control the number of articles displayed
      const articlesToDisplay = articles.slice(0, pageSize);

      // Iterate through articles, creating Bootstrap cards and get them into rows
      for (let i = 0; i < articlesToDisplay.length; i += 2) {
        const row = document.createElement("div");
        row.classList.add("row", "mb-4");

        const col1 = document.createElement("div");
        col1.classList.add("col-md-6");

        // Create a card for the first article
        const card1 = createCard(articlesToDisplay[i]);
        col1.appendChild(card1);

        const col2 = document.createElement("div");
        col2.classList.add("col-md-6");

        // Create a card for the second article
        const card2 = createCard(articlesToDisplay[i + 1]);
        col2.appendChild(card2);

        // Add columns to the row
        row.appendChild(col1);
        row.appendChild(col2);

        // Add the row to the articles container
        articlesContainer.appendChild(row);
      }
    }
  };

  // Function to create a Bootstrap card for an article
  const createCard = (article) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const date = new Date(article.pub_date);

    card.innerHTML = `
    <div class="card-body">
      <h4 class="card-title">${article.headline.main}</h4>
      <p class="card-text">${date.toDateString()}</p>
      <a href="${
        article.web_url
      }" target="_blank" class="btn btn-primary">Read Full Article</a>
    </div>
  `;

    return card;
  };

  // Unified search function for both button click and Enter key press
  const handleSearch = () => {
    // const searchTerm = searchInput.value.trim();
    const searchTerm = artistInput.val();
    console.log(searchTerm);

    if (searchTerm !== "") {
      fetchArticles(searchTerm);
    } else {
      console.error("Please enter a keyword before searching.");
    }
  };

  // Event listener for the search button click
  $("#searchForm").submit(function (e) {
    e.preventDefault();
    handleSearch();
  });

  loadFromLocalStorage();

  // Initial fetch when the page loads
});
