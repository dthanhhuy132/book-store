import {useRef} from 'react';

import {useRouter} from 'next/router';
import SliderSlick from 'react-slick';
import {AiOutlineCloseCircle} from 'react-icons/ai';

import useWindowDimensions from '../../hooks/UseWindowDimensions';

import {useCallback, useEffect, useState} from 'react';
import ProgressBar from './Slick/ProgressBar';
import {PANEL_FOR_STORY} from '../../store/panel/panelSlice';
import slicePanelLinkName from '../Admin/Product/slicePanelLinkName';

export default function ShopSliderProductStory({storyList}) {
   const storyListActive =
      storyList?.filter((item) => item?.description?.indexOf(PANEL_FOR_STORY) >= 0) || [];

   const router = useRouter();
   const {width} = useWindowDimensions();
   const [isMobileDevice, setIsMobileDevice] = useState(true);
   const [isShowCenterMode, setIsShowCenterMode] = useState(false);

   const [isShowProductButton, setIsShowProductButton] = useState(false);
   //    beforeChange={}

   const [dragging, setDragging] = useState(false);

   const handleOnItemClick = useCallback(
      (e) => {
         if (dragging) e.stopPropagation();
      },
      [dragging]
   );

   const [sliderQuantity, setSliderQuantity] = useState(3);
   const [activeIndexSlideImg, setActiveIndexSlideImg] = useState(0);

   const [runStoryModalFirstTime, setRunStoryModalFirstTime] = useState(false);

   // detemine mobile device

   useEffect(() => {
      if (width < 600) {
         setSliderQuantity(1.5);
      } else if (width >= 600 && width <= 800) {
         setSliderQuantity(2);
      } else if (width >= 900 && width <= 1000) {
         setSliderQuantity(3);
      } else {
         setSliderQuantity(4);
      }
   }, [width]);

   const sliderRef = useRef<any>();

   const settings = {
      className: 'center w-full',
      centerPadding: 0,

      infinite: true,
      slidesToShow: sliderQuantity,
      swipeToSlide: true,
      autoplay: true,
   };

   const openSetting = {
      className: 'center w-full slick-custom-center-dth',
      infinite: true,
      slidesToShow: width < 600 ? 1 : 3,
      swipeToSlide: true,
      autoplay: true,
      autoplaySpeed: !runStoryModalFirstTime ? 5500 : 6000,
      pauseOnHover: false,

      centerMode: true,
      centerPadding: 0,

      beforeChange: (currentSlide) => {
         if (runStoryModalFirstTime == true) {
            setIsShowProductButton(true);
            setRunStoryModalFirstTime(false);
         } else {
            setIsShowProductButton(false);
         }
      },

      afterChange: (currentSlide) => {
         setActiveIndexSlideImg(currentSlide);
         setIsShowProductButton(true);
      },
   };

   useEffect(() => {
      if (isShowCenterMode) {
         setRunStoryModalFirstTime(true);
      }
   }, [isShowCenterMode]);

   return (
      <>
         <SliderSlick {...settings} centerMode={true}>
            {storyListActive.map((story, index) => (
               <div key={index} onClickCapture={handleOnItemClick}>
                  <div className='p-[2px] md:px-2 transition'>
                     <div className='relative cursor-pointer rounded-[12px] md:rounded-[16px] overflow-hidden'>
                        <img
                           className='w-full transition hover:scale-[1.1] cursor-pointer aspect-[9/16] object-cover'
                           src={story.pictures[0] || ''}
                           alt=''
                           onClick={() => {
                              setIsShowProductButton(true);
                              setIsShowCenterMode(true);
                              setActiveIndexSlideImg(index);
                              setTimeout(() => sliderRef?.current?.slickGoTo(index), 50);
                           }}
                        />
                     </div>
                  </div>
               </div>
            ))}
         </SliderSlick>

         {isShowCenterMode && (
            <div
               className={`animate__animated animate__fadeIn flex justify-center items-center fixed top-0 bottom-0 right-0 z-[999] left-0 bg-[#000000fa] transition-all`}>
               <div
                  className='absolute top-2 left-2 z-[100] text-[gray] text-[3rem] cursor-pointer hover:text-[white]'
                  onClick={() => setIsShowCenterMode(false)}>
                  <AiOutlineCloseCircle />
               </div>
               <div className='w-[75%] md:w-[80%] my-10'>
                  <SliderSlick {...openSetting} centerMode={true} ref={sliderRef}>
                     {storyListActive.map((story, index) => {
                        return (
                           <div key={index} className=''>
                              <div className='p-[10px] text-center md:px-[30px] lg:px-[50px] transition'>
                                 <div className='relative rounded-[8px] md:rounded-[16px] overflow-hidden'>
                                    <img
                                       className='w-full transition aspect-[9/16] object-cover'
                                       src={story.pictures[0] || ''}
                                       alt=''
                                    />
                                 </div>
                              </div>
                           </div>
                        );
                     })}
                  </SliderSlick>
                  <div className='fixed top-0 left-0 right-0 opacity-50'>
                     {isShowProductButton && <ProgressBar></ProgressBar>}
                  </div>
                  <button
                     className={`absolute left-[50%] translate-x-[-50%] bg-[white] rounded-full mt-2 px-2 py-1 flex items-center text-[1.1rem] transition-all ${
                        isShowProductButton ? 'bottom-[15px]' : 'bottom-[-100%] mb-[4px]'
                     }`}
                     onClick={() => {
                        setIsShowCenterMode(false);
                        console.log(activeIndexSlideImg);
                        const pathName = storyListActive[activeIndexSlideImg].description;
                        router.push(`${slicePanelLinkName(pathName)}`);
                     }}>
                     Xem sản phẩm
                  </button>
               </div>
            </div>
         )}
      </>
   );
}
