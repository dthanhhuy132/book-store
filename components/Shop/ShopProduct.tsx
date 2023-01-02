import {useMemo, useState} from 'react';
import useWindowDimensions from '../../hooks/UseWindowDimensions';
import InfiniteScroll from 'react-infinite-scroll-component';

import Masonry, {ResponsiveMasonry} from 'react-responsive-masonry';

import {ProductItem} from '../ProductItem';
import SkeletonBookLoading from './SkeletonBookLoading';
import productApi from '../../service/productApi';
import {useAppDispatch} from '../../store';
import {getProductAsync} from '../../store/product/productAsynAction';
import {toast} from 'react-toastify';
import {useRouter} from 'next/router';
export default function ShopProduct({productList}: any) {
   const dispatch = useAppDispatch();
   const router = useRouter();
   const [products, setProducts] = useState(productList);
   const [isHasMore, setIsHasMore] = useState(true);
   const [page, setPage] = useState(2);

   const [isShowLoading, setIsShowLoading] = useState(false);

   async function handleLoadMore() {
      setIsShowLoading(true);
      dispatch(getProductAsync({page})).then((res) => {
         if (res.payload.ok) {
            const data = res.payload.data;
            setIsShowLoading(false);

            setProducts((pre) => [...pre, ...data]);
            setPage((pre) => pre + 1);
         } else {
            setIsShowLoading(false);

            toast.info('Không còn sản phẩm mới');
            setIsHasMore(false);
         }
      });
   }

   return (
      <>
         {products?.length > 0 ? (
            <div>
               <ResponsiveMasonry columnsCountBreakPoints={{200: 2, 700: 3, 950: 4, 1200: 5}}>
                  <Masonry
                     className='my-masonry-grid'
                     columnClassName='my-masonry-grid_column'
                     gutter='30px 10px'>
                     {products?.map((product, index) => (
                        <ProductItem product={product} key={index}></ProductItem>
                     ))}

                     {isShowLoading && <SkeletonBookLoading />}
                     {isShowLoading && <SkeletonBookLoading />}
                     {isShowLoading && <SkeletonBookLoading />}
                     {isShowLoading && <SkeletonBookLoading />}
                     {isShowLoading && <SkeletonBookLoading />}
                  </Masonry>
               </ResponsiveMasonry>

               <div className='text-center mt-10'>
                  {router.pathname.indexOf('/category') < 0 && (
                     <button
                        disabled={!isHasMore}
                        className='bg-gray-300 px-10 py-2 rounded-full hover:bg-black hover:text-white font-bold disabled:bg-gray-200 disabled:text-gray-400 disabled:font-thin'
                        onClick={handleLoadMore}>
                        Load more
                     </button>
                  )}
               </div>
            </div>
         ) : (
            <></>
         )}
      </>
   );
}
