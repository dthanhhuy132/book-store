import {MdFiberNew} from 'react-icons/md';
import {GiConfirmed, GiCancel} from 'react-icons/gi';

export default function OrderTab({paymentType = 'await', setPaymentType, small = false}) {
   const tabOrder = [
      {
         name: 'Đang chờ',
         icon: MdFiberNew,
         status: 'await',
      },
      {
         name: 'Đã xác nhận',
         icon: GiConfirmed,
         status: 'success',
      },

      {
         name: 'Đã hủy',
         icon: GiCancel,
         status: 'cancel',
      },
   ];

   return (
      <div className='border-b border-gray-200 dark:border-gray-700'>
         <ul className='flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400'>
            {tabOrder.map((tab) => {
               // login
               const active = paymentType === tab.status;
               return (
                  <li
                     className={`mr-2 flex items-center gap-1 ${
                        small ? 'text-[1rem] px-2 py-3' : 'text-[1.1rem] px-2 py-4'
                     }  ${active ? 'text-white rounded-t-lg  bg-[#891a1c]' : ''}`}
                     key={tab.status}
                     onClick={(e) => {
                        e.preventDefault();
                        setPaymentType(tab.status);
                     }}>
                     <tab.icon />
                     <a href='#' className='' aria-current='page'>
                        {tab.name}
                     </a>
                  </li>
               );
            })}
         </ul>
      </div>
   );
}
