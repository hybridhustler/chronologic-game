import React, { useEffect } from 'react';

const AdSpace = () => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <>
      <div dangerouslySetInnerHTML={{
        __html: `
          <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8750205920904810" crossorigin="anonymous"></script>
        `
      }} />
      <ins className="adsbygoogle"
           style={{ display: 'block' }}
           data-ad-client="ca-pub-8750205920904810"
           data-ad-slot="7562101375"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
    </>
  );
};

export default AdSpace;