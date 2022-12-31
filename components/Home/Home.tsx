import Image from 'next/image';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import styled, {keyframes, css} from 'styled-components';
import getLinkHomePanel from '../Admin/Home/getLinkHomePanel';

export default function Home({homeImage}) {
   const [isActiveAnimation, setIsActiveAnimation] = useState(0);
   const router = useRouter();

   // get home links
   const homeLinks = homeImage?.description && getLinkHomePanel(homeImage?.description);
   const changeImageActiveAnimate = () => {
      if (isActiveAnimation < homeImage.length - 1) {
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
      <div className='grid grid-cols-1 md:grid-cols-2 gap-0 '>
         {homeImage?.pictures?.map((imgSRC, index) => (
            <div className='overflow-hidden' key={index}>
               <a onClick={() => handleClickImage(index)}>
                  <ImageSC
                     src={imgSRC}
                     active={isActiveAnimation === index ? '1' : ''}
                     layout='responsive'
                     objectFit='cover'></ImageSC>
               </a>
            </div>
         ))}
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
      min-width: 100%;
      height: 'auto';
      cursor: pointer;
      &:hover {
         transform: scale(1.1);
         z-index: 10;

         box-sizing: content-box;
      }
   `
);
