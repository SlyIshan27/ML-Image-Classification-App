import './App.css';
import React, { useState } from 'react';
import Result from './result';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';


function Alert({ message, type, onClose }){
  if(!message){
    return null;
  }

  const alertStyle = {
    error: {
      backgroundColor: '#f44336',
      color: 'white',
    }
  };

  return (
    <div style={{
      ...alertStyle[type] || alertStyle.info,
      padding: '15px 20px',
      borderRadius: '8px',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      animation: 'slideIn 0.3s ease-out',
      maxWidth: '600px',
      margin: '0 auto 20px auto'
    }}>
      <span style={{ fontSize: '16px', fontWeight: '500' }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'white',
          fontSize: '24px',
          cursor: 'pointer',
          padding: '0 5px',
          marginLeft: '10px',
          lineHeight: '1'
        }}
      >
        ×
      </button>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className='loading-overlay'>
      <div className='loading-container'>
        <h2>Processing Image ...</h2>
        <p>Please wait while our ML model analyzes your image</p>
        <div className='spinner'>
        </div>
      </div>
    </div>
  );
}

function Home() {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const [choice, setChoice] = useState("")
  const [postMessage, setPostMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  
  const clearImageInput = (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('imageInput');
    fileInput.value='';
    setImageFile(null);
    setPreviewUrl(null);
  };

  const sendImageToModel = async (e) => {
    e.preventDefault();
    setAlert({ message: '', type: ''});
    if (!imageFile) {
      setPostMessage("Please select an image first.");
      setAlert({
        message: 'Please select an image first!',
        type: 'error'
      })
      return;
    }
    if (!choice) {
      setPostMessage("Please select a classification type.");
      setAlert({
        message: 'Please select a classification option!',
        type: 'error'
      })
      
      return;
    }
    const formData = new FormData();
    formData.append("image", imageFile)
    formData.append("choice", choice)
    formData.append("user", "example_user")
    
    setIsLoading(true)

    try {
      const response = await fetch('http://127.0.0.1:5000/api/data', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const result = await response.json();
      setPostMessage(result.message);
      console.log('Success:', result);

      setIsLoading(false)

      navigate('/result', { state: { result }})

    } catch (error) {
      console.error('Error sending data:', error);
      setPostMessage('Failed to send Image');
    }

  };

  return (
    <>
      {isLoading && <LoadingScreen />}

      <div class="stars"></div>
      <div class="shooting-star"></div>
      <div class="shooting-star"></div>
      <div class="shooting-star"></div>
      <div class="shooting-star"></div>
      <div class="shooting-star"></div>
      <div className="App"> 
        <div className="App-header">
        <h4>Welcome to the Detectify App. An ML image classification model! Detect Vehicles, Clothes And Food!</h4>
        <p>Select an option and upload your image for image classification!</p>
        <Alert 
            message={alert.message} 
            type={alert.type}
            onClose={() => setAlert({ message: '', type: '' })}
          />
        <form onSubmit={sendImageToModel}>
          <div className='container'>
          <p>Select a topic to classify</p>

          <div className="checkbox-group">
            <label>
              <input type="radio" name="techniques"  value="Vehicle" checked={choice == "Vehicle"} onChange={(e) => setChoice(e.target.value)}/>
              Vehicle Classification
            </label>
            <label>
              <input type="radio" name="techniques" value="Clothes" checked={choice == "Clothes"} onChange={(e) => setChoice(e.target.value)} />
              Clothes Classification
            </label>

            <label>
              <input type="radio" name="techniques" value="Food" checked={choice == "Food"} onChange={(e) => setChoice(e.target.value)} />
              Food Classification
            </label>
          </div>

          <label>Upload Image: </label>
          <input 
            id='imageInput' 
            type='file' 
            name='img' 
            accept='image/*' 
            onChange={(e) => {
              const file = e.target.files[0];
              setImageFile(file)
              if(file){
                const reader = new FileReader();
                reader.onloadend = () => {
                  setPreviewUrl(reader.result);
                };
                reader.readAsDataURL(file);
              }else{
                setPreviewUrl(null);
              }
            }}
          />
          {previewUrl && (
            <div style={{ position: 'relative', display: 'inline-block', marginTop: '10px' }}>
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  maxWidth: "300px",
                  marginTop: "10px",
                  display: "block",
                  border: "2px solid white"
                }}
              />
              <button onClick={clearImageInput} className='clearButton' title='Clear Image'>x</button>
            </div>
          )}
          <div className='actions'>
            <button
              style={{
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Calibri, 'Helvetica Neue', Arial",
              }}
              type="submit"
              className="primary"
              disabled={isLoading}
              >
              {isLoading ? 'Processing ...' : 'Submit'}
            </button>
          </div>
          </div>
        </form>
        </div>
      </div>
    </>
  );
}

function App(){
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path="/result" element={<Result />} />
      </Routes>
    </Router>
  );
}

export default App;
