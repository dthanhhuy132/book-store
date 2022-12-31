import {useState, useEffect} from 'react';

import {AiTwotoneEdit} from 'react-icons/ai';
import {RiDeleteBin4Fill} from 'react-icons/ri';
import {useDispatch} from 'react-redux';
import {
   deleteCategoryAsync,
   getAllCategoryAsync,
} from '../../../store/categoryPromo/categoryAsynAcion';
import LoadingActionPage from '../../common/LoadingPage';
import AdminModal from '../AdminModal';
import {AdminButton} from '../common';

import {toast} from 'react-toastify';
import Cookies from 'js-cookie';
const accessToken = Cookies.get('accessToken');

export default function CategoryAdminItem({categoryItem, handleClickEditCategory}: any) {
   const dispatch = useDispatch();

   const [isShowModalDelete, setIsShowModalDelete] = useState(false);
   const [isShowLading, setIsShowLoading] = useState(false);

   function handleDeleteEvent() {
      setIsShowLoading(true);

      const categoryId = categoryItem._id;
      dispatch(deleteCategoryAsync({accessToken, categoryId})).then((res) => {
         if (res.payload.ok) {
            dispatch(getAllCategoryAsync());
         } else {
            toast.error(res.payload.message);
         }
         setIsShowLoading(false);
         setIsShowModalDelete(false);
      });
   }

   return (
      <>
         <tr key={categoryItem._id}>
            <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
               <p className='text-gray-900 whitespace-no-wrap'>{categoryItem.name}</p>
            </td>

            <td className='flex gap-5 justify-center px-5 py-5 bg-white text-sm text-right'>
               <AdminButton
                  click={() => handleClickEditCategory(categoryItem)}
                  className='py-[4px] w-[80px] flex justify-center'>
                  <AiTwotoneEdit fontSize='1rem' />
                  Edit
               </AdminButton>
               <AdminButton
                  click={() => setIsShowModalDelete(true)}
                  type='delete'
                  className='py-[4px] w-[80px] flex justify-center '>
                  <RiDeleteBin4Fill fontSize='1.5rem' />
                  Delete
               </AdminButton>
            </td>
         </tr>

         {isShowLading && <LoadingActionPage />}
         {isShowModalDelete && (
            <AdminModal
               ok={handleDeleteEvent}
               cancel={() => setIsShowModalDelete(false)}
               title={`Bạn có muốn xóa sản phẩm: ${categoryItem.name}`}></AdminModal>
         )}
      </>
   );
}
