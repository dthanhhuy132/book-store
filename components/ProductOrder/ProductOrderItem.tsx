import {useRouter} from 'next/router';
import FormatPrice from '../../helper/FormatPrice';
import stringToSlug from '../../helper/stringToSlug';
import uppercaseFirstLetter from '../../helper/uppercaseFirstLetter';

export default function ProductOrderItem({productOrder}) {
   const router = useRouter();
   return (
      <div className='flex gap-3 items-start justify-between'>
         {/* name */}

         <div className='flex items-start gap-3'>
            <img
               src={productOrder?.product.pictures[0]}
               alt=''
               className='w-[80px] rounded-md cursor-pointer'
               onClick={() => router.push(`/product/${stringToSlug(productOrder?.product.name)}`)}
            />
            <div>
               <p className='font-semibold max-w-[200px]'>
                  {uppercaseFirstLetter(productOrder?.product.name)}
               </p>
            </div>
         </div>

         <div className='flex flex-col items-end'>
            <p className='font-bold'>
               <FormatPrice price={productOrder?.product.price} fontSize='1.1rem' />
            </p>
            <p className='font-bold'>x{productOrder?.product.quantity}</p>
         </div>
      </div>
   );
}
