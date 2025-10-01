import React from 'react';

const EmbeddedGame = ({ onClose }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'black',
      zIndex: 9999
    }}>
      <iframe
        src="https://html-classic.itch.zone/html/3932273/index.html"
        title="Embedded Game"
        style={{
          width: '100%',
          height: '100%',
          border: 'none'
        }}
        allowFullScreen
      />
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          padding: '10px 15px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          color: 'white',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '14px',
          fontFamily: 'Arial, sans-serif',
          zIndex: 10001
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
        onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
      >
        Close & Return Home
      </button>
      {/* Credit overlay */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        color: 'white',
        fontSize: '14px',
        fontFamily: 'Arial, sans-serif',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        zIndex: 10000
      }}>
        Made by Rayan Rchouki - This is a backup Space Time Grid
      </div>
    </div>
  );
};

export default EmbeddedGame;