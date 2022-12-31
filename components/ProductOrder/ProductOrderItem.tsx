import FormatPrice from '../../helper/FormatPrice';
import uppercaseFirstLetter from '../../helper/uppercaseFirstLetter';

export default function ProductOrderItem({productOrder}) {
   return (
      <div className='flex gap-3 items-start justify-between'>
         {/* name */}

         <div className='flex items-start gap-3'>
            <img src={productOrder?.product.pictures[0]} alt='' className='w-[80px] rounded-md' />
            <div>
               <p className='font-semibold max-w-[120px]'>
                  {uppercaseFirstLetter(productOrder?.product.name)}
               </p>
               {/* size, màu sắc */}
               <div className='flex gap-5'>
                  <span>
                     <span className='font-bold'>Size:</span> {productOrder?.product.size}
                  </span>
                  <div className='flex gap-2'>
                     <span className='font-bold'>Color:</span>
                     <div
                        className='w-[40px] h-[20px] border-[1px] border-gray-500'
                        style={{
                           backgroundColor: `${productOrder?.productSelectColor}`,
                        }}></div>
                  </div>
               </div>
            </div>
         </div>

         <div className='flex flex-col items-end'>
            <p className='font-bold'>
               <FormatPrice price={productOrder?.product.price} />
            </p>
            <p className='font-bold'>x{productOrder?.product.quantity}</p>
         </div>
      </div>
   );
}
