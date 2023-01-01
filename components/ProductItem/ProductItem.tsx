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
import LoadingCocozzi from '../common/LoadingCocozzi';

// import imageSuccess from '../../public/icon/';

interface IProductItem {
   product: any;
   displayPrice?: boolean;
   smallName?: boolean;
   showPrice?: boolean;
}

export default function ProductItem({product, smallName = false, showPrice = true}: IProductItem) {
   const router = useRouter();
   const dispatch = useAppDispatch();
   const {width} = useWindowDimensions();

   const [isShowProductSelect, setIsShowProductSelect] = useState(false);
   const [productIsSelecting, setProductIsSelecting] = useState(null);
   // add to cart success icon
   const [isShowLoading, setIsShowLoading] = useState(false);

   // size selection
   const [sizeSelect, setSizeSelect] = useState(null);
   const [colorSelect, setColorSelect] = useState(null);

   // check user -------> click add to cart
   const accessToken = Cookies.get('accessToken');
   const userInfo = parseJwt(accessToken)?.data;

   function handleClickAddToCart() {
      if (!accessToken) {
         toast.warning('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
         router.push('/membership');
      } else {
         setProductIsSelecting(product);
         console.log('product la gi', product);
         setIsShowProductSelect(true);
      }
   }

   // -----------> Click buy now
   function clickBuyNow() {
      if (!colorSelect || !sizeSelect) {
         toast.warning('Vui lòng chọn "MÀU SẮC" và "SIZE" sản phẩm');
      } else {
         // name, picture, productId,
         // const {name, pictures, price, productId} = product;
         const productPayment = {
            name: product.name,
            pictures: product.pictures,
            price: product.price,
            colorSelect: colorSelect,
            size: sizeSelect.size,
            prodcutId: sizeSelect.sizeProductID,
            quantity: 1,
         };

         router.push({pathname: '/payment', query: productPayment});
         setIsShowProductSelect(false);
      }
   }

   function clickAddToCart() {
      if (!colorSelect || !sizeSelect) {
         toast.warning('Vui lòng chọn "MÀU SẮC" và "SIZE" sản phẩm');
      } else {
         setIsShowLoading(true);

         const userId = userInfo._id;
         const cartItems = {
            productId: sizeSelect?.sizeProductID,
            quantity: 1,
            productSelectColor: colorSelect,
         };
         const cartData = {userId, cartItems};
         dispatch(addCartItem({accessToken, cartData})).then((res) => {
            if (res.payload.ok) {
               dispatch(getCartByUserId({accessToken, userId}));
               setIsShowProductSelect(false);
               toast.success('Đã thêm sản phẩm vào giỏ hàng');
            } else {
               const message = res.payload.message;
               if (message == 'amount < quantity') {
                  toast.error('Sản phẩm đã hết hàng');
               }
               toast.error('Thêm sản phẩm thât bại, vui lòng thử lại sau!!!');
            }
            setIsShowLoading(false);
         });
      }
   }

   // reset color and size select
   useEffect(() => {
      if (!isShowProductSelect) {
         setColorSelect(null);
         setSizeSelect(null);
      }
   }, [isShowProductSelect]);

   useEffect(() => {
      if (productIsSelecting?.name !== product.name) {
         setIsShowProductSelect(false);
      }
   }, [productIsSelecting]);

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

            {/* product select size and color in pc mode */}
            {isShowProductSelect && (
               <div
                  className='fixed bottom-0 left-0 right-0 z-[500] 
                              md:absolute md:top-0 md:right-0 md:left-0 md:bottom-0 bg-black md:bg-opacity-80 md:px-2 md:rounded-md md:z-[1]'>
                  {/* product name for mobile display */}
                  {width < 600 && (
                     <div className='p-2 text-white border-b-[1px] flex justify-between'>
                        <p
                           className='cursor-pointer'
                           onClick={() => router.push(`/product/${stringToSlug(product.name)}`)}>
                           {uppercaseFirstLetter(productIsSelecting.name)}
                        </p>
                        <p className='cursor-pointer' onClick={() => setIsShowProductSelect(false)}>
                           x
                        </p>
                     </div>
                  )}

                  <ProductDetailSizeSelect
                     sizeID={product.sizeID}
                     sizeList={product.size}
                     sizeSelect={sizeSelect}
                     setSizeSelect={setSizeSelect}
                     smallSize={true}
                  />
                  {/* color select */}
                  <ProductDetailColorSelect
                     colorList={product.colorList}
                     setColorSelect={setColorSelect}
                     colorSelect={colorSelect}
                     smallSize={true}
                  />

                  {/* product item action */}
                  <div className='flex mt-3 gap-1 z-[120]'>
                     <button
                        className='w-[50%] text-white uppercase border-[1px] border-[#fff] hover:bg-black'
                        style={{paddingBottom: `${width < 600 ? '10px 0px' : '4px 0'}`}}
                        onClick={clickBuyNow}>
                        Buy now
                     </button>

                     <button
                        className='w-[50%] text-white uppercase border-[1px] border-[#fff] hover:bg-black'
                        style={{padding: `${width < 600 ? '10px 0px' : '4px 0'}`}}
                        onClick={clickAddToCart}>
                        Add to cart
                     </button>
                  </div>
               </div>
            )}
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
            {showPrice && (
               <>
                  {!isShowProductSelect ? (
                     <BsFillCartPlusFill
                        className='text-[1.4rem] text-gray-500 hover:text-[#891a1c] cursor-pointer'
                        onClick={handleClickAddToCart}
                     />
                  ) : (
                     <BsFillCartXFill
                        className='text-[1.4rem] text-gray-500 hover:text-[#891a1c] cursor-pointer'
                        onClick={() => setIsShowProductSelect(!isShowProductSelect)}
                     />
                  )}
               </>
            )}
         </div>

         {isShowLoading && <LoadingCocozzi color='grey' />}
      </div>
   );
}
