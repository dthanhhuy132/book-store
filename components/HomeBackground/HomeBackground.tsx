import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import styled, {keyframes, css} from 'styled-components';
import {useAppSelector} from '../../store';

interface IHomeBackground {
   ishomepage?: boolean;
   homePanelImg: any;
}

export default function HomeBackground({ishomepage = true, homePanelImg}: IHomeBackground) {
   const router = useRouter();
   const [isActiveAnimation, setIsActiveAnimation] = useState(0);

   // get home panel for user from redux
   const changeImageActiveAnimate = () => {
      if (isActiveAnimation < homePanelImg?.pictures?.length - 1) {
         setIsActiveAnimation((pre) => pre + 1);
      } else {
         setIsActiveAnimation(0);
      }
   };

   const handleClickImage = () => {
      if (ishomepage) {
         router.push('/product/124');
      } else {
         return;
      }
   };
   useEffect(() => {
      const intervalId = setInterval(changeImageActiveAnimate, 4000);
      return () => clearInterval(intervalId);
   }, [isActiveAnimation]);

   return (
      <div className='grid grid-cols-1 md:grid-cols-2 gap-0'>
         {homePanelImg?.pictures?.map((imageSrc, index) => (
            <a key={index} onClick={() => handleClickImage()}>
               <ImageSC
                  src={imageSrc}
                  active={isActiveAnimation === index ? '1' : ''}
                  ishomepage={ishomepage ? '1' : ''}
                  layout='responsive'
                  objectFit='cover'></ImageSC>
            </a>
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
      animation: ${props.active && props.ishomepage && css`1s linear ${lighting}`};

      animation-timing-function: linear;
      transition: all 0.3s linear;
      transform: 'scale(1.01)';
      min-width: 100%;
      height: 'auto';
      &:hover {
         transform: ${props.ishomepage && 'scale(1.1)'};
         z-index: 9;
         border: 10px solid red;
         box-sizing: content-box;
      }
   `
);
