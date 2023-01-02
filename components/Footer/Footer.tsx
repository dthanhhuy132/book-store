import {useMemo, useEffect} from 'react';

import {Logo} from '../Logo';
import {FiInstagram} from 'react-icons/fi';
import {ImFacebook} from 'react-icons/im';
import {IoLogoYoutube} from 'react-icons/io';
import {SiTiktok} from 'react-icons/si';
import {useRouter} from 'next/router';
import useGlobalState from '../../state';
import useWindowDimensions from '../../hooks/UseWindowDimensions';

export default function Footer() {
   const router = useRouter();
   const hideHeaderMarquee = useMemo(() => {
      const excludePath = ['/event'];
      const currentPath = router.pathname;
      return excludePath.indexOf(currentPath) === -1;
   }, [router.pathname]);

   const adjustFooter = useMemo(() => {
      const includePath = ['/promo', '/info', '/bag'];
      return includePath.indexOf(router.pathname) >= 0;
   }, [router.pathname]);

   const hiddenFooter = useMemo(() => {
      const includePath = 'admin';

      return router.pathname.indexOf(includePath) < 0;
   }, [router.pathname]);
   return (
      <>
         {hiddenFooter && (
            <div
               className={`flex flex-col py-3 px-2 mb-10 md:mb-0 md:px-10 border-t-[1px] pt-5 ${
                  adjustFooter ? 'mt-10' : ''
               }`}>
               <div className='mb-5 mx-auto md:mx-[unset]'>
                  <Logo width='150px' height='40px'></Logo>
               </div>

               <div className='flex flex-col md:flex-row gap-10 items-start'>
                  <img
                     src='/images/footer.JPG'
                     alt='hình ảnh footer'
                     className='w-full md:w-[500px]'
                  />

                  {/* social */}
                  <div className='flex w-full items-center md:items-start gap-5 flex-col'>
                     <div className='flex items-center gap-3 text-[1.2rem] md:gap-5'>
                        <FiInstagram className='hover:text-[#891a1c] cursor-pointer' />
                        <ImFacebook className='hover:text-[#891a1c] cursor-pointer' />
                        <IoLogoYoutube className='hover:text-[#891a1c] cursor-pointer' />
                        <SiTiktok className='hover:text-[#891a1c] cursor-pointer' />
                     </div>
                     <div>
                        <p>
                           <span className='w-[100px] inline-block'> Created by </span>
                           <span className='font-bold'>: Lê Công Đoan</span>
                        </p>
                        <p>
                           <span className='w-[100px] inline-block'>Email </span>
                           <span className='font-bold'>: Book365@gmail.com</span>
                        </p>
                     </div>
                  </div>
               </div>

               <div
                  className='zalo-chat-widget'
                  data-oaid='198857796279680334'
                  data-welcome-message='Rất vui khi được hỗ trợ bạn!'
                  data-autopopup='0'
                  data-width='300'
                  data-height='300'
               />
            </div>
         )}
      </>
   );
}
