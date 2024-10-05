// AdSenseScriptLoader.js
import { useEffect } from 'react';

let isScriptLoaded = false;

const AdSenseScriptLoader = () => {
  useEffect(() => {
    if (!isScriptLoaded) {
      const script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8750205920904810`;
      script.async = true;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
      isScriptLoaded = true;
    }
  }, []);

  return null;
};

export default AdSenseScriptLoader;