import React, { useState, useEffect } from "react";
import styles from "./artStyles.css";
import axios from "axios";

function ArtGenerator() {
  const [timePeriod, setTimePeriod] = useState(null);
  const [artwork, setArtwork] = useState(null);
  const [timePeriodsData, setTimePeriodsData] = useState({});

  const [initialLoad, setInitialLoad] = useState(true);

  // Load the time periods from your JSON file
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/dates.json");
        setTimePeriodsData(response.data);

        // Select a random time period
        selectRandomTimePeriod();
        setInitialLoad(false);
      } catch (error) {
        console.error("Error loading time periods data:", error);
      }
    };

    fetchData();
  }, []);

  // Function to select a random time period and fetch artwork
  const selectRandomTimePeriod = () => {
    const timePeriodKeys = Object.keys(timePeriodsData);
    const randomTimePeriodKey = timePeriodKeys[Math.floor(Math.random() * timePeriodKeys.length)];
    const selectedTimePeriod = timePeriodsData[randomTimePeriodKey];
    setTimePeriod(selectedTimePeriod);

    // Make an API request based on the selected time period
    fetchArtwork(selectedTimePeriod);
  };

  // Function to fetch artwork based on the selected time period
  const fetchArtwork = async (timePeriod) => {
    if (timePeriod) {
      const { "begin-date": beginDate, "end-date": endDate } = timePeriod;
      const apiUrl = `https://collectionapi.metmuseum.org/public/collection/v1/search?isHighlight=true&hasImages=true&dateBegin=${beginDate}&dateEnd=${endDate}&q=painting`;

      try {
        const response = await axios.get(apiUrl);
        const artworkData = response.data.objectIDs;

        if (artworkData && artworkData.length > 0) {
          // Select a random artwork ID from the list
          const randomArtworkID = artworkData[Math.floor(Math.random() * artworkData.length)];

          // Fetch the artwork details
          const artworkDetailsUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${randomArtworkID}`;
          const artworkResponse = await axios.get(artworkDetailsUrl);
          setArtwork(artworkResponse.data);
        } else {
          setArtwork(null); // No artwork found for the selected time period
        }
      } catch (error) {
        console.error("Error fetching artwork:", error);
        setArtwork(null);
      }
    }
  };

  const generateNewArtwork = () => {
    fetchArtwork(timePeriod);
  };

  return (
    <div className="AppWrapper">
      <h1>Ancient Art Roulette</h1>
      
      <div className="upperContent">
      <img src={'/flower.png'} alt="fleur" width='70'/>
      <button className = "buttons" onClick={selectRandomTimePeriod}>Generate a Random Time Period</button>
      <img src={'/flower.png'} alt="fleur" width='70'/>
      </div>
      
      {timePeriod && (
        <div className="lowerContent">
          <div className="timePeriodText">
          <p>{timePeriod["begin-date"]} AD - {timePeriod["end-date"]} AD</p>
          </div>
          {artwork ? (
            <div>
              <h2>Artwork Selected from the Metropolitan Museum of Art:</h2>
              <button className = "buttons" onClick={generateNewArtwork}>Generate Another Artwork From this Time Period</button>
              <div className="artwork">
              <p className="titleText">Title: "{artwork.title}"</p>
              <p>Date: {artwork.objectDate}</p>
              <div className="artImage">
              <img src={artwork.primaryImageSmall} alt={artwork.title} />
              </div>
              </div>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ArtGenerator;
