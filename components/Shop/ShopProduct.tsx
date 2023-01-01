import {useMemo} from 'react';

import useWindowDimensions from '../../hooks/UseWindowDimensions';

import Masonry, {ResponsiveMasonry} from 'react-responsive-masonry';

import {ProductItem} from '../ProductItem';

export default function ShopProduct({productListByName}: any) {
   const {isMobile, width} = useWindowDimensions();

   return (
      <>
         <ResponsiveMasonry columnsCountBreakPoints={{200: 2, 700: 3, 1000: 4}}>
            <Masonry
               className='my-masonry-grid'
               columnClassName='my-masonry-grid_column'
               gutter='30px 10px'>
               {productListByName.map((product, index) => (
                  <ProductItem product={product} key={index}></ProductItem>
               ))}
            </Masonry>
         </ResponsiveMasonry>
      </>
   );
}
