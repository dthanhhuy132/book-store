import {useState, useEffect} from 'react';
import {AdminLayout} from '../../components/Admin';
import {getTokenSSRAndCSS} from '../../helper';
import authApi from '../../service/authApi';
import {useAppDispatch} from '../../store';
import Cookies from 'js-cookie';
import {getAllUserAsync} from '../../store/auth/authAsyncAction';

export default function AdminUserPage() {
   const accessToken = Cookies.get('accessToken');

   const [allUser, setAllUser] = useState(null);
   const dispatch = useAppDispatch();

   useEffect(() => {
      dispatch(getAllUserAsync({accessToken})).then((res) => {
         if (res.payload.ok) {
            const allUser = res.payload.data;
            setAllUser(allUser);
         }
      });
   }, []);

   console.log('allUser', allUser);
   return (
      <AdminLayout>
         {allUser ? (
            <table className='min-w-full leading-normal'>
               <thead>
                  <tr>
                     <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs text-gray-700 uppercase tracking-wider'>
                        <span className='font-extrabold text-[1rem]'>User email</span>
                     </th>
                     <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs text-gray-700 uppercase tracking-wider'>
                        <span className='font-extrabold text-[1rem]'>User phone</span>
                     </th>

                     <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs text-gray-700 uppercase tracking-wider'>
                        <span className='font-extrabold text-[1rem]'>User Role</span>
                     </th>
                  </tr>
               </thead>
               <tbody>
                  {allUser.map((user, index) => (
                     <tr key={index}>
                        <td className='px-5 py-5 border-b border-gray-200 bg-white'>
                           <p className='text-gray-900 whitespace-no-wrap'>{user.email}</p>
                        </td>

                        <td className='px-5 py-5 bg-white border-b border-gray-200'>
                           {user.userNumber}
                        </td>

                        <td className={`px-5 py-5 bg-white border-b border-gray-200 `}>
                           <span
                              className={`${
                                 user?.role === 'admin'
                                    ? 'bg-red-600 rounded-md px-2 py-1 text-white   '
                                    : ''
                              }`}>
                              {user?.role}
                           </span>{' '}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         ) : (
            <></>
         )}
      </AdminLayout>
   );
}
