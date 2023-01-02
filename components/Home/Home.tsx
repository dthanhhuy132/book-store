import Image from 'next/image';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import styled, {keyframes, css} from 'styled-components';
import getLinkHomePanel from '../Admin/Home/getLinkHomePanel';
import Masonry, {ResponsiveMasonry} from 'react-responsive-masonry';

import randomColor from 'randomcolor';
import stringToSlug from '../../helper/stringToSlug';
import RenderCategoryItem from '../ProductDetailItem/RenderCategoryItem';

export default function Home({homeImage, categoryList}) {
   console.log('homeImage', homeImage);
   const [isActiveAnimation, setIsActiveAnimation] = useState(0);
   const router = useRouter();

   // get home links
   const homeLinks = homeImage?.description && getLinkHomePanel(homeImage?.description);

   const changeImageActiveAnimate = () => {
      if (isActiveAnimation < homeImage?.length - 1) {
         setIsActiveAnimation((pre) => pre + 1);
      } else {
         setIsActiveAnimation(0);
      }
   };

   function handleClickImage(homeLinkIndex) {
      if (homeLinks[homeLinkIndex]) {
         router.push(`/${homeLinks[homeLinkIndex]}`);
      }
   }

   useEffect(() => {
      const intervalId = setInterval(changeImageActiveAnimate, 4000);
      return () => clearInterval(intervalId);
   }, [isActiveAnimation]);

   return (
      <div>
         {/* render category list */}
         <div className='px-1 md:px-[10%] lg:px-[20%] mt-5 mb-10'>
            <p className='font-extrabold text-[1.5rem] border-b-2'>Cùng khám phá</p>
            <div>
               {categoryList?.length > 0 && categoryList ? (
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2'>
                     {categoryList.map((category, index) => (
                        <RenderCategoryItem categoryName={category.name} key={index} />
                     ))}
                  </div>
               ) : (
                  <></>
               )}
            </div>
         </div>
         <ResponsiveMasonry columnsCountBreakPoints={{200: 1, 600: 2, 950: 3, 1200: 3}}>
            <Masonry
               className='my-masonry-grid-home'
               columnClassName='my-masonry-grid_column-home'
               gutter='4px 4px'>
               {homeImage?.pictures?.map((imgSRC, index) => (
                  <div className='overflow-hidden w-full' key={index}>
                     <ImageSC
                        src={imgSRC}
                        active={isActiveAnimation === index ? '1' : ''}
                        layout='responsive'
                        objectFit='cover'
                        onClick={() => handleClickImage(index)}></ImageSC>
                  </div>
               ))}
            </Masonry>
         </ResponsiveMasonry>
      </div>
   );
}

const lighting = keyframes`
   0% {
      filter: brightness(1)
   }
   50% {
      filter: brightness(1.2)
   }
   100% {
      filter: brightness(1)
   }
`;

const ImageSC = styled('img')<any>(
   (props) => css`
      animation: ${props.active && css`1s linear ${lighting}`};
      animation-timing-function: linear;
      transition: all 0.3s linear;
      transform: scale(1.01);
      width: 100%;

      /* height: 'auto'; */
      cursor: pointer;
      &:hover {
         transform: scale(1.1);
         z-index: 10;

         box-sizing: content-box;
      }
   `
);
