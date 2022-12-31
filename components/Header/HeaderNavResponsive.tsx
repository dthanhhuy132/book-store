import {useEffect, useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useSelector} from 'react-redux';
import HeaderSearch from './HeaderSearch';
import useWindowDimensions from '../../hooks/UseWindowDimensions';

import {BsArrowRightCircle, BsArrowLeftCircle} from 'react-icons/bs';

import Cookies from 'js-cookie';
import {useAppSelector} from '../../store';

interface IHeaderNavRps {
   handleCloseMenu: () => void;
   isShowMenuRps: Boolean;
}

const navbarHeader = ['shop', 'promo', 'event', 'info', 'order'];
const navbarHasToken = ['Thông tin', 'Admin page', 'Đăng xuất'];
export default function HeaderNavResponsive({handleCloseMenu, isShowMenuRps}: IHeaderNavRps) {
   const token = Cookies.get('accessToken');
   const router = useRouter();

   // get category and event from redux
   const {categoryProductState} = useAppSelector((state) => state.category);
   const {eventState} = useAppSelector((state) => state.event);

   const submenuContent = {
      shop: categoryProductState?.map((item) => item.name) || [],
      event: eventState?.map((item) => item.title) || [],
   };

   const [userStatus, setUserStatus] = useState('Đăng nhập');
   const [subMenu, setIsShowSubMenu] = useState({
      isShow: false,
      subMenuName: '',
      title: '',
   });

   const {user} = useSelector((state: any) => state.auth);

   function handleClickNavItem(e: any, item: string) {
      e.preventDefault();
      handleCloseMenu();
      router.push(`/${item}`);
   }

   useEffect(() => {
      handleCloseMenu();
   }, [router.asPath]);

   useEffect(() => {
      if (token) {
         setUserStatus('Đăng xuất');
      } else {
         setUserStatus('Đăng nhập');
      }
   }, []);

   // animate__animated animate__faster
   // isShowMenuRps ? 'animate__fadeInLeft' : 'animate__fadeOutLeft'
   return (
      <>
         <div
            className={`${
               isShowMenuRps ? 'left-0' : 'left-[-100%]'
            } fixed top-0 bottom-0 w-full bg-black bg-opacity-90 z-50 pt-[100px] text-center text-white transition-all duration-300`}>
            <i
               className='absolute top-3 left-3 fa-sharp fa-solid fa-xmark text-[1.8rem]'
               onClick={() => handleCloseMenu()}
            />

            <div className='flex justify-center'>
               <HeaderSearch whiteLine={true} />
            </div>

            {/* nav bar */}
            <div className='flex flex-col justify-between h-full'>
               <div className='flex overflow-hidden'>
                  <div
                     className={`relative inline-block min-w-[100vw] 
                     ${subMenu.isShow ? 'left-[-100%]' : 'left-0'} transition-all`}>
                     <ul
                        className={`flex justify-center gap-x-4 gap-y-3 uppercase flex-col mt-5 mx-auto`}>
                        {navbarHeader.map((item) => (
                           <div key={item} className='flex justify-start items-center gap-3'>
                              <a
                                 className={`hover:text-[#891a1c] font-[500] ml-[40%] text-[1.1rem] min-w-[70px] text-left`}
                                 onClick={(e) => handleClickNavItem(e, item)}>
                                 {item}
                              </a>

                              {item === 'shop' ? (
                                 <BsArrowRightCircle
                                    className='text-[1.2rem] font-bold'
                                    onClick={() =>
                                       setIsShowSubMenu({
                                          isShow: true,
                                          subMenuName: 'shop',
                                          title: 'Category',
                                       })
                                    }
                                 />
                              ) : (
                                 ''
                              )}

                              {item === 'event' ? (
                                 <BsArrowRightCircle
                                    className='text-[1.2rem] font-bold'
                                    onClick={() =>
                                       setIsShowSubMenu({
                                          isShow: true,
                                          subMenuName: 'event',
                                          title: 'Event',
                                       })
                                    }
                                 />
                              ) : (
                                 ''
                              )}
                           </div>
                        ))}
                     </ul>
                  </div>

                  {/* sub menu for event and shop */}
                  <div
                     className={`relative inline-block min-w-[100vw] 
                     ${subMenu.isShow ? 'right-[100%]' : 'right-0'} transition-all`}>
                     <ul
                        className={`flex justify-center gap-y-3 uppercase flex-col mt-5 
                     `}>
                        <div className='flex items-center justify-start gap-3 border-b-2 pb-2 mx-[30%]'>
                           <BsArrowLeftCircle
                              className='text-[1.2rem] font-bold'
                              onClick={() =>
                                 setIsShowSubMenu({
                                    isShow: false,
                                    subMenuName: '',
                                    title: '',
                                 })
                              }
                           />
                           <span>{subMenu.title}</span>
                        </div>
                        {submenuContent[subMenu.subMenuName]?.map((item, index) => (
                           <a
                              key={`${item}-${index}`}
                              className='text-left ml-[30%] text-[1.1rem] min-w-[70px]'>
                              {item}
                           </a>
                        ))}
                     </ul>
                  </div>
               </div>

               <div className='flex flex-col uppercase mb-[50px]'>
                  <a
                     className={`hover:text-[#891a1c] font-[500] text-[1.1rem] `}
                     onClick={(e) => {
                        token ? () => {} : router.push('/membership');
                     }}>
                     {userStatus}
                  </a>
               </div>
            </div>
         </div>
      </>
   );
}
