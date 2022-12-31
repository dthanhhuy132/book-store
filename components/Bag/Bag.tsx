import {useEffect, useState, useMemo} from 'react';
import {useRouter} from 'next/router';
import {useDispatch} from 'react-redux';
import {BagHeader, BagItem} from './index';
import {updateCartUserState} from '../../store/cart/cartSlice';
import {toast} from 'react-toastify';
import Cookies from 'js-cookie';
import {parseJwt} from '../../helper';
import {useAppSelector} from '../../store';
import {getRandomValues} from 'crypto';
import randomProductIndexForHeader from '../../helper/randomProductIndexForHeader';

export default function Bag({carts}) {
   const router = useRouter();
   const accessToken = Cookies.get('accessToken');

   // productListState
   const {productListState} = useAppSelector((state) => state.product);

   // renderCartList
   const cartItems = carts?.cartItems;
   const [renderCartList, setRenderCartList] = useState(
      cartItems.length >= 2
         ? cartItems.sort((productCart1, productCart2) => {
              if (productCart1?.product?.name < productCart2?.product?.name) return -1;
              if (productCart1?.product?.name > productCart2?.product?.name) return 1;
              return 0;
           })
         : cartItems || []
   );
   const {cartUserState} = useAppSelector((state) => state.cart);

   useEffect(() => {
      if (!accessToken) {
         router.push('/membership');
         toast.warning('Vui lòng đăng nhập để xem giỏ hàng!');
      }
   }, []);

   useEffect(() => {
      if (cartUserState) {
         setRenderCartList(cartUserState);
      }
   }, [cartUserState]);

   const totalPrice = useMemo(
      () =>
         renderCartList.reduce(
            (acc, cur) => (acc += cur?.product?.price * cur?.product?.quantity),
            0
         ),
      [renderCartList]
   );

   const amountOfRelativeProduct = Math.ceil(renderCartList.length / 4);
   const differentProductFilter = productListState?.filter(
      (productItem) =>
         !renderCartList.includes((productCart) => productCart.product.name !== productItem.name)
   );

   // const randomProductRelative = getRandomValues()

   return (
      <div className='flex flex-col mx-[auto] lg:flex-row w-full px-2 md:px-0 md:w-5/6 lg:w-2/3 my-4 md:my-10 gap-5 '>
         {/* Cart */}
         <div className='w-full lg:w-3/4 p-2 md:p-4 bg-gray-100 rounded-lg'>
            <table className='w-full border-separate border-spacing-y-[10px]'>
               <thead className='text-[0.95rem]' style={{fontFamily: 'GilroySemibold'}}>
                  <BagHeader />
               </thead>
               <tbody className='p-2'>
                  {renderCartList?.length > 0 ? (
                     renderCartList?.map((productCart, index) => (
                        <BagItem productCart={productCart} key={productCart?.product?._id} />
                     ))
                  ) : (
                     <tr>
                        <td>Giỏ hàng trống!</td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>

         <div className='w-full lg:w-1/3'>
            <div className='sticky top-[80px]'>
               <div className=' bg-gray-100 rounded-lg min-h-[80px] p-4'>
                  <div className='flex justify-between border-b-2 border-black font-bold text-[1.3rem]'>
                     <p>Tổng</p>
                     <p>
                        <span className='pr-1'>₫</span>
                        {totalPrice.toLocaleString('en-US')}
                     </p>
                  </div>

                  <div className='bg-black mt-3 text-white text-center py-2 rounded-[30px] hover:bg-gray-900 hover:cursor-pointer'>
                     <p className='font-bold' onClick={() => router.push('/payment')}>
                        Tiến hành thanh toán
                     </p>
                  </div>
               </div>
               {/* <div className='grid grid-cols-1 mt-4 justify-between rounded-lg p-4 bg-gray-100'>
                  {imgArr.map((img, index) => (
                     <ProductItem key={index} img={img} displayPrice={true}></ProductItem>
                  ))}
               </div> */}
            </div>
         </div>
         {/* payment */}
      </div>
   );
}
