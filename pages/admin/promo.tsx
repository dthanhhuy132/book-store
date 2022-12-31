import {useState, useEffect} from 'react';

import {AiOutlinePlusCircle, AiTwotoneEdit} from 'react-icons/ai';
import {AdminLayout, AdminModal} from '../../components/Admin';
import {AdminButton, WarningText} from '../../components/Admin/common';
import categoryApi from '../../service/categoryApi';
import PromoInstruction from '../../components/Admin/Promo/PromoInstruction';
import ModalCreateEventForPromo from '../../components/Admin/Promo/ModalCreateEventForPromo';
import ModalCreatePromo from '../../components/Admin/Promo/ModalCreatePromo';
import eventApi from '../../service/eventApi';

import Cookies from 'js-cookie';
import handleCategoryDescription from '../../components/Admin/common/handleCategoryDescription';
import {RiDeleteBin4Fill} from 'react-icons/ri';
import PromoAdminItem from '../../components/Admin/Promo/PromoAdminItem';
import {useAppDispatch, useAppSelector} from '../../store';
import {
   createNewCategoryAsync,
   getAllCategoryAsync,
} from '../../store/categoryPromo/categoryAsynAcion';

import LoadingActionPage from '../../components/common/LoadingPage';

import {toast} from 'react-toastify';

export default function PromoPage({promoList, eventList}) {
   const {allPromoState} = useAppSelector((state) => state.category);
   const [isShowLoading, setIsShowLoading] = useState(false);
   const dispatch = useAppDispatch();

   // create render promo list -> auto update list when delete/create/update
   const [rederPromoList, setRenderPromoList] = useState(allPromoState || promoList);

   const [isShowModalForEventPromo, setIsShowModalForEventPromo] = useState(false);
   const [isShowModalForPromo, setIsShowModalForPromo] = useState(false);

   const [edittingPromo, setEdittingPromo] = useState(null);
   const accessToken = Cookies.get('accessToken');

   function createNewEventForPromo() {}

   function createUpdatePromo(promo) {
      setIsShowLoading(true);
      const {name, description, eventId, categoryImage} = promo;
      const promoDescription = `${description} -category-for-promo`;
      const formData = new FormData();

      formData.append('name', name);
      formData.append('description', promoDescription);
      eventId.forEach((event, index) => formData.append(`event[${index}][eventId]`, event));

      formData.append('categoryImage', categoryImage);

      dispatch(createNewCategoryAsync({accessToken, formData})).then((res) => {
         if (res.payload.ok) {
            dispatch(getAllCategoryAsync());
         } else {
            toast.error(res.payload.message);
         }
         setIsShowLoading(false);
      });
   }

   useEffect(() => {
      if (allPromoState?.length > 0 && allPromoState) {
         setRenderPromoList(allPromoState);
      }
   }, [allPromoState]);

   return (
      <AdminLayout>
         <div className='border-b-2 pb-2'>
            <PromoInstruction></PromoInstruction>

            {/* button Tạo event vaf promo */}
            <div className=''>
               <AdminButton
                  className='min-w-[250px]'
                  click={() => setIsShowModalForEventPromo(true)}>
                  <AiOutlinePlusCircle /> Create new Event for Promo
               </AdminButton>

               <AdminButton
                  className='mt-2 min-w-[250px]'
                  click={() => setIsShowModalForPromo(true)}>
                  <AiOutlinePlusCircle /> Create new Promo
               </AdminButton>
            </div>
         </div>

         {/* render promo list */}
         <div>
            <h2 className='mt-4 font-extrabold text-[1.3rem]'>Promo list</h2>
            <div className='grid grid-cols-3 gap-5 gap-y-10 mt-5'>
               {rederPromoList.map((promo) => (
                  <PromoAdminItem key={promo._id} promo={promo} eventList={eventList} />
               ))}
            </div>
         </div>

         {isShowModalForEventPromo && (
            <AdminModal
               showFooter={false}
               className='w-[800px] pb-2'
               title='Create new Event for Promo'>
               <ModalCreateEventForPromo cancel={() => setIsShowModalForEventPromo(false)} />
            </AdminModal>
         )}

         {isShowModalForPromo && (
            <AdminModal showFooter={false} className='w-[800px] pb-2' title='Create new Promo'>
               <ModalCreatePromo
                  eventList={eventList}
                  cancel={() => setIsShowModalForPromo(false)}
                  createUpdatePromo={createUpdatePromo}
               />
            </AdminModal>
         )}
         {isShowLoading && <LoadingActionPage />}
      </AdminLayout>
   );
}

export const getServerSideProps = async () => {
   let promoList, eventList;
   try {
      const categoryRes = await categoryApi.getAllCategory();
      const eventRes = await eventApi.getAllEvent();

      eventList = eventRes?.data?.data || [];
      // promoList = categoryList.filter((item) => item);
      promoList = categoryRes?.data?.data.filter(
         (cate) => cate.status == true && cate?.description?.indexOf('-category-for-promo') >= 0
      );
   } catch (error) {}

   return {
      props: {
         promoList: promoList || [],
         eventList: eventList || [],
      },
   };
};
