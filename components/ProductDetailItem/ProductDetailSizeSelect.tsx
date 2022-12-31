import React from 'react';

type Props = {};

export default function ProductDetailSizeSelect({
   sizeID,
   sizeList,
   sizeSelect,
   setSizeSelect,
   smallSize = false,
}) {
   const sizeMap = Object.keys(sizeList).map((sizeItem) => ({
      size: sizeItem,
      quantity: sizeList[sizeItem],
      sizeProductID: sizeID[sizeItem],
   }));

   return (
      <div className='flex items-center gap-1 px-3 md:px-0 md:pt-5 py-2 border-b-[1px] md:pb-5 border-t-[2px] md:border-t-[1px] border-t-[black] md:border-t-[gray]'>
         <p
            className={`${
               smallSize ? 'text-left min-w-[50px] text-white' : 'text-left min-w-[70px]'
            }`}>
            Size:
         </p>

         <div className={`flex w-full ${smallSize ? 'gap-2' : 'gap-4'}`}>
            {sizeMap.map((item, index) => (
               <div
                  key={index}
                  className={`uppercase text-center cursor-pointer border-[1px] p-1 block 
                  ${item.size === sizeSelect?.size && 'bg-[#891a1c] text-white'} 
                  ${smallSize ? 'w-[35px] py-0 text-white' : 'w-[50px]'} `}
                  onClick={() =>
                     setSizeSelect({size: item.size, sizeProductID: item.sizeProductID})
                  }>
                  {item.size}
               </div>
            ))}
         </div>
      </div>
   );
}
