import {useRouter} from 'next/router';
import Cookies from 'js-cookie';
import {useEffect, useMemo, useState} from 'react';
import {toast} from 'react-toastify';

import PaymentAddress from './PaymentAddress';
import PaymentMethod from './PaymentMethod';
import PaymentUserInfo from './PaymentUserInfo';

import {parseJwt} from '../../helper';
import FormatPrice from '../../helper/FormatPrice';
import uppercaseFirstLetter from '../../helper/uppercaseFirstLetter';
import PaymentTableHeader from './PaymentHeader';
import {useAppSelector} from '../../store';
import {useDispatch} from 'react-redux';
import {getCartByUserId, removeCartItemAsync} from '../../store/cart/cartAsynAction';

import * as Yup from 'yup';
import {useFormik} from 'formik';
import PaymentVoucher from './PaymentVoucher';
import {createPaymentAsyns} from '../../store/payment/paymentAsynAction';
import LoadingCocozzi from '../common/LoadingCocozzi';

const validatePaymentSchema = {
   name: Yup.string().required('Vui lòng nhập tên'),
   email: Yup.string().email('Invalid email format').required('Please enter your email!'),
   phone: Yup.string()
      .matches(/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/, 'Số điện thoại không phù hợp')
      .required('Please enter your phone number!'),
   address1: Yup.string().required('Vui lòng nhập địa chỉ'),
   address2: Yup.string().required('Vui lòng nhập địa chỉ'),
   address3: Yup.string().required('Vui lòng nhập địa chỉ'),
   paymentMethods: Yup.string(),
};

export default function Payment() {
   const dispatch = useDispatch();
   const accessToken = Cookies.get('accessToken');
   const userInfo = parseJwt(accessToken)?.data;

   const [isShowLoading, setIsShowLoading] = useState(false);
   const {cartUserState} = useAppSelector((state) => state.cart);

   const router = useRouter();
   const productBuyNow = router.query;
   const isNotProductBuyNow = Object.keys(productBuyNow).length <= 0;
   // render to product
   const [paymentProduct, setPaymentProduct] = useState(
      Object.keys(productBuyNow).length > 0 ? [productBuyNow] : null
   );

   const [shipCost, setShipCode] = useState(15000);
   const [voucher, setVoucher] = useState(0);
   const [voucherCode, setVoucherCode] = useState(0);

   // ---------------> price calculation
   const priceWithoutShipCost = useMemo(() => {
      return paymentProduct?.reduce((acc, cur: any) => (acc += cur?.price * cur?.quantity), 0);
   }, [shipCost, voucher, paymentProduct]);

   const toTalPrice = useMemo(() => {
      const voucherCost = voucher <= 100 ? (priceWithoutShipCost * voucher) / 100 : voucher;

      return priceWithoutShipCost - voucherCost + shipCost;
   }, [shipCost, voucher, paymentProduct]);

   // const dataPayment = {};
   // ---------------> formik and yup
   const initPaymentValue = {
      name: '',
      email: userInfo?.email || '',
      phone: userInfo?.userNumber || '',
      address1: 'Thành phố Hồ Chí Minh',
      address2: '',
      address3: '',
      paymentMethods: 'COD',
   };

   const formik = useFormik({
      initialValues: initPaymentValue,
      validationSchema: Yup.object(validatePaymentSchema),
      onSubmit: (values) => {
         const paymentData = {
            userId: userInfo?._id,
            totalMoney: toTalPrice,
            totalShip: shipCost,
            discountCode: voucherCode,
            paymentMethods: values.paymentMethods,
            listProduct: paymentProduct.map((product) => ({
               productId: product.prodcutId,
               quantity: product.quantity,
               productSelectColor: product.colorSelect,
            })),
            note: `${values.name} - ${values.phone}`,
            address: `${values.address3} ${values.address2} ${values.address1}`,
         };

         if (!voucherCode) {
            delete paymentData['discountCode'];
         }
         createPayment(paymentData);
      },
   });

   // change payment if user is in payment page and click on pay in bag

   function createPayment(paymentData) {
      setIsShowLoading(true);
      // console.log('paymentData', paymentData);
      dispatch(createPaymentAsyns({accessToken, paymentData})).then((res) => {
         // console.log('res cho nayl gi', res);
         if (res.payload.ok) {
            toast.success('Tạo đơn hàng thành công!!!');

            // remove cart item after checkout success if is not prodcut buy now
            if (isNotProductBuyNow) {
               cartUserState.forEach((cart) => {
                  const cartRemoveData = {
                     userId: userInfo._id,
                     productId: cart.product._id,
                  };

                  dispatch(removeCartItemAsync({accessToken, cartRemoveData})).then((res) => {
                     if (res.payload.ok) {
                        dispatch(getCartByUserId({accessToken, userId: userInfo._id}));
                        setTimeout(() => {
                           router.push('/order');
                        }, 1000);
                     }
                  });
                  setIsShowLoading(false);
               });
            } else {
               router.push('/order');
            }
         } else {
            toast.warning(
               'Tạo đơn hàng thất bại, vui lòng thử lại!!!, có thể đơn hàng đã hết hàng'
            );
            setIsShowLoading(false);
         }

         setIsShowLoading(false);
      });
   }

   useEffect(() => {
      if (!accessToken) {
         router.push('/membership');
         toast.warning('Vui lòng đăng nhập để tiến hành thanh toán đơn hàng');
      }
   }, []);

   useEffect(() => {
      if (!cartUserState) {
         dispatch(getCartByUserId({accessToken, userId: userInfo._id}));
      }
   }, [cartUserState]);

   console.log('pruduct buy now', productBuyNow);

   useEffect(() => {
      if (Object.keys(productBuyNow).length <= 0) {
         if (isNotProductBuyNow && (cartUserState || cartUserState?.length > 0)) {
            setPaymentProduct(
               cartUserState?.map((item) => ({
                  colorSelect: item?.productSelectColor,
                  name: item?.product?.name,
                  pictures: item?.product?.pictures,
                  price: item?.product?.price,
                  prodcutId: item?.product?._id,
                  size: item?.product?.size,
                  quantity: item?.product?.quantity,
               }))
            );
         }
      }
   }, [cartUserState, router.pathname]);

   // render html
   return (
      <form>
         <div className='flex flex-col md:flex-row w-full md:w-2/3 my-4 md:my-10 mx-[auto] gap-5 '>
            {/* Cart */}
            <div className='md:w-2/3 p-2 md:p-4 bg-gray-100 rounded-lg  '>
               <p className='font-bold mb-3'>VUI LÒNG HOÀN THÀNH THÔNG TIN ĐẶT HÀNG </p>

               <PaymentUserInfo userInfo={userInfo} formik={formik} setShipCost={setShipCode} />
               <PaymentMethod userInfo={userInfo} formik={formik} toTalPrice={toTalPrice} />
            </div>

            <div className='md:w-1/3'>
               <div className='sticky top-[80px] bg-gray-100 rounded-lg min-h-[80px] p-4  '>
                  <p className='font-[700] text-[#891a1c] text-[1.3rem]'>ĐƠN HÀNG CỦA BẠN</p>

                  {/* payment bag item */}
                  <table className='w-full mt-5'>
                     <PaymentTableHeader />
                     {/* payment body */}
                     <tbody>
                        {paymentProduct && paymentProduct.length > 0 ? (
                           paymentProduct.map((product, index) => {
                              return (
                                 <tr className='border-b-[1px] border-slate-300' key={index}>
                                    <td colSpan={2} className='py-1'>
                                       <div className='flex gap-1'>
                                          {/* product img */}
                                          <img
                                             src={product?.pictures[0]}
                                             alt='proImg'
                                             className='h-[70px] object-contain rounded-md'></img>

                                          {/* product info */}
                                          <div>
                                             <span className='font-bold'>
                                                {uppercaseFirstLetter(product?.name)}
                                             </span>
                                             <div className='flex gap-5'>
                                                <span className='min-w-[50px]'>
                                                   <span className='font-bold'>Size:</span>{' '}
                                                   {product?.size}
                                                </span>
                                                <div className='flex gap-2'>
                                                   <span className='font-bold'>Color:</span>
                                                   <div
                                                      className='w-[40px] h-[20px]'
                                                      style={{
                                                         backgroundColor: `${product?.colorSelect}`,
                                                      }}></div>
                                                </div>
                                             </div>
                                          </div>
                                       </div>
                                    </td>

                                    <td className='text-right flex items-end justify-end mt-[4px]'>
                                       <div className='flex flex-col'>
                                          <div>
                                             <FormatPrice price={Number(product.price)} />
                                          </div>
                                          <span className='font-bold'> x{product.quantity}</span>
                                       </div>
                                    </td>
                                 </tr>
                              );
                           })
                        ) : (
                           <tr>
                              <td>Không có sản phẩm nào</td>
                           </tr>
                        )}
                     </tbody>
                  </table>

                  <PaymentVoucher
                     setVoucher={setVoucher}
                     voucher={voucher}
                     voucherCode={voucherCode}
                     setVoucherCode={setVoucherCode}
                     priceWithoutShipCost={priceWithoutShipCost}
                  />

                  {/* ship code */}
                  <div className='flex justify-between mt-4 border-b-[1px] border-slate-400 pb-1'>
                     <p className='font-bold'>Phí giao hàng</p>
                     <p className='flex items-end'>
                        <FormatPrice price={shipCost} />
                     </p>
                  </div>

                  {/* total price */}
                  <div className='flex justify-between border-b-2 border-slate-400 font-bold text-[1.3rem] mt-5'>
                     <p>Tổng</p>
                     <p>
                        <FormatPrice price={toTalPrice} />
                     </p>
                  </div>
                  <div className='mt-3 text-white text-center '>
                     <button
                        type='button'
                        onClick={(e) => {
                           e.preventDefault();
                           formik.handleSubmit();
                        }}
                        className='font-bold w-full bg-black hover:bg-gray-900 disabled:bg-red-600 py-2 rounded-[30px] hover:cursor-pointer'>
                        Đặt hàng
                     </button>
                  </div>
               </div>
            </div>
            {/* payment */}
         </div>

         {isShowLoading && <LoadingCocozzi color='black' />}
      </form>
   );
}
