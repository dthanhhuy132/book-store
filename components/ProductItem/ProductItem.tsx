import {useEffect, useState} from 'react';
import Image, {StaticImageData} from 'next/image';
import {useRouter} from 'next/router';
import FormatPrice from '../../helper/FormatPrice';
import stringToSlug from '../../helper/stringToSlug';
import uppercaseFirstLetter from '../../helper/uppercaseFirstLetter';
import useWindowDimensions from '../../hooks/UseWindowDimensions';
import {ProductDetailColorSelect, ProductDetailSizeSelect} from '../ProductDetailItem';
import {BsFillCartPlusFill, BsFillCartXFill} from 'react-icons/bs';
import Cookies from 'js-cookie';
import {toast} from 'react-toastify';
import {parseJwt} from '../../helper';
import {useAppDispatch} from '../../store';
import {addCartItem, getCartByUserId} from '../../store/cart/cartAsynAction';
import LoadingBook365 from '../common/LoadingBook365';

// import imageSuccess from '../../public/icon/';

interface IProductItem {
   product: any;
   displayPrice?: boolean;
   smallName?: boolean;
   showPrice?: boolean;
}

export default function ProductItem({product, smallName = false, showPrice = true}: IProductItem) {
   console.log('product trong product item', product);
   const router = useRouter();
   const dispatch = useAppDispatch();
   const {width} = useWindowDimensions();

   // add to cart success icon
   const [isShowLoading, setIsShowLoading] = useState(false);

   // size selection

   // check user -------> click add to cart
   const accessToken = Cookies.get('accessToken');
   const userInfo = parseJwt(accessToken)?.data;

   function handleClickAddToCart() {
      if (!accessToken) {
         toast.warning('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
         router.push('/membership');
      } else {
         setIsShowLoading(true);

         const userId = userInfo._id;
         const cartItems = {
            productId: product.id,
            quantity: 1,
            productSelectColor: '#fff',
         };
         const cartData = {userId, cartItems};
         dispatch(addCartItem({accessToken, cartData})).then((res) => {
            if (res.payload.ok) {
               dispatch(getCartByUserId({accessToken, userId})).then((res) => {
                  if (res.payload.ok) {
                     setIsShowLoading(false);
                     toast.success('Đã thêm sản phẩm vào giỏ hàng');
                  } else {
                     toast.success('Vui lòng tải lại trang để cập nhật giỏ hàng');
                     setIsShowLoading(false);
                  }
               });
            } else {
               const message = res.payload.message;
               if (message == 'amount < quantity') {
                  toast.error('Sản phẩm đã hết hàng');
               }
               toast.error('Thêm sản phẩm thât bại, vui lòng thử lại sau!!!');
               setIsShowLoading(false);
            }
         });
      }
   }

   return (
      <div className='relative flex flex-col justify-between p-[2px] md:px-2 transition'>
         {/* avatar */}
         <div className='relative'>
            <img
               src={product?.pictures ? product?.pictures[0] : ''}
               className='rounded-md cursor-pointer'
               alt='Hình ảnh sản phẩm'
               onClick={() => router.push(`/product/${stringToSlug(product.name)}`)}
            />
         </div>
         <div className={`flex justify-between mt-2 px-2 text-[0.9rem] md:text-[1rem]`}>
            <div className={`${smallName ? 'w-[100%]' : 'w-[80%]'} flex flex-col justify-between`}>
               <h3
                  className={`font-bold ${
                     smallName && 'text-[0.9rem] text-center'
                  } line-clamp-2 cursor-pointer`}
                  onClick={() => router.push(`/product/${stringToSlug(product.name)}`)}>
                  {uppercaseFirstLetter(product?.name)}
               </h3>
               {showPrice && (
                  <div className='flex items-end'>
                     <p>
                        <FormatPrice price={product?.price}></FormatPrice>
                     </p>

                     <span className='line-through text-gray-500 text-[0.9rem] ml-2'>
                        <span className={`text-[0.9rem] font-bold mr-[2px]`}>₫</span>
                        {(product.price + (product.price * 10) / 100).toLocaleString()}
                     </span>

                     <span className='text-[#891a1c] font-semibold text-[0.9rem] ml-2'>10%</span>
                  </div>
               )}
            </div>

            <BsFillCartPlusFill
               className='text-[1.4rem] text-gray-500 hover:text-[#891a1c] cursor-pointer'
               onClick={handleClickAddToCart}
            />
         </div>

         {isShowLoading && <LoadingBook365 color='grey' />}
      </div>
   );
}
