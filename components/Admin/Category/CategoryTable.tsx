import {useState, useEffect} from 'react';
import AdminModal from '../AdminModal';
import CategoryTableHeader from './CategoryTableHeader';
import Dropdown from 'react-dropdown';
import {AdminButton} from '../common';
import {AiOutlinePlusCircle, AiTwotoneEdit} from 'react-icons/ai';
import {RiDeleteBin4Fill} from 'react-icons/ri';
import LoadingActionPage from '../../common/LoadingPage';

const options = ['active', 'disable'];

export default function CategoryTable({categoryList}: any) {
   const [isShowModalCetegory, setIsShowModalCategory] = useState(false);
   const [editItem, setEditItem] = useState(null);

   const [isShowLading, setIsShowLoading] = useState(false);
   const [isShowModalDelete, setIsShowModalDelete] = useState(false);
   // add new Category
   function clickCreateNewCategory() {
      setIsShowModalCategory(true);
   }

   // edit category
   function handleOnclickCategoryOption(categoryItem) {
      setEditItem(categoryItem);
      setIsShowModalCategory(true);
   }

   // function handler
   function createAndUpdateNewCategory() {
      if (editItem?._id) {
         const updateCategory = {
            name: editItem.name,
            status: editItem.status,
         };
      } else {
         const newCategory = {
            name: editItem?.name || '',
            status: editItem?.status !== undefined ? editItem.status : true,
         };
      }
   }

   useEffect(() => {
      if (!isShowModalCetegory) {
         setEditItem(null);
      }
   }, [isShowModalCetegory]);

   return (
      <div className='container w-[50%] px-8'>
         <div className=''>
            {/* title */}
            <div className='flex gap-10 items-center'>
               <h2 className='text-2xl font-semibold'>Category list</h2>
               <AdminButton click={clickCreateNewCategory}>
                  <AiOutlinePlusCircle /> Create new Category
               </AdminButton>
            </div>

            {/* category table */}
            <div className='-mx-4 sm:-mx-8 px-4 py-4 overflow-x-auto'>
               <div className='inline-block min-w-full shadow-md rounded-lg overflow-hidden'>
                  <table className='min-w-full leading-normal'>
                     <CategoryTableHeader />
                     <tbody>
                        {categoryList.map((categoryItem) => (
                           <tr key={categoryItem._id}>
                              <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                                 <div>
                                    <p className='text-gray-900 whitespace-no-wrap'>
                                       {categoryItem.name}
                                    </p>
                                 </div>
                              </td>

                              <td className='flex gap-5 justify-center px-5 py-5 bg-white text-sm text-right'>
                                 <AdminButton
                                    click={() => handleOnclickCategoryOption(categoryItem)}
                                    className='py-[4px] w-[80px] flex justify-center'>
                                    <AiTwotoneEdit fontSize='1rem' />
                                    Edit
                                 </AdminButton>
                                 <AdminButton
                                    click={() => setIsShowModalDelete(true)}
                                    className='py-[4px] w-[80px] flex justify-center bg-red-800 hover:bg-red-700'>
                                    <RiDeleteBin4Fill fontSize='1.5rem' />
                                    Delete
                                 </AdminButton>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
         {isShowModalCetegory && (
            <AdminModal
               ok={createAndUpdateNewCategory}
               cancel={() => setIsShowModalCategory(false)}
               title='Edit category'>
               <div>
                  <table className='min-w-full leading-normal'>
                     <CategoryTableHeader isShow3Col={false} />
                     <tbody>
                        <tr className=''>
                           <td className='py-5 border-b border-gray-200 bg-white text-sm'>
                              <input
                                 type='text'
                                 defaultValue={editItem?.name}
                                 className='w-full border-2 px-5 py-2 rounded-md'
                                 onChange={(e) => setEditItem({...editItem, name: e.target.value})}
                              />
                           </td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </AdminModal>
         )}

         {isShowLading && <LoadingActionPage />}
      </div>
   );
}
