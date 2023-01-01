import ImageGallery from 'react-image-gallery';

import Link from 'next/link';
import useWindowDimensions from '../../hooks/UseWindowDimensions';
import {useEffect, useState, useRef} from 'react';
import {getLinkBannerPanel} from '../Admin/Home/getLinkHomePanel';
import {useRouter} from 'next/router';

export default function ShopSliderBanner({bannerList}) {
   const router = useRouter();
   const {width} = useWindowDimensions();
   const [isMobileScreen, setIsMobileScreen] = useState(false);
   const [renderBannerList, setIsRenderBannerList] = useState(bannerList[0] || []);
   console.log();
   useEffect(() => {
      if (width > 600) {
         setIsMobileScreen(false);
      } else {
         setIsMobileScreen(true);
      }
   }, [width]);

   const bannerForMobile =
      renderBannerList?.pictures?.slice(0, renderBannerList?.pictures.length / 2) || [];
   const bannerForPC =
      renderBannerList?.pictures?.slice(
         renderBannerList?.pictures.length / 2,
         renderBannerList?.pictures.length
      ) || [];

   const imagesForPC = bannerForPC.map((item) => ({
      original: item,
      thumbnail: item,
   }));

   // conver description to link in banner
   const bannerLinkArr = getLinkBannerPanel(renderBannerList?.description)?.map((item) => {
      const linkIndex = item.indexOf('.');

      if (linkIndex) {
         return item.substring(linkIndex + 1, item.length).trim();
      }
      return item.trim();
   });

   const imagesForMobile = bannerForMobile.map((item) => ({
      original: item,
      thumbnail: item,
   }));

   const sliderRef = useRef(null);

   return (
      <>
         {renderBannerList.pictures?.length > 0 && (
            <ImageGallery
               ref={sliderRef}
               items={isMobileScreen ? imagesForMobile : imagesForPC}
               showIndex={isMobileScreen ? true : false}
               showBullets={isMobileScreen ? false : true}
               infinite={true}
               autoPlay={true}
               fullscreen={true}
               showNav={true}
               slideInterval={5000}
               showFullscreenButton={false}
               showThumbnails={false}
               showPlayButton={false}
               additionalClass='shop-slider'
               originalHeight={'100vh'}
               onClick={(event, index) => {
                  const imgIndex = sliderRef.current.getCurrentIndex();
                  router.push(`${bannerLinkArr[imgIndex]}`);
               }}
            />
         )}
      </>
   );
}
