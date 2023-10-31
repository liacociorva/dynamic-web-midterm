import React, { useState, useEffect } from "react";
import styles from "./artStyles.css";
import axios from "axios";

function ArtGenerator() {
  const [timePeriod, setTimePeriod] = useState(null);
  const [artwork, setArtwork] = useState(null);
  const [timePeriodsData, setTimePeriodsData] = useState({});
  const [initialLoad, setInitialLoad] = useState(true);

  // Load the time periods from json
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

  // This function selects a random time period and fetches corresponding artwork
  const selectRandomTimePeriod = () => {
    //Select the random time period
    const timePeriodKeys = Object.keys(timePeriodsData);
    const randomTimePeriodKey = timePeriodKeys[Math.floor(Math.random() * timePeriodKeys.length)];
    const selectedTimePeriod = timePeriodsData[randomTimePeriodKey];
    
    setTimePeriod(selectedTimePeriod);

    // Make an API request based on the selected time period
    fetchArtwork(selectedTimePeriod);
  };

  // Then this function selects artwork based on the selected time period
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

          // Then fetch the artwork details
          const artworkDetailsUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${randomArtworkID}`;
          const artworkResponse = await axios.get(artworkDetailsUrl);
          setArtwork(artworkResponse.data);
        } else {
          setArtwork(null); // If no artwork is found for the selected time period
        }
      } catch (error) {
        console.error("Error fetching artwork:", error);
      }
    }
  };

  const generateNewArtwork = () => {
    fetchArtwork(timePeriod);
  };

  return (
    <div className="WebWrapper">
      <h1>Medieval Art Roulette</h1>
      
      <div className="upperContent">
      <img src={'/flower.png'} alt="fleur" width='70'/>
      <button onClick={selectRandomTimePeriod}>Generate a Random Time Period</button>
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
              <button onClick={generateNewArtwork}>Generate Another Artwork From this Time Period</button>
              <div className="artwork">
              <p className="titleText">Title: "{artwork.title}"</p>
              <p>Date: {artwork.objectDate}</p>
              <p className = 'acquisitionDate' style={{backgroundColor: `rgba(139, 46, 0,${(artwork.accessionYear/150)-12.5})`}}>Acquired by the Met in {artwork.accessionYear}</p>
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
