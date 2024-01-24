import React from 'react';
import Header from '../Header/header'
import Sidebar from '../Sidebar/Sidebar'
const WordDocx = () => {
  const params = new URLSearchParams(window.location.search);
  const selectedFileName = 'https://firebasestorage.googleapis.com' + params.get('doc');
  return (
    <div className="App">
      <Header/>
      <Sidebar/>
      <iframe
        title="PDF Viewer"
        src={`https://docs.google.com/viewer?url=${encodeURIComponent(selectedFileName)}&embedded=true`}
        width="100%"
        height="1100"
      ></iframe>
    </div>
  );
};
export default WordDocx;