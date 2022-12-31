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
import LoadingCocozzi from '../../components/common/LoadingCocozzi';
import NotFound from '../../components/NotFound';

export default function ProductDetailPage({productListByName}: any) {
   const accessToken = Cookies.get('accessToken');
   const userInfo = parseJwt(accessToken)?.data;

   const dispatch = useAppDispatch();
   const router = useRouter();

   const productName = router.query.productId as string;
   const productSlug = productName.split('-').slice(0, -1).join('-');

   const [productDetail, setProductDetail] = useState(
      productListByName?.filter(
         (product) => stringToSlug(product.name).split('-').slice(0, -1).join('-') == productSlug
      )[0]
   );

   const {isMobile} = useWindowDimensions();
   const [isMobileScreen, setIsMobileScreen] = useState(false);

   // size and color selection
   const [sizeSelect, setSizeSelect] = useState(null);
   const [colorSelect, setColorSelect] = useState(null);

   const [isShowLoading, setIsShowLoading] = useState(false);

   const [isShowSizeAndColor, setIsShowSizeAndColor] = useState(false);
   const [isShowProductSelect, setIsShowProductSelect] = useState(false);
   // -------------------------------------------> BUY NOW
   function clickBuyNow() {
      if (!accessToken) {
         toast.warning('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
         router.push('/membership');
      } else if (!colorSelect || !sizeSelect) {
         toast.warning('Vui lòng chọn "MÀU SẮC" và "SIZE" sản phẩm');
      } else {
         // name, picture, productId,
         // const {name, pictures, price, productId} = product;
         const productPayment = {
            name: productDetail.name,
            pictures: productDetail.pictures,
            price: productDetail.price,
            colorSelect: colorSelect,
            size: sizeSelect.size,
            prodcutId: sizeSelect.sizeProductID,
            quantity: 1,
         };

         router.push({pathname: '/payment', query: productPayment});
         setIsShowProductSelect(false);
      }
   }
   // -------------------------------------------> ADD TO CART

   function clickAddToCart() {
      if (!accessToken) {
         toast.warning('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
         router.push('/membership');
      } else if (!colorSelect || !sizeSelect) {
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

   // product Information
   const imagesArr = productDetail?.pictures.slice(1, productDetail?.pictures.length);

   return (
      <>
         {productDetail ? (
            <div className='md:px-20 md:w-[780px] lg:w-[1200px] mx-[auto]'>
               {/* product image */}
               <div className='flex flex-col-reverse mt-2 md:flex-row md:mt-5 '>
                  <div className='hidden md:grid grid-cols-2 gap-1 md:w-2/3 '>
                     {/* video clip */}
                     {/* <video autoPlay muted loop className='w-full'>
               <source src='/videos/product.mp4' type='video/mp4' />
            </video> */}

                     {imagesArr?.map((img, index) => (
                        <div className='relative' key={index}>
                           <img src={img} className='w-full h-auto' alt={img} />
                        </div>
                     ))}
                  </div>

                  <div className='md:hidden'>
                     <SliderSlick {...settings}>
                        {imagesArr?.map((img, index) => (
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
                              <span className='font-semibold text-[1.2rem] mr-2'>
                                 <FormatPrice price={productDetail.price} />
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

                        <div className='fixed bottom-0 right-0 left-0 md:relative md:mx-0 md:bg-transparent text-black md:text-black z-[101] '>
                           <div
                              className={`absolute bg-white md:bg-transparent w-full md:relative md:bottom-[unset] md:opacity-100 transition-all ${
                                 isShowSizeAndColor ? 'bottom-[100%]' : 'bottom-[-500%] '
                              }`}>
                              {/* size select */}
                              <ProductDetailSizeSelect
                                 sizeID={productDetail.sizeID}
                                 sizeList={productDetail.size}
                                 sizeSelect={sizeSelect}
                                 setSizeSelect={setSizeSelect}
                              />
                              {/* color select */}
                              <ProductDetailColorSelect
                                 colorList={productDetail.colorList}
                                 setColorSelect={setColorSelect}
                                 colorSelect={colorSelect}
                              />
                           </div>

                           {/* buy button */}
                           <div className='flex md:mt-3 md:gap-1 relative z-[120] font-[900] text-white md:text-black'>
                              <button
                                 className='w-[50%] py-2 uppercase bg-black md:bg-[transparent] md:border-[1px] hover:text-white md:hover:bg-black border-r-[1px] border-[#fff] md:border-black'
                                 onClick={() => {
                                    clickBuyNow();
                                    isMobile && setIsShowSizeAndColor(!isShowSizeAndColor);
                                 }}>
                                 Buy now
                              </button>

                              <button
                                 className='w-[50%] py-2 uppercase bg-black md:bg-[transparent] md:border-[1px] border-black md:hover:text-white md:hover:bg-black'
                                 onClick={() => {
                                    clickAddToCart();
                                    isMobile && setIsShowSizeAndColor(!isShowSizeAndColor);
                                 }}>
                                 Add to cart
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               <div className='w-2/3'>
                  {!isMobileScreen && (
                     <ProductDescription
                        description={productDetail.description}></ProductDescription>
                  )}
               </div>

               {isShowLoading && <LoadingCocozzi />}
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
