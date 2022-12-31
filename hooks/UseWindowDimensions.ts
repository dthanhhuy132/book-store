import {useState, useEffect} from 'react';

export default function useWindowDimensions() {
   const hasWindow = typeof window !== 'undefined';
   function getWindowDimensions() {
      const width = hasWindow ? window.innerWidth : null;
      const height = hasWindow ? window.innerHeight : null;
      let isMobile: Boolean;
      if(width && width < 600) {
         isMobile = true
      } else {
         isMobile = false
      }

      return {
         width,
         height,
         isMobile
      };
   }

   const [windowDimensions, setWindowDimensions] = useState(
      getWindowDimensions()
   );
   function handleResize() {
      setWindowDimensions(getWindowDimensions());
   }

   

   useEffect(() => {
      if (hasWindow) {
         window.addEventListener('resize', handleResize);
         return () => window.removeEventListener('resize', handleResize);
      }
   }, [hasWindow]);

   return windowDimensions;
}
