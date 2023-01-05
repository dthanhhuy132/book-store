import {AdminLayout} from '../../components/Admin';
import {useAppDispatch, useAppSelector} from '../../store';
import Cookies from 'js-cookie';
import {useEffect, useState} from 'react';
import {getTokenSSRAndCSS, parseJwt} from '../../helper';
import {getAllPaymentAsync} from '../../store/payment/paymentAsynAction';
import paymentApi from '../../service/paymentApi';
import OrderTab from '../../components/Admin/AdminOrder.tsx/orderTab';
import ProductOrder from '../../components/ProductOrder/ProductOrder';
import {setAllPaymentForAdminState} from '../../store/payment/paymentSlice';
import sortDataByUpdatedTime from '../../components/Admin/common/sortDataByUpdatedTime';

export default function AdminOrderPage({paymentList}) {
   // console.log('paymentList', paymentList);
   const dispatch = useAppDispatch();

   // get accessToken
   const accessToken = Cookies.get('accessToken');
   console.log(paymentList[0]);
   const {allPaymentAmdminState} = useAppSelector((state) => state.payment);
   // console.log('allPaymentAmdminState', allPaymentAmdminState);
   const [renderPayment, setRenderPayment] = useState(allPaymentAmdminState || paymentList);
   const [paymentType, setPaymentType] = useState('await');

   // number of each order type:

   useEffect(() => {
      if (!allPaymentAmdminState) {
         dispatch(setAllPaymentForAdminState(paymentList));
      } else if (allPaymentAmdminState.length > 0) {
         const currentPayment = allPaymentAmdminState.filter(
            (payment) => payment.orderStatus === paymentType
         );

         setRenderPayment(currentPayment);
      }
   }, [allPaymentAmdminState]);

   useEffect(() => {
      const filterOrder = allPaymentAmdminState
         ? allPaymentAmdminState?.filter((payment) => payment.orderStatus === paymentType)
         : paymentList?.filter((payment) => payment.orderStatus === paymentType);
      setRenderPayment(filterOrder);
   }, [paymentType]);

   return (
      <AdminLayout>
         <div className='w-2/3 mx-auto'>
            {/* tab cho nay */}
            <div className='mb-5'>
               <OrderTab
                  setPaymentType={setPaymentType}
                  paymentType={paymentType}
                  allOrder={allPaymentAmdminState || paymentList}
               />
            </div>
            {renderPayment?.length > 0 ? (
               <div className='flex flex-col gap-3'>
                  {sortDataByUpdatedTime(renderPayment).map((payment, index) => (
                     <ProductOrder
                        payment={payment}
                        key={payment._id}
                        index={index}
                        orderType={paymentType}
                     />
                  ))}
               </div>
            ) : (
               <p>Chưa có đơn hàng nào</p>
            )}
         </div>
      </AdminLayout>
   );
}

export const getServerSideProps = async (context: any) => {
   let paymentList;
   const [token, userToken] = getTokenSSRAndCSS(context);
   try {
      if (token) {
         const paymentRes = await paymentApi.getAllPayment(token);

         paymentList = paymentRes?.data?.data;
      }
   } catch (error) {}

   return {
      props: {
         ok: true,
         paymentList: paymentList || [],
      },
   };
};
