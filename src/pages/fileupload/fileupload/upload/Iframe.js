import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const Iframe = () => {
  // const [iframeRef, setIframeRef] = useState(null);
  const iframeRef = useRef(null)

  const { state: docusignUrl } = useLocation()

  useEffect(() => {
    if(iframeRef.current) {
      iframeRef.current.src = docusignUrl
    }
  }, [])

  // const embeddedSigningCeremony = () => {
  //   // Make sure iframeRef is available
  //   if (!iframeRef) {
  //     console.error("Iframe reference not available");
  //     return;
  //   }
  //   // Set the iframe source to the signing URL
  //   iframeRef.src = state;
  // };
  const handleIframeLoad = () => {
    // Add any additional logic when the iframe is loaded, if needed
    console.log("Iframe loaded");
  };
  return (
    <div>
      {/* Button to trigger the signing ceremony */}
      {/* <button onClick={embeddedSigningCeremony}>Open Signing Ceremony</button> */}
      {/* Iframe to display the signing ceremony */}
      <iframe
        title="DocuSign Signing Ceremony"
        ref={iframeRef}
        width="100%"
        height="1000"
        allowFullScreen
        onLoad={handleIframeLoad}
      ></iframe>
    </div>
  );
};
export default Iframe;