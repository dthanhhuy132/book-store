import Image from 'next/image';
import {useEffect, useRef, useState} from 'react';
import {BsShare} from 'react-icons/bs';

import {
   ProductDescription,
   ProductDetailColorSelect,
   ProductDetailSizeSelect,
} from '../../components/ProductDetailItem';

import SliderSlick from 'react-slick';
import useWindowDimensions from '../../hooks/UseWindowDimensions';
import slickSliderMobile from '../../helper/slickSliderMobile';
import {useRouter} from 'next/router';
import Cookies from 'js-cookie';

import {useAppDispatch, useAppSelector} from '../../store';
import stringToSlug from '../../helper/stringToSlug';
import filterProductActive from '../../helper/filterProductActive';
import productApi from '../../service/productApi';
import FormatPrice from '../../helper/FormatPrice';
import converFirstLetterToUpperCase from '../../helper/converFirstLetterToUpperCase';
import {toast} from 'react-toastify';
import {parseJwt} from '../../helper';
import {addCartItem, getCartByUserId} from '../../store/cart/cartAsynAction';
import LoadingBook365 from '../../components/common/LoadingBook365';
import NotFound from '../../components/NotFound';
import {InputQuantity} from '../../components/Bag';
import categoryApi from '../../service/categoryApi';
import {getCategoryById} from '../../store/categoryPromo/categoryAsynAcion';
import RenderCategoryItem from '../../components/ProductDetailItem/RenderCategoryItem';

export default function ProductDetailPage({productListByName}: any) {
   const accessToken = Cookies.get('accessToken');
   const userInfo = parseJwt(accessToken)?.data;

   const dispatch = useAppDispatch();
   const router = useRouter();

   const productName = router.query.productId as string;
   const productSlug = productName.split('-').slice(0, -1).join('-');

   // render to UI prop

   const [categoryName, setCategoryName] = useState('');
   const [productDetail, setProductDetail] = useState(
      productListByName?.filter(
         (product) => stringToSlug(product.name).split('-').slice(0, -1).join('-') == productSlug
      )[0]
   );

   const {isMobile} = useWindowDimensions();
   const [isMobileScreen, setIsMobileScreen] = useState(false);

   // size and color selection
   const [chooseQuantity, setChooseQuantity] = useState(1);
   const [isShowLoading, setIsShowLoading] = useState(false);

   const [isShowSizeAndColor, setIsShowSizeAndColor] = useState(false);
   // -------------------------------------------> BUY NOW
   function clickBuyNow() {
      if (!accessToken) {
         toast.warning('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
         router.push('/membership');
      } else {
         // name, picture, productId,
         // const {name, pictures, price, productId} = product;
         const productPayment = {
            name: productDetail.name,
            pictures: productDetail.pictures,
            price: productDetail.price,
            colorSelect: 'ML',
            size: '#fff',
            prodcutId: productDetail?.productID[0],
            quantity: chooseQuantity,
         };

         console.log('cartData cho nay la gi', productPayment);

         router.push({pathname: '/payment', query: productPayment});
      }
   }
   // -------------------------------------------> ADD TO CART

   function clickAddToCart() {
      if (!accessToken) {
         toast.warning('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
         router.push('/membership');
      } else {
         setIsShowLoading(true);

         const userId = userInfo._id;
         const cartItems = {
            productId: productDetail.productID[0],
            quantity: chooseQuantity,
            productSelectColor: '#fff',
         };
         const cartData = {userId, cartItems};
         dispatch(addCartItem({accessToken, cartData})).then((res) => {
            if (res.payload.ok) {
               dispatch(getCartByUserId({accessToken, userId})).then((res) => {
                  if (res.payload.ok) {
                     toast.success('Đã thêm sản phẩm vào giỏ hàng');
                     setIsShowLoading(false);
                  }
               });
            } else {
               const message = res.payload.message;
               if (message == 'amount < quantity') {
                  toast.error('Sản phẩm đã hết hàng');
               }
               setIsShowLoading(false);
               toast.error('Thêm sản phẩm thât bại, vui lòng thử lại sau!!!');
            }
         });
      }
   }

   //   product slide setting in mobile mode
   const settings = {
      className: 'center w-full',
      infinite: true,
      dots: true,
      slidesToShow: 1,
      swipeToSlide: true,
      autoplay: true,
      autoplaySpeed: 2000,
      customPaging: function (i) {
         return <div className='dot'></div>;
      },
      dotsClass: 'slick-dots slick-thumb-custom',
      prevArrow: false,
      nextArrow: false,
      scrollBar: true,
      beforeChange: () => slickSliderMobile(),
   };

   // create first width for active slider
   useEffect(() => {
      if (isMobile) {
         setIsMobileScreen(true);
      } else {
         setIsMobileScreen(false);
      }
   }, [isMobile]);

   // get categoryName
   useEffect(() => {
      if (productDetail) {
         const categoryId = productDetail?.categoryId;

         dispatch(getCategoryById({categoryId})).then((res) => {
            if (res.payload.ok) {
               const category = res.payload.data;
               setCategoryName(category.name);
            }
         });
      }
   }, [productDetail]);

   return (
      <>
         {productDetail ? (
            <div className='md:px-20 md:w-[780px] lg:w-[1200px] mx-[auto]'>
               {/* product image */}
               <div className='flex flex-col-reverse mt-2 md:flex-row md:mt-5 '>
                  <div className='md:w-2/3 '>
                     <div className='hidden md:grid grid-cols-2 gap-1'>
                        {productDetail?.pictures?.map((img, index) => (
                           <div className='relative' key={index}>
                              <img src={img} className='w-full h-auto' alt={img} />
                           </div>
                        ))}
                     </div>

                     <div>
                        {!isMobileScreen && (
                           <ProductDescription
                              description={productDetail.description}></ProductDescription>
                        )}
                     </div>
                  </div>

                  {/* slider for mobild */}
                  <div className='md:hidden'>
                     <SliderSlick {...settings}>
                        {productDetail?.pictures?.map((img, index) => (
                           <div className='relative' key={index}>
                              <img src={img} className='w-full h-auto' alt={img} />
                           </div>
                        ))}
                     </SliderSlick>
                     <ProductDescription
                        description={productDetail?.description}></ProductDescription>
                  </div>
                  {/* product info */}
                  <div className='w-full md:pl-5 md:top-2 md:w-[350px]'>
                     {/* product name */}
                     <div className='px-2 md:px-0 md:sticky top-20'>
                        <p className='pb-0 md:pb-5 font-semibold text-[1.2rem]'>
                           {converFirstLetterToUpperCase(productDetail?.name)}
                        </p>

                        {/* price */}
                        <div className='mt-2 pb-2 md:pb-5 flex justify-between items-center border-b-[1px]'>
                           <div className='flex items-end'>
                              <span className='font-semibold mr-2'>
                                 <FormatPrice price={productDetail.price} fontSize='1.2rem' />
                              </span>
                              <span className='line-through text-gray-500 text-[0.9rem] mb-[2px]'>
                                 {(
                                    productDetail.price +
                                    (productDetail.price * 10) / 100
                                 ).toLocaleString()}
                                 VNĐ
                              </span>

                              <span className='text-[#891a1c] font-semibold text-[0.9rem] ml-2 mb-[2px]'>
                                 10%
                              </span>
                           </div>
                           <BsShare
                              fontSize='1.3rem'
                              cursor='pointer'
                              className='hover:text-[#891a1c]'
                           />
                        </div>

                        {/* category Name */}
                        <div className='block md:hidden mb-5'>
                           <p className='mb-2 mt-5'>Phân loại:</p>
                           <RenderCategoryItem categoryName={categoryName} small />
                        </div>

                        <div className='fixed bottom-0 right-0 left-0 md:relative md:mx-0 md:bg-transparent text-black md:text-black z-[101] '>
                           <div
                              className={`absolute border-t-[1px] md:border-unset py-3 px-2 md:p-0 bg-white md:bg-transparent w-full md:relative md:bottom-[unset] md:opacity-100 transition-all ${
                                 isShowSizeAndColor ? 'bottom-[100%]' : 'bottom-[-500%] '
                              }`}>
                              <div className='mt-2 flex gap-3 items-center'>
                                 <p className='w-[100px]'>Số lượng:</p>
                                 <div className='flex-1'>
                                    <InputQuantity
                                       min={1}
                                       max={10}
                                       value={1}
                                       setProductCartQuantity={setChooseQuantity}
                                    />
                                 </div>
                              </div>
                           </div>

                           {/* buy button */}
                           <div className='flex md:mt-3 md:gap-1 relative z-[120] font-[900] text-white md:text-black'>
                              <button
                                 className='w-[50%] py-3 uppercase bg-black md:bg-[transparent] md:border-[1px] hover:text-white md:hover:bg-black border-r-[1px] border-[#fff] md:border-black'
                                 onClick={() => {
                                    if (isMobile) {
                                       if (isShowSizeAndColor) {
                                          clickBuyNow();
                                          setIsShowSizeAndColor(false);
                                       } else {
                                          setIsShowSizeAndColor(true);
                                       }
                                    } else {
                                       clickBuyNow();
                                    }
                                 }}>
                                 Buy now
                              </button>

                              <button
                                 className='w-[50%] py-3 uppercase bg-black md:bg-[transparent] md:border-[1px] border-black md:hover:text-white md:hover:bg-black'
                                 onClick={() => {
                                    if (isMobile) {
                                       if (isShowSizeAndColor) {
                                          clickAddToCart();
                                          setIsShowSizeAndColor(false);
                                       } else {
                                          setIsShowSizeAndColor(true);
                                       }
                                       setIsShowSizeAndColor(!isShowSizeAndColor);
                                    } else {
                                       clickAddToCart();
                                    }
                                 }}>
                                 Add to cart
                              </button>
                           </div>

                           {/* category Name */}
                           <div className='hidden md:block'>
                              <p className='mb-2 mt-5'>Phân loại:</p>
                              <RenderCategoryItem categoryName={categoryName} small />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {isShowLoading && <LoadingBook365 color='black' />}
            </div>
         ) : (
            <NotFound
               title='Sản phẩm không tồn tại'
               navigateLink='/shop'
               navigateText='GO TO SHOP'
            />
         )}
      </>
   );
}

export const getServerSideProps = async () => {
   let productRes;
   try {
      productRes = await productApi.getAllProductByName();
   } catch (error) {}

   const productListByName = productRes?.data?.data;
   const activeProduct = filterProductActive(productListByName);

   return {
      props: {
         productListByName: activeProduct || [],
      },
   };
};
