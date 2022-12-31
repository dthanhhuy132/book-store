import {useState} from 'react';

import moment from 'moment';
import {AiTwotoneEdit} from 'react-icons/ai';
import {RiDeleteBin4Fill} from 'react-icons/ri';
import {AdminButton} from '../common';
import AdminModal from '../AdminModal';
import LoadingActionPage from '../../common/LoadingPage';
import {useAppDispatch} from '../../../store';
import {deleteVoucherAsync, getAllVoucherAsync} from '../../../store/voucher/voucherAsyncAction';

import Cookies from 'js-cookie';
import {toast} from 'react-toastify';
const accessToken = Cookies.get('accessToken');

export default function VoucherItem({voucher, handleClickEditVoucher}: any) {
   const dispatch = useAppDispatch();

   const [isShowModalDelete, setIsShowModalDelete] = useState(false);
   const [isShowLoading, setIsShowLoading] = useState(false);

   function handleDeleteVoucher() {
      setIsShowLoading(true);
      const voucherId = voucher._id;
      dispatch(deleteVoucherAsync({accessToken, voucherId})).then((res) => {
         if (res.payload.ok) {
            dispatch(getAllVoucherAsync());
         } else {
            toast.error(res.payload.message);
         }
         setIsShowLoading(false);
         setIsShowModalDelete(false);
      });
   }

   return (
      <div className='flex flex-col justify-between border-[1px] p-1 rounded-md h-full'>
         <div className=''>
            <p>
               <span className='font-bold'>Title: </span>
               <span className='text-[#991b1b] font-extrabold'>{voucher.title}</span>
            </p>

            <p>
               <span className='font-bold'>Quantity: </span>
               {voucher.amount}
            </p>

            <p>
               <span className='font-bold'>Code: </span>
               {voucher.code}
            </p>

            <p>
               <span className='font-bold'>Khuyến mãi: </span>
               <span className='font-extrabold text-blue-600'>{voucher.percent}%</span>
            </p>

            <p>
               <span className='font-bold'>Khuyến mãi: </span>
               {voucher.description}
            </p>

            <p>
               <span className='font-bold'>Date: </span>
               {moment(voucher.startDate).format('DD/MM/YYYY')} -
               {moment(voucher.endDate).format('DD/MM/YYYY')}
            </p>
         </div>

         <div className='mt-5'>
            <div className='flex justify-between mt-2'>
               <AdminButton
                  click={() => handleClickEditVoucher(voucher)}
                  className='py-[4px] w-[80px] flex justify-center'>
                  <AiTwotoneEdit fontSize='1rem' />
                  Edit
               </AdminButton>
               <AdminButton
                  click={() => setIsShowModalDelete(true)}
                  className='py-[4px] w-[80px] flex justify-center'
                  type='delete'>
                  <RiDeleteBin4Fill fontSize='1.5rem' />
                  Delete
               </AdminButton>

               {/* modal delete confirm */}
            </div>
         </div>

         {isShowModalDelete && (
            <AdminModal
               ok={handleDeleteVoucher}
               cancel={() => setIsShowModalDelete(false)}
               title={`Bạn có muốn xóa voucher: ${voucher.title}`}></AdminModal>
         )}

         {isShowLoading && <LoadingActionPage />}
      </div>
   );
}
