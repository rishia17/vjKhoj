import React, { useEffect } from 'react';

const Home = () => {
  useEffect(() => {
    // Dynamically load model-viewer only once
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
    
    script.onload = () => {
      console.log("Model-viewer script loaded successfully");
    };
    
    script.onerror = (error) => {
      console.error("Error loading model-viewer script:", error);
    };
    
    document.head.appendChild(script);
  }, []);

  return (
    <div style={mainContainerStyle}>
      <div style={leftContainerStyle}>
        <h1 style={animatedTextStyle}>Welcome to the ChatBot</h1>
        <p style={textStyle}>This is a 3D model view of a chatbot robot. Explore the features and interact with the chatbot.</p>
      </div>

      <div style={rightContainerStyle}>
        <model-viewer
          src="/scene.gltf"  // Ensure this is the correct path to the 3D model in the public folder
          alt="A 3D Robot"
          auto-rotate
          camera-controls
          shadow-intensity="1"
          exposure="1"
          style={modelViewerStyle}
        ></model-viewer>
      </div>
    </div>
  );
};

// Styles
const mainContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: '100vh',
  background: '#0a0118',
  padding: '20px',
  boxSizing: 'border-box',
  gap: '20px',  // Adjusted gap to keep elements within bounds
};

const leftContainerStyle = {
  flex: 1,
  padding: '20px',
  textAlign: 'left',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  animation: 'slideIn 1s ease-in-out',
};

const rightContainerStyle = {
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: '20px',  // Adjusted margin to prevent overflow
  overflow: 'hidden',  // Prevent overflow
};

const modelViewerStyle = {
  width: '100%',
  maxWidth: '600px',
  height: '600px',
  background: '#ff', // light gray background to visualize the box
};


const animatedTextStyle = {
  fontSize: '3rem',  // Larger font size for the header
  fontWeight: 'bold',
  color: 'white',
  animation: 'fadeIn 2s ease-in-out',
  textAlign: 'left',  // Align to the left
  marginBottom: '20px',
};

const textStyle = {
  fontSize: '1.8rem',  // Larger text size to match the height proportion
  color: 'white',
  textAlign: 'left',
  marginBottom: '30px',  // Added margin for space below text
};

// Keyframes for animations
const keyframesStyle = `
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes slideIn {
    0% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(0);
    }
  }

  /* Responsive Styles */
  @media (max-width: 1024px) {
    .main-container {
      flex-direction: column; /* Stack content on medium screens */
    }

    .left-container,
    .right-container {
      width: 100%; /* Allow containers to take up full width */
      text-align: center;
    }

    .model-viewer {
      width: 100%;  /* Adjust model size for medium screens */
      height: 100%;
    }

    h1 {
      font-size: 2.5rem;  /* Adjust title size for medium screens */
    }

    p {
      font-size: 1.3rem; /* Adjust text size for medium screens */
    }
  }

  @media (max-width: 768px) {
    .main-container {
      flex-direction: column; /* Stack content on smaller screens */
    }

    .model-viewer {
      width: 90%;  /* Adjust model size for smaller screens */
      height: 90%;
    }

    h1 {
      font-size: 2rem;  /* Adjust title size for smaller screens */
    }

    p {
      font-size: 1.1rem; /* Adjust text size for smaller screens */
    }
  }

  @media (max-width: 480px) {
    .main-container {
      flex-direction: column; /* Stack content on very small screens */
    }

    .model-viewer {
      width: 80%;  /* Adjust model size for very small screens */
      height: 80%;
    }

    h1 {
      font-size: 1.7rem;  /* Adjust title size for very small screens */
    }

    p {
      font-size: 1rem; /* Adjust text size for very small screens */
    }
  }
`;

// Inject the keyframes styles into the document head for global use
const styleTag = document.createElement('style');
styleTag.innerHTML = keyframesStyle;
document.head.appendChild(styleTag);

export default Home;
