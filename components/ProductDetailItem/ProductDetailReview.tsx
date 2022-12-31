import Image from 'next/image';
import startImg from '../../public/images/star.png';

const customerSatisfied = [
   {name: 'Very Good', reivews: 36, amount: 6},
   {name: 'Good', reivews: 12, amount: 12},
   {name: 'Normal', reivews: 2, amount: 21},
   {name: 'Bad', reivews: 1, amount: 19},
   {name: 'Too Bad', reivews: 2, amount: 2},
];

export default function ProductDetailReview() {
   return (
      <div className='relative z-1 my-10 md:my-20'>
         <p className='px-2 md:px-[unset] uppercase text-[1.4rem] font-bold border-b-[1px] border-black'>
            Reviews <span>(20)</span>
         </p>

         <div className='flex flex-col my-0 py-0 md:flex-row md:gap-10 md:my-7'>
            {/* Total review */}
            <div className='flex flex-col pb-5 items-center justify-center md:w-1/3 md:border-r-[1px] '>
               <div className='flex items-center justify-center gap-3 '>
                  <Image
                     src={startImg}
                     height='60px'
                     width='60px'
                     objectFit='contain'
                  />
                  <p className='font-bold text-[4rem]'>4.6</p>
               </div>
               <p>
                  <span className='font-bold'>100%</span> Customer like this
                  product
               </p>
            </div>
            <div className='md:w-2/3 px-2 flex flex-col justify-center'>
               {customerSatisfied.map((item, index) => {
                  const percent = (item.reivews / 40) * 100;
                  return (
                     <div key={index} className='flex items-center gap-3'>
                        <p className='whitespace-nowrap min-w-[80px]'>
                           {item.name}
                        </p>
                        {/* Thanh hài lòng của khách hàng */}
                        <div className='relative w-full bg-[#ebeff5] h-[14px] rounded-lg'>
                           <div
                              className={`absolute top-0 left-0 bottom-0 bg-black rounded-lg`}
                              style={{width: `${percent}%`}}></div>
                        </div>
                        <p className='min-w-[20px]'>{item.reivews}</p>
                     </div>
                  );
               })}
            </div>
            {/* Detail review */}
         </div>

         {/* Comment */}
      </div>
   );
}
