import {useMemo} from 'react';
import {useRouter} from 'next/router';
import Link from 'next/link';

const adminRouter = [
   'order',
   'home',
   'promo',
   'category',
   'event',
   'product',
   'story',
   'banner',
   'voucher',
   'user',
   'info',
];

export default function AdminSideBar() {
   const router = useRouter();
   const currentRoute = router.pathname;

   return (
      <aside className='w-64 fixed'>
         <div className='overflow-y-auto bg-[#f3f4f6] min-h-[100vh]'>
            <ul className=''>
               {adminRouter.map((adminRoute, index) => (
                  <li
                     key={index}
                     className={`flex items-center py-4 pl-2 hover:bg-gray-700 hover:text-[white] capitalize cursor-pointer ${
                        currentRoute.indexOf(adminRoute) >= 0 && 'bg-gray-900 text-white'
                     }`}
                     onClick={() =>
                        router.push(`/admin/${adminRoute}`, undefined, {shallow: true})
                     }>
                     <span className='ml-3'>
                        {adminRoute == 'banner'
                           ? 'Shop Banner'
                           : adminRoute === 'story'
                           ? 'Shop Story'
                           : adminRoute}
                     </span>
                  </li>
               ))}
            </ul>
         </div>
      </aside>
   );
}
