import Image from 'next/image';
import Link from 'next/link';
import logo from '../../public/images/logo.png';

interface LogoSize {
   width?: string;
   height?: string;
}

export default function Logo({width = '150', height = '45'}: LogoSize) {
   return (
      <Link href='/' className='block center'>
         <img
            src='/images/Logo.png'
            alt='Picture of the author'
            className='cursor-pointer'
            width={width}
            height={height}
         />
      </Link>
   );
}
