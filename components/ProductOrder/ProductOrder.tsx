import {useState, useMemo} from 'react';
import Cookies from 'js-cookie';

import moment from 'moment';
import {GrFormClose} from 'react-icons/gr';
import {MdOutlineDone} from 'react-icons/md';
import FormatPrice from '../../helper/FormatPrice';
import ProductOrderItem from './ProductOrderItem';
import {
   deletePaymentAsync,
   getAllPaymentAsync,
   getPaymentByUserId,
   updatePaymentByIdAsync,
} from '../../store/payment/paymentAsynAction';
import {useAppDispatch} from '../../store';
import {parseJwt} from '../../helper';
import LoadingBook365 from '../common/LoadingBook365';
import {toast} from 'react-toastify';
import {useRouter} from 'next/router';
import ProductConfirmModal from './ProductConfimModal';

export default function ProductOrder({payment, index, orderType}) {
   const router = useRouter();
   const voucher =
      payment?.listProduct?.reduce(
         (acc, cur) => (acc += cur?.product.quantity * cur?.product.price),
         0
      ) +
      payment.totalShip -
      payment.totalMoney;
   const dispatch = useAppDispatch();
   const accessToken = Cookies.get('accessToken');
   const userInfo = parseJwt(accessToken)?.data;
   const [isShowModalConfirmDelete, setIsShowModalConfirmDelete] = useState(false);
   const [isShowConfirmProductOrder, setIsShowConfirmProductOrder] = useState(false);
   const [isShowLoading, setIsShowLoading] = useState(false);

   // function delete payment
   function deletePayment(paymentId) {
      setIsShowLoading(true);
      setIsShowModalConfirmDelete(false);

      const deleteData = {
         userId: payment.userId,
         orderStatus: 'cancel',
      };
      dispatch(
         updatePaymentByIdAsync({accessToken, paymentId, paymentUpdateData: deleteData})
      ).then((res) => {
         if (res.payload.ok) {
            // get all token by admin
            if (isAdmin) {
               dispatch(getAllPaymentAsync({accessToken}));
            } else {
               // dispatch(getPaymentByUserId({accessToken, userId: userInfo._id}));
               window.location.reload();
            }
         } else {
            toast.warning('Có lỗi !!!');
         }
         setIsShowLoading(false);
      });
   }

   // function confirm payment
   function confirmOrder(paymentId) {
      setIsShowLoading(true);
      setIsShowConfirmProductOrder(false);

      const confirmOrder = {
         userId: payment.userId,
         orderStatus: 'success',
      };
      dispatch(
         updatePaymentByIdAsync({accessToken, paymentId, paymentUpdateData: confirmOrder})
      ).then((res) => {
         if (res.payload.ok) {
            dispatch(getAllPaymentAsync({accessToken}));
            toast.info('Xác nhận đơn hàng thành công');
         } else {
            toast.warning('Có lỗi !!!');
         }
         setIsShowLoading(false);
      });
   }

   const isAdmin = useMemo(() => {
      return router.pathname.indexOf('admin') >= 0;
   }, [router.pathname]);

   return (
      <div className='' key={payment._id}>
         <div className='flex justify-between'>
            <h2 className='font-bold underline  text-[1.5rem] '>
               <span className='font-extrabold'># </span>Đơn hàng số {index + 1}
            </h2>
            <div className='relative'>
               <div className='flex gap-4'>
                  {/* confirm product status */}
                  {isAdmin && orderType !== 'cancel' && orderType !== 'success' && (
                     <button
                        disabled={payment.orderStatus === 'cancel'}
                        className='text-white bg-green-700 hover:bg-green-600 px-2 py-1 rounded-lg disabled:bg-gray-300'
                        onClick={() => setIsShowConfirmProductOrder(true)}>
                        Xác nhận đơn hàng
                     </button>
                  )}

                  {/* delete product */}
                  {((isAdmin && orderType != 'cancel') ||
                     (orderType !== 'cancel' && orderType !== 'success')) && (
                     <button
                        disabled={payment.orderStatus === 'cancel'}
                        className='text-white bg-red-700 hover:bg-red-600 px-2 py-1 rounded-lg disabled:bg-gray-300'
                        onClick={() => setIsShowModalConfirmDelete(true)}>
                        Hủy đơn
                     </button>
                  )}
               </div>
               {/* modal confirm delete */}
               {isShowModalConfirmDelete && (
                  <ProductConfirmModal
                     title='Hủy đơn hàng'
                     ok={() => deletePayment(payment._id)}
                     close={() => setIsShowModalConfirmDelete(false)}
                  />
               )}

               {isShowConfirmProductOrder && (
                  <ProductConfirmModal
                     title='Xác nhận đơn hàng?'
                     ok={() => confirmOrder(payment._id)}
                     close={() => setIsShowConfirmProductOrder(false)}
                  />
               )}
            </div>
         </div>
         {/* payment info */}

         {/* containter div -> using for admin layout */}
         <div
            className={`${
               isAdmin ? 'flex gap-3 justify-between mt-2 pb-2 border-b-4 border-black' : ''
            } `}>
            <div className='mb-2 pb-2'>
               <div className=''>
                  <span>- Ngày tạo đơn:</span>
                  <span className='ml-2 font-semibold'>
                     {moment(payment.createdAt).format(' HH:mm DD/MM/YYYY')}
                  </span>
               </div>
               <div className=''>
                  <span>- Địa chỉ nhận hàng:</span>
                  <span className='ml-2 font-semibold'>{payment.address}</span>
               </div>
               <div className=''>
                  <span>- Thông tin người nhận hàng:</span>
                  <span className='ml-2 font-semibold'>{payment.note}</span>
               </div>

               <div className=''>
                  <span>- Trạng thái đơn hàng:</span>
                  <span
                     className={`ml-2 font-semibold px-2 py-[2px] rounded-xl text-white
                  ${payment.orderStatus === 'cancel' && 'bg-red-600'}
                  ${payment.orderStatus === 'await' && 'bg-blue-800'}
                  ${payment.orderStatus === 'success' && 'bg-green-600'}
                  
                  `}>
                     {payment.orderStatus === 'success' ? 'confirm' : payment.orderStatus}
                  </span>
               </div>

               <div className=''>
                  <span>- Hình thức thanh toán:</span>
                  <span className='ml-2 font-semibold'>
                     {payment.paymentMethods === 'COD'
                        ? 'Thanh toán khi nhận hàng'
                        : 'Thanh toán qua ngân hàng'}
                  </span>
               </div>
            </div>

            <div>
               <div className='flex flex-col gap-3 pb-2 border-b-2'>
                  {payment?.listProduct?.map((productOrder, index) => (
                     <ProductOrderItem key={index} productOrder={productOrder} />
                  ))}
               </div>

               <div className={` ${isAdmin ? '' : 'mt-2 pb-2 border-b-4 border-black'}`}>
                  <div className='flex justify-between'>
                     <span>Phí vận chuyển:</span>
                     <span className='ml-2 font-semibold'>
                        <FormatPrice price={payment.totalShip} />
                     </span>
                  </div>

                  <div className='flex justify-between'>
                     <span>VOUCHER:</span>
                     <span className='ml-2 font-semibold text-[#891a1c]'>
                        {payment?.discountCode}
                     </span>
                  </div>
                  <div className='flex justify-between'>
                     <span>Mã giảm giá:</span>
                     <span className='ml-2 font-semibold text-[#891a1c]'>
                        -<FormatPrice price={voucher} fontSize='1.1rem' />
                     </span>
                  </div>

                  <div className='flex justify-between'>
                     <span className='font-bold text-[1.1rem]'> Tổng đơn hàng</span>
                     <p className='ml-2 font-semibold font-[1.5rem]'>
                        <FormatPrice fontSize='1.2rem' price={payment.totalMoney} />
                     </p>
                  </div>
               </div>
            </div>
         </div>
         {isShowLoading && <LoadingBook365 color='black' />}
      </div>
   );
}
