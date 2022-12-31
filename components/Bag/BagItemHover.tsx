import FormatPrice from '../../helper/FormatPrice';

export default function BagItemHover({productCart}) {
   return (
      <div className='flex justify-between gap-2'>
         <div className='flex gap-1'>
            <img
               src={productCart?.product?.pictures[0]}
               alt='hinh anh'
               className='w-[50px] md:w-[70px] object-contain rounded-md'
            />
            <div className='capitalize text-[0.85rem]'>
               <p className='font-bold'>{productCart?.product?.name}</p>
               <p className='lowercase'>x {productCart?.product?.quantity}</p>
            </div>
         </div>
         <div className='mr-2'>
            <FormatPrice price={productCart?.product?.price} />
         </div>
      </div>
   );
}
