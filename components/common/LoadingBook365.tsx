import Image from 'next/image';
import logo from '../../public/images/logo.png';

import Loading from './Loading';

export default function LoadingBook365({color = '#eff2f3', width = '30px', height = '30px'}) {
   return (
      <div
         className='fixed top-0 right-0 bottom-0 left-0 bg-white bg-opacity-[0.9] z-[150]
         flex flex-col justify-center items-center'>
         <div>
            <Image src={logo} alt='Picture of the author' width='170px' height='60px' />
            <Loading color={color} width={width} height={height}></Loading>
         </div>
      </div>
   );
}
