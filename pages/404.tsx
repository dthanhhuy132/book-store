import {useRouter} from 'next/router';
import {Logo} from '../components/Logo';
export default function Custom404Page() {
   const router = useRouter();
   return (
      <div className='w-[100vw] h-[70vh] flex items-center justify-center flex-col'>
         <div className='font-bold'>
            <Logo width='250px' height='60px' />
         </div>
         <div className='font-bold'>404 - Page Not Found</div>

         <button
            className='px-7 py-3 bg-gray-300 mt-5 rounded-[20px] font-bold hover:bg-black hover:text-white'
            onClick={() => router.push('/')}>
            GO HOME
         </button>
      </div>
   );
}
