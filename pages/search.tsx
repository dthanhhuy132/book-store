import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';

import {GetStaticProps, GetStaticPaths, GetServerSideProps} from 'next';
import {ProductItem} from '../components/ProductItem';
import productApi from '../service/productApi';
import filterProductActive from '../helper/filterProductActive';

export default function SearchPage({listSearchProduct}: any) {
   const router = useRouter();
   const searchStr = router.query.q;

   useEffect(() => {
      if (!searchStr) {
         router.push('/');
      }
   }, [searchStr]);

   return (
      <div className='max-w-[1200px] flex items-center flex-col mx-[auto] my-10'>
         <p className='mb-5'>
            Đã tìm thấy <span className='font-bold'>{listSearchProduct.length}</span> sản phẩm với
            từ khoá
            <span className='font-semibold'> {searchStr}</span>
         </p>
         <div className='px-1 md:px-0 grid grid-cols-2 md:grid-cols-4 gap-x-2 gap-y-5'>
            {listSearchProduct.map((product, index) => (
               <ProductItem product={product} key={index}></ProductItem>
            ))}
         </div>
      </div>
   );
}

export const getServerSideProps: GetServerSideProps<any> = async (context) => {
   const searchStr = context.query.q || '';

   let searchProductListFinal;

   try {
      const searchProductRes = await productApi.searchProduct(searchStr);
      const allProductByGroupRes = await productApi.getAllProductByName();

      let searchProductList = searchProductRes?.data?.data;
      let allProductByGroupName = allProductByGroupRes?.data?.data;

      const activeProductGroup = filterProductActive(allProductByGroupName);

      searchProductList = searchProductList
         .map((item) => item.name)
         .filter((value, index, self) => self.indexOf(value) === index);

      searchProductListFinal = searchProductList
         .map((searchProduct) =>
            activeProductGroup.filter((productGroup) => productGroup?.name == searchProduct)
         )
         .filter((product) => product.length > 0)
         .map((product) => product[0]);
   } catch (error) {}

   return {
      props: {
         error: true,
         listSearchProduct: searchProductListFinal || [],
      },
   };
};
