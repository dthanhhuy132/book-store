import React from 'react';

const paymentLogo = [
   '/images/logoPayment/momo.png',
   '/images/logoPayment/cod.jpg',
   '/images/logoPayment/bank.jpg',
];
export default function ProductDetailPaymentMethod() {
   return (
      <div className='flex flex-row justify-center gap-4 mt-2 mb-2 md:justify-start md:mt-7'>
         {paymentLogo.map((item, index) => (
            <img src={item} key={index} className='w-[full] h-[30px]' />
         ))}
      </div>
   );
}
