import {useEffect, useState} from 'react';

import {AiOutlinePlusCircle} from 'react-icons/ai';
import {AdminLayout, AdminModal} from '../../components/Admin';
import {AdminButton} from '../../components/Admin/common';
import ModalCreateVoucher from '../../components/Admin/Voucher/ModalCreateVoucher';
import LoadingActionPage from '../../components/common/LoadingPage';
import voucherApi from '../../service/voucherApi';
import {useAppDispatch, useAppSelector} from '../../store';
import {getAllCategoryAsync} from '../../store/categoryPromo/categoryAsynAcion';
import {
   createVoucherAsync,
   getAllVoucherAsync,
   updateVoucherAsync,
} from '../../store/voucher/voucherAsyncAction';

import Cookies from 'js-cookie';
import VoucherItem from '../../components/Admin/Voucher/VoucherItem';
import {toast} from 'react-toastify';

const accessToken = Cookies.get('accessToken');
export default function VoucherPage({activeVoucherList}) {
   const dispatch = useAppDispatch();

   const [renderVoucherList, setRenderVoucherList] = useState(activeVoucherList);
   const {voucherActiveListState} = useAppSelector((state) => state.voucher);

   const [isShowVoucherModal, setIsShowVoucherModal] = useState(false);
   const [isShowLoading, setIsShowLoading] = useState(false);

   const [edittingVoucher, setEdittingVoucher] = useState(null);

   function handleCreateUpdateVoucher(voucher) {
      setIsShowLoading(true);
      // update voucher
      if (voucher.id) {
         const voucherId = voucher.id;
         delete voucher.id;
         dispatch(updateVoucherAsync({accessToken, voucherId, voucher})).then((res) => {
            if (res.payload.ok) {
               dispatch(getAllVoucherAsync());
               setIsShowVoucherModal(false);
            } else {
               toast.error(res.payload.message);
            }
            setIsShowLoading(false);
         });
      }
      // create new voucher
      if (!voucher.id) {
         dispatch(createVoucherAsync({accessToken, voucher})).then((res) => {
            if (res.payload.ok) {
               dispatch(getAllVoucherAsync());
               setIsShowVoucherModal(false);
            } else {
               toast.error(res.payload.message);
            }
            setIsShowLoading(false);
         });
      }
   }

   function handleClickEditVoucher(voucher) {
      setEdittingVoucher(voucher);
      setIsShowVoucherModal(true);
   }

   useEffect(() => {
      if (voucherActiveListState || voucherActiveListState?.length > 0) {
         setRenderVoucherList(voucherActiveListState);
      }
   }, [voucherActiveListState]);

   // reset editting voucher
   useEffect(() => {
      if (!isShowVoucherModal) {
         setEdittingVoucher(null);
      }
   }, [isShowVoucherModal]);

   return (
      <AdminLayout>
         <div className='border-b-2 pb-2'>
            {/* button Tạo event vaf promo */}
            <div className=''>
               <AdminButton
                  className='mt-2 min-w-[250px]'
                  click={() => setIsShowVoucherModal(true)}>
                  <AiOutlinePlusCircle /> Create new Voucher
               </AdminButton>
            </div>
         </div>

         {/* render Voucher List */}
         <div className='mt-2'>
            {renderVoucherList.length > 0 ? (
               <div className='grid grid-cols-3 gap-x-5 gap-y-3'>
                  {renderVoucherList.map((voucher) => (
                     <VoucherItem
                        voucher={voucher}
                        key={voucher._id}
                        handleClickEditVoucher={handleClickEditVoucher}></VoucherItem>
                  ))}
               </div>
            ) : (
               <p>Chưa có voucher nào</p>
            )}
         </div>

         {isShowVoucherModal && (
            <AdminModal
               showFooter={false}
               className='pb-2'
               title='Create new Promo'
               cancel={() => setIsShowVoucherModal(false)}>
               <ModalCreateVoucher
                  cancel={() => setIsShowVoucherModal(false)}
                  handleCreateUpdateVoucher={handleCreateUpdateVoucher}
                  edittingVoucher={edittingVoucher}
               />
            </AdminModal>
         )}
         {isShowLoading && <LoadingActionPage />}
      </AdminLayout>
   );
}

export const getServerSideProps = async () => {
   let voucherList = [];
   let activeVoucherList = [];
   let inavtiveVoucherList = [];
   try {
      const voucherRes = await voucherApi.getAllVoucher();

      voucherList = voucherRes?.data.data;

      activeVoucherList = voucherList.filter((item) => item.status == true);
      inavtiveVoucherList = voucherList.filter((item) => item.status == false);
   } catch (error) {}

   // const voucherList = voucherRes?.data?.data || [];
   // const promoList = categoryList.filter((item) => item.name.indexOf('for-promo') >= 0);

   return {
      props: {
         voucherList: voucherList,
         activeVoucherList,
         inavtiveVoucherList,
      },
   };
};
