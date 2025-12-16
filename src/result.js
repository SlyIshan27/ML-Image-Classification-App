import React from 'react';
import "./result.css"
import "./index.css"
import { useLocation, useNavigate } from 'react-router-dom';


function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;  // Get data from navigation

  if (!result) {
    return (
      <div>
        <h2>No result found!</h2>
        <button onClick={() => navigate('/')}>Go Back</button>
      </div>
    );
  }

  return (
    <>
      <div class="stars"></div>
      <div class="shooting-star"></div>
      <div class="shooting-star"></div>
      <div class="shooting-star"></div>
      <div class="shooting-star"></div>
      <div class="shooting-star"></div>
      <div className="result-page">
        <div className="result-info">
          <h2>Prediction Result</h2>
          <p><strong>Choice:</strong> {result.choice}</p>
          <p><strong>Prediction:</strong> {result.prediction}</p>
          <p><strong>Confidence:</strong> {(result.confidence * 100).toFixed(2)}%</p>
        </div>
        {result.image ? (
          <div className="image-container">
            <img 
              src={`data:image/png;base64,${result.image}`} 
              alt="Uploaded prediction"
              onLoad={() => console.log('Image loaded successfully')}
              onError={(e) => {
                console.error('Image failed to load');
                console.error('Image src length:', e.target.src.length);
              }}
            />
          </div>
        ) : (
          <p className="error">No image data received</p>
        )}
        <button onClick={() => navigate('/')}>Classify Another Image</button>
      </div>
    </>
    );
  }


export default Result;
