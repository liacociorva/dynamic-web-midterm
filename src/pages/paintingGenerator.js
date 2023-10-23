import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PaintingGenerator = () => {
  const [painting, setPainting] = useState(null);

  useEffect(() => {
    fetchRandomPainting();
  }, []);

  const fetchRandomPainting = async () => {
    try {
      const response = await axios.get('https://collectionapi.metmuseum.org/public/collection/v1/objects/random');
      setPainting(response.data);
    } catch (error) {
      console.error('Error fetching painting:', error);
    }
  };

  const handleNextPainting = () => {
    fetchRandomPainting();
  };

  return (
    <div>
      <h1>Met Museum Painting Generator</h1>
      {painting && (
        <div>
          <h2>{painting.title}</h2>
          <p>Artist: {painting.artistDisplayName}</p>
          <img src={painting.primaryImage} alt={painting.title} />
          <button onClick={handleNextPainting}>Next Painting</button>
        </div>
      )}
    </div>
  );
};

export default PaintingGenerator;
