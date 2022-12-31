import Link from 'next/link';
import {useRouter} from 'next/router';
import {useDispatch, useSelector} from 'react-redux';
import isAdmin from '../../helper/isAdmin';
import {logOutAsyncAction} from '../../store/auth/authAsyncAction';
import {logout} from '../../store/auth/authSlice';

export default function HeaderUserControl({hasToken, isMobile}) {
   const {user} = useSelector((state: any) => state.auth);
   const dispatch = useDispatch();
   const router = useRouter();

   // logout function
   function handleClickLogOut() {
      dispatch(logOutAsyncAction());
      dispatch(logout());
      router.push('/');
   }
   return (
      <div className='absolute select-none top-7 right-[-10px] min-w-[190px] bg-white border rounded-lg shadow-[0_3px_8px_rgba(0,0,0,0.3)] z-[99990]'>
         <ul className='capitalize py-1'>
            {hasToken && (
               <>
                  <li className='py-1 px-2 hover:bg-[#891a1c] hover:text-white cursor-pointer'>
                     Thông tin
                  </li>
                  <li
                     className='py-1 px-2 hover:bg-[#891a1c] hover:text-white cursor-pointer'
                     onClick={() => router.push('/order')}>
                     Đơn hàng của tôi
                  </li>

                  {isAdmin(user) && (
                     <Link href='/admin/product'>
                        <li className='py-1 px-2 hover:bg-[#891a1c] hover:text-white cursor-pointer'>
                           <a>Trang Admin</a>
                        </li>
                     </Link>
                  )}
                  <li
                     className='py-1 px-2 hover:bg-[#891a1c] hover:text-white cursor-pointer'
                     onClick={handleClickLogOut}>
                     Đăng xuất
                  </li>
               </>
            )}

            {!hasToken && (
               <li
                  className='py-1 px-2 hover:bg-[#891a1c] hover:text-white cursor-pointer'
                  onClick={() => router.push('/membership')}>
                  Đăng nhập
               </li>
            )}
         </ul>
      </div>
   );
}
