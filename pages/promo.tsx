import {useMemo, useState} from 'react';
import handleCategoryDescription from '../components/Admin/common/handleCategoryDescription';
import {LoadingPage} from '../components/LoadingPage';
import {Logo} from '../components/Logo';
import NotFound from '../components/NotFound';
import categoryApi from '../service/categoryApi';
import {useAppSelector} from '../store';

export default function PromoPage({promoList}) {
   console.log('promoList', promoList);

   return (
      <>
         <NotFound title='Promo đang cập nhật' navigateLink='/shop' navigateText='GO TO SHOP' />
         {/* <div className='grid grid-cols-2 md:grid-cols-3 gap-10 mt-5 mx-1 md:mx-[10%]'>
            {promoList.map((promo, index) => (
               <div className='' key={index}>
                  <img
                     src={promo.categoryImage[0]}
                     alt='Promo image'
                     className='w-full min-h-[200px] object-cover'
                  />
                  <div className='p-1'>
                     <p className='font-bold'># {promo.name}</p>
                     <p>{handleCategoryDescription(promo.description)}</p>
                  </div>
               </div>
            ))}
         </div>

         <LoadingPage>
            <Logo />
            <div>Chương trình hấp dẫn</div>
         </LoadingPage> */}
      </>
   );
}

export const getServerSideProps = async () => {
   let categoryRes;

   try {
      categoryRes = await categoryApi.getAllCategory();
   } catch (error) {}

   const categoryList = categoryRes?.data?.data.filter(
      (cate) => cate.status == true && cate?.description?.indexOf('-category-for-promo') >= 0
   );

   return {
      props: {
         ok: true,
         promoList: categoryList || [],
      },
   };
};
