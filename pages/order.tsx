import {useState, useMemo, useEffect} from 'react';
import ProductOrderItem from '../components/ProductOrder/ProductOrderItem';
import Select from 'react-select';

import {getTokenSSRAndCSS} from '../helper';
import paymentApi from '../service/paymentApi';
import Cookies from 'js-cookie';
import {useRouter} from 'next/router';
import {toast} from 'react-toastify';
import ProductOrder from '../components/ProductOrder/ProductOrder';
import OrderTab from '../components/Admin/AdminOrder.tsx/orderTab';
import sortDataByUpdatedTime from '../components/Admin/common/sortDataByUpdatedTime';

const options = [
   {value: 'cancel', label: 'cancel'},
   {value: 'await', label: 'await'},
   {value: 'success', label: 'success'},
];

export default function MyOrderPage({paymentList}) {
   const router = useRouter();
   const accessToken = Cookies.get('accessToken');

   // isloading
   // confirm delete modal

   const [renderPayment, setRenderPayment] = useState(paymentList);
   const [orderType, setOrderType] = useState('await');

   useEffect(() => {
      if (!accessToken) {
         router.push('/membership');
         toast.warning('Vui lòng đăng nhập để xem đơn hàng');
      }
   }, []);

   useEffect(() => {
      const filterOrder = paymentList.filter((payment) => payment.orderStatus === orderType);
      setRenderPayment(filterOrder);
   }, [orderType]);

   return (
      <div className='flex flex-col gap-5 py-2 px-2 w-full md:w-1/2 md:mx-auto mb-2'>
         <div className='flex flex-col md:flex-row items-center justify-between'>
            <h2 className='font-bold text-[1rem] md:text-[1.2rem] lg:text-[1.5rem]'>
               Thông tin đơn hàng
            </h2>
            <OrderTab paymentType={orderType} setPaymentType={setOrderType} small={true}></OrderTab>
         </div>

         {renderPayment.length > 0 ? (
            sortDataByUpdatedTime(renderPayment).map((payment, index) => {
               return (
                  <ProductOrder
                     payment={payment}
                     key={payment._id}
                     index={index}
                     orderType={orderType}
                  />
               );
            })
         ) : (
            <p>Chưa có đơn hàng nào</p>
         )}
      </div>
   );
}

export const getServerSideProps = async (context: any) => {
   let paymentList;
   const [token, userToken] = getTokenSSRAndCSS(context);
   const userId = userToken?.data._id;
   console.log(token, userId);
   try {
      if (token && userId) {
         const paymentRes = await paymentApi.getPaymentByUser(token, userId);

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
