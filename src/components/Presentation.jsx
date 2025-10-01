import React from 'react';

const Presentation = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-white mb-4 text-center">Presentation</h2>
      <div style={{position: 'relative', width: '100%', height: 0, paddingTop: '56.2500%',
        paddingBottom: 0, boxShadow: '0 2px 8px 0 rgba(63,69,81,0.16)', marginTop: '1.6em', marginBottom: '0.9em', overflow: 'hidden',
        borderRadius: '8px', willChange: 'transform'}}>
        <iframe loading="lazy" style={{position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, border: 'none', padding: 0, margin: 0}}
          src="https://www.canva.com/design/DAG0HWQJDVM/AFnrm_qCKCSDD6BoBybbvw/view?embed" allowFullScreen="allowfullscreen" allow="fullscreen">
        </iframe>
      </div>
    </div>
  );
};

export default Presentation;