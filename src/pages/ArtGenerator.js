import React, { useState, useEffect } from 'react';
import Vibrant from 'node-vibrant';

const ArtGenerator = () => {
  const [painting, setPainting] = useState(null);
  const [primaryColor, setPrimaryColor] = useState(null);
  
  useEffect(() => {
    fetchRandomPainting();
  }, []);

  function generateRandomObjectID() {
    const minID = 1;
    const maxID = 471581;
    const randomID = Math.floor(Math.random() * (maxID - minID + 1)) + minID;
    return randomID;
  }

  const fetchRandomPainting = async () => {
    try {
      const randomID = generateRandomObjectID();
      const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${randomID}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data);
      if (data.primaryImage && data.primaryImage.startsWith('http')) {
        const vibrant = new Vibrant(painting.primaryImage);
        vibrant.getPalette().then((palette) => {
        const primary = palette.Vibrant || palette.Muted;
        if (primary) {
          setPrimaryColor(primary.getHex());
        } else {
          console.error('Primary color not found in palette');
        }
      });
    } else {
      console.error('Invalid or missing primaryImage URL');
    }
      setPainting(data);
    } catch (error) {
      console.error('Error fetching painting:', error);
    }
  };


  const handleNextArt = () => {
    fetchRandomPainting();
  };


  return (
    <div>
      <h1>Art Generator</h1>
      {painting && (
        <div>
          <h2>Artwork</h2>
          <h3>{painting.title}</h3>
          <p>Artist: {painting.artistDisplayName}</p>
          <img src={painting.primaryImageSmall} alt={painting.title} />
        </div>
      )}
      <button onClick={handleNextArt}>Next Art</button>
      {primaryColor && (
        <div>
          <h2>Primary Color</h2>
          <div style={{ backgroundColor: primaryColor, width: '50px', height: '50px' }}></div>
        </div>
      )}
    </div>
  );
};


export default ArtGenerator;
