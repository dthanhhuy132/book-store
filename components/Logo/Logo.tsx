import Image from 'next/image';
import Link from 'next/link';
import logo from '../../public/images/logo.png';

interface LogoSize {
   width?: string;
   height?: string;
}

export default function Logo({width = '150', height = '30'}: LogoSize) {
   return (
      <Link href='/' className='block center'>
         <a>
            <Image src={logo} alt='Picture of the author' width={width} height={height} />
         </a>
      </Link>
   );
}
