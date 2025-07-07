import React, { useEffect } from 'react';
import './Home.css';

const Home = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
    document.head.appendChild(script);
  }, []);

  return (
    <div className="main-container">
      <div className="left-container">
        <h1 className="animated-text">Welcome to the <span className='text-warning '> VJ KHOJ</span></h1>
        <p className="description"> What's your project idea? Share it with me, and I'll help you refine it, suggest suitable tech stacks, datasets, and APIs to get you started.</p>
      </div>
      <div className="right-container">
        <model-viewer
          src="/scene.gltf"
          alt="A 3D Robot"
          auto-rotate
          camera-controls
          shadow-intensity="1"
          exposure="1"
          className="model-viewer"
        ></model-viewer>
      </div>
    </div>
  );
};

export default Home;
