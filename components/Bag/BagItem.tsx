import {useState, useEffect} from 'react';

import Image, {StaticImageData} from 'next/image';
import {AiOutlineCloseCircle} from 'react-icons/ai';
import FormatPrice from '../../helper/FormatPrice';
import uppercaseFirstLetter from '../../helper/uppercaseFirstLetter';
import useWindowDimensions from '../../hooks/UseWindowDimensions';
import InputQuantity from './InputQuantity';
import {MdOutlineDone} from 'react-icons/md';
import {GrFormClose} from 'react-icons/gr';
import {parseJwt} from '../../helper';

import Cookies from 'js-cookie';
import {addCartItem, getCartByUserId, removeCartItemAsync} from '../../store/cart/cartAsynAction';
import {useAppDispatch, useAppSelector} from '../../store';
import LoadingCocozzi from '../common/LoadingCocozzi';
import {toast} from 'react-toastify';
import {getProductByNameAsync} from '../../store/product/productAsynAction';
import {useDebounce} from 'use-debounce';

// import Dropdown from 'react-dropdown';

interface IBagItem {
   img: StaticImageData;
   // key: number;
}

export default function BagItem({productCart}) {
   const {isMobile} = useWindowDimensions();

   const dispatch = useAppDispatch();

   // get all productBy group Name -> reselect size and color or compare quantity ()
   // -> get product quantity => to compare maximum number
   const {productListState} = useAppSelector((state) => state.product);
   const currentProduct = productListState?.filter(
      (item) => item.name === productCart.product.name
   )[0];

   const currentProductQuantity = currentProduct?.size[productCart.product.size];

   // get all Cart item from redux => update when update or delete
   const {cartUserState} = useAppSelector((state) => state.cart);

   // cartQuantity && cartQuantity debounce -> update after ...
   const [productCartQuantity, setProductCartQuantity] = useState(productCart?.product?.quantity);
   const [prodcutCartQuantityDebounce] = useDebounce(productCartQuantity, 1000);

   const [isShowModalConfirmDelete, setModalIsShowConfirmDelete] = useState(false);
   const [isShowLoading, setIsShowLoading] = useState(false);

   // get userIfo
   const accessToken = Cookies.get('accessToken');
   const userInfo = parseJwt(accessToken)?.data;
   const userId = userInfo?._id;
   function deleteCartItem() {
      setModalIsShowConfirmDelete(false);
      setIsShowLoading(true);
      const cartRemoveData = {
         userId: userId,
         productId: productCart.product._id,
      };
      dispatch(removeCartItemAsync({accessToken, cartRemoveData})).then((res) => {
         if (res.payload.ok) {
            dispatch(getCartByUserId({accessToken, userId: userId}));
            toast.success('Xóa sản phẩm thành công!!!');
         } else {
            toast.warning('Xóa sản phẩm không thành công!!!');
         }

         setIsShowLoading(false);
      });
   }

   function updateCart() {
      setIsShowLoading(true);
      // Nếu thay đổi size, màu sắc hoặc số lượng > 1 => xóa sản phẩm cũ => tạo thêm sản phẩm mới

      const cartItems = {
         productId: productCart?.product?._id,
         quantity: productCartQuantity,
         productSelectColor: productCart?.productSelectColor,
      };

      const cartRemoveData = {
         userId: userId,
         productId: productCart.product._id,
      };
      const cartData = {userId, cartItems};
      // delete first
      dispatch(removeCartItemAsync({accessToken, cartRemoveData})).then((res) => {
         if (res.payload.ok) {
            dispatch(addCartItem({accessToken, cartData})).then((res) => {
               if (res.payload.ok) {
                  dispatch(getCartByUserId({accessToken, userId}));
               } else {
                  const message = res.payload.message;
                  if (message == 'amount < quantity') {
                     toast.error('Sản phẩm đã hết hàng');
                  }
                  toast.error('Cập nhật thất bại, vui lòng thử lại sau!!!');
               }
               setIsShowLoading(false);
            });
         } else {
            toast.warning('Cập nhật thất bại, vui lòng thử lại sau!!!');
         }
      });

      // then add to cart
   }

   function handleOnClickDeleteButton() {
      setModalIsShowConfirmDelete(true);
   }

   // userEffect to re select color and size
   useEffect(() => {
      dispatch(getProductByNameAsync());
   }, [cartUserState]);

   // update cart after quantity change
   useEffect(() => {
      if (prodcutCartQuantityDebounce !== productCart.product.quantity) {
         updateCart();
      }
   }, [prodcutCartQuantityDebounce]);

   return (
      <>
         <tr>
            <td className='relative border-b pb-3 border-black '>
               {isShowModalConfirmDelete && (
                  <>
                     <div className='fixed bg-black bg-opacity-75 inset-0 z-[49]'></div>
                     <div
                        className='absolute top-[45%] translate-y-[-50%] left-10 z-[200] bg-black bg-opacity-50 p-2 rounded-lg 
                     
                  '>
                        <p className='text-white text-[0.9rem] mb-2 text-center'>Xóa sản phẩm?</p>
                        <div className='flex gap-2'>
                           <div
                              className='py-1 px-4 text-[1.5rem] bg-green-600 hover:bg-green-400 text-white rounded-lg cursor-pointer'
                              onClick={deleteCartItem}>
                              <MdOutlineDone />
                           </div>
                           <div
                              className='py-1 px-4 text-[1.5rem] bg-red-600 hover:bg-red-400 text-white rounded-lg cursor-pointer'
                              onClick={() => setModalIsShowConfirmDelete(false)}>
                              <GrFormClose />
                           </div>
                        </div>
                     </div>
                  </>
               )}
               <div className='flex gap-2 items-center'>
                  <span>
                     <AiOutlineCloseCircle
                        className='text-[1.3rem] text-gray-400 hover:cursor-pointer hover:text-gray-900'
                        onClick={handleOnClickDeleteButton}
                     />
                  </span>
                  <img
                     src={productCart?.product?.pictures[0]}
                     alt=''
                     className='w-[80px] rounded-md'
                  />
                  <div className={`${isMobile && 'flex flex-col flex-1 gap-1'}`}>
                     <div className='text-[0.9rem] '>
                        {/* name */}
                        <p className='whitespace-pre-line font-bold'>
                           {uppercaseFirstLetter(productCart?.product.name)}
                        </p>
                        {/* product color + size */}
                        <div className='flex gap-5'>
                           <div className='flex gap-2 items-center min-w-[60px]'>
                              <span>Size: </span>

                              <span className='font-bold'>{productCart?.product?.size}</span>
                           </div>
                           <div className='flex gap-2 items-center'>
                              <span>Color: </span>{' '}
                              <div
                                 className='w-[30px] h-[16px]'
                                 style={{backgroundColor: productCart.productSelectColor}}></div>
                           </div>
                        </div>
                     </div>

                     {/* price and quantity */}
                     <div
                        className={`${
                           !isMobile && 'hidden'
                        } flex items-center justify-between gap-2`}>
                        <p className='flex items-start'>
                           <span className='mr-1'>2 x </span>
                           <FormatPrice price={productCart?.product?.price} />
                        </p>
                        <div className='w-[35%]'>
                           <InputQuantity
                              value={productCartQuantity}
                              setProductCartQuantity={setProductCartQuantity}
                              max={currentProductQuantity}></InputQuantity>
                        </div>
                     </div>
                  </div>

                  {/* --------------> is show loading when update/delete cart */}
                  {isShowLoading && <LoadingCocozzi color='grey' />}
               </div>
            </td>
            <td className={`${isMobile && 'hidden'} px-5 font-bold border-b pb-3 border-black`}>
               <FormatPrice price={Number(productCart?.product?.price)} />
            </td>
            <td className={`${isMobile && 'hidden'} px-5 border-b pb-3 border-black`}>
               <InputQuantity
                  value={productCartQuantity}
                  setProductCartQuantity={setProductCartQuantity}
                  max={currentProductQuantity}></InputQuantity>
            </td>
            <td className={`${isMobile && 'hidden'} px-5 font-bold border-b pb-3 border-black`}>
               <FormatPrice price={Number(productCart?.product?.price * productCartQuantity)} />
            </td>
         </tr>
      </>
   );
}
