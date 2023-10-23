

const PaintingGenerator = () => {
  const [painting, setPainting] = [null,null];


  const fetchRandomPainting = async () => {
    try {
      const response = await fetch('https://collectionapi.metmuseum.org/public/collection/v1/objects');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setPainting(data);
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
