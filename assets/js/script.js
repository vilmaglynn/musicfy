$(document).ready(function () {
  const artistInput = $("#search-input");
  // const artist = "shakira";

  const settings = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "05590d6c50mshce3a96a4426dc93p174072jsn44959a1b3b77",
      "X-RapidAPI-Host": "spotify-scraper.p.rapidapi.com",
    },
  };

  function getArtistDataByName() {
    const artist = artistInput.val();
    const queryURL1 = `https://spotify-scraper.p.rapidapi.com/v1/artist/search?name=${artist}`;
    fetch(queryURL1, settings)
      .then((response) => response.json())
      .then((data) => {
        getArtistDataByID(data.id);
        // Fetch #2 to get the details now that we know the id
      });
  }

  function getArtistDataByID(artistID) {
    const queryURL2 = `https://spotify-scraper.p.rapidapi.com/v1/artist/overview?artistId=${artistID}`;

    fetch(queryURL2, settings)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        let artistName = data.name;
        let biography = data.biography;
        let discography = data.discography.topTracks;
        let totalAlbums = data.discography.albums.totalCount;
        let artistImage = data.visuals.gallery[0][0].url;
        let topTrack1 = discography[0];
        // console.log(biography);
        console.log(artistName);
        console.log(artistImage);
        console.log(`Total Albums: ${totalAlbums}`);
        console.log(discography);

        // Create an array of top tracks with name and a random image URL
        let topTracksArray = discography.map(function (track, index) {
          // Get a random album cover URL
          let randomTrackImage =
            track.album.cover[
              Math.floor(Math.random() * track.album.cover.length)
            ];

          return {
            trackNumber: `${index + 1} -`,
            trackImage: randomTrackImage.url,
            trackName: track.name,
          };
        });

        console.log(artistName);
        console.log(topTracksArray);
      });
  }

  $("#search-form").submit(function (event) {
    event.preventDefault();
    getArtistDataByName();
  });
});
