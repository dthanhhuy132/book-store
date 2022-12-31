import {useState, useEffect} from 'react';

import {AiOutlinePlusCircle} from 'react-icons/ai';
import {AdminLayout, AdminModal} from '../../components/Admin';
import {CategoryTableHeader} from '../../components/Admin/Category';
import CategoryAdminItem from '../../components/Admin/Category/CategoryAdminItem';
import {AdminButton} from '../../components/Admin/common';
import categoryApi from '../../service/categoryApi';
import {useAppDispatch, useAppSelector} from '../../store';

import {toast} from 'react-toastify';
import Cookies from 'js-cookie';
import CategoryCreateModal from '../../components/Admin/Category/CategoryCreateModal';
import {
   createNewCategoryAsync,
   getAllCategoryAsync,
   updateCategoryAnsync,
} from '../../store/categoryPromo/categoryAsynAcion';
import LoadingActionPage from '../../components/common/LoadingPage';
const accessToken = Cookies.get('accessToken');

export default function Category({categoryList}) {
   const dispatch = useAppDispatch();

   const [isShowModalCetegory, setIsShowModalCategory] = useState(false);
   const [editingCategory, setEditingCategory] = useState(null);
   const {allCategoryStateAdmin} = useAppSelector((state) => state.category);

   const [renderCategoryList, setRenderCategoryList] = useState(categoryList);

   const [isShowLoading, setIsShowLoading] = useState(false);
   // add new Category
   function clickCreateNewCategory() {
      setIsShowModalCategory(true);
   }

   // edit category
   function handleClickEditCategory(categoryItem) {
      setEditingCategory(categoryItem);
      setIsShowModalCategory(true);
   }

   // function handler
   function createAndUpdateNewCategory(category) {
      setIsShowLoading(true);
      const {name, categoryId} = category;

      if (categoryId) {
         const data = {name};
         // cập nhật category
         dispatch(updateCategoryAnsync({accessToken, categoryId, data})).then((res) => {
            if (res.payload.ok) {
               dispatch(getAllCategoryAsync());
               setIsShowModalCategory(false);
            } else {
               toast.error(res.payload.messsage);
            }
            setIsShowLoading(false);
         });
      } else {
         // create new category
         const data = {name: name};
         dispatch(createNewCategoryAsync({accessToken, data})).then((res) => {
            if (res.payload.ok) {
               dispatch(getAllCategoryAsync());
               setIsShowModalCategory(false);
            } else {
               toast.error(res.payload.messsage);
            }
            setIsShowLoading(false);
         });
      }
   }

   useEffect(() => {
      if (!isShowModalCetegory) {
         setEditingCategory(null);
      }
   }, [isShowModalCetegory]);

   useEffect(() => {
      if (allCategoryStateAdmin) {
         setRenderCategoryList(allCategoryStateAdmin);
      }
   }, [allCategoryStateAdmin]);

   return (
      <AdminLayout>
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
                           {renderCategoryList.map((categoryItem, index) => (
                              <CategoryAdminItem
                                 key={index}
                                 categoryItem={categoryItem}
                                 handleClickEditCategory={handleClickEditCategory}
                              />
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
            {isShowModalCetegory && (
               <AdminModal
                  showFooter={false}
                  title={`${editingCategory ? 'Edit category' : 'Create new category'}`}>
                  <CategoryCreateModal
                     cancel={() => setIsShowModalCategory(false)}
                     editingCategory={editingCategory}
                     createAndUpdateNewCategory={createAndUpdateNewCategory}
                  />
               </AdminModal>
            )}
         </div>
         {isShowLoading && <LoadingActionPage />}
      </AdminLayout>
   );
}

export const getServerSideProps = async () => {
   let categoryList;
   try {
      const categoryRes = await categoryApi.getAllCategory();
      const categoryData = categoryRes?.data?.data;
      // promoList = categoryList.filter((item) => item);
      categoryList = categoryData.filter(
         (cate) =>
            cate.status == true &&
            (cate?.description?.indexOf('-category-for-promo') < 0 || !cate?.description)
      );
   } catch (error) {}

   return {
      props: {
         categoryList: categoryList || [],
      },
   };
};
