import {useRouter} from 'next/router';
import {Logo} from '../Logo';
export default function NotFound({
   title = '404 - Page Not Found',
   navigateLink = '/',
   navigateText = 'GO HOME',
}) {
   const router = useRouter();
   return (
      <div className='w-[100vw] h-[70vh] flex items-center justify-center flex-col'>
         <div className='font-bold'>
            <Logo width='250px' height='60px' />
         </div>
         <div className='font-bold'>{title}</div>

         <button
            className='px-7 py-3 bg-gray-300 mt-5 rounded-[20px] font-bold hover:bg-black hover:text-white'
            onClick={() => router.push(navigateLink)}>
            {navigateText}
         </button>
      </div>
   );
}
