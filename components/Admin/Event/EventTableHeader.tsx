import React from 'react';

type Props = {
   isShow3Col?: boolean;
};

export default function EventTableHeader({isShow3Col = true}: Props) {
   return (
      <thead>
         <tr>
            <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs text-gray-700 uppercase tracking-wider'>
               <span className='font-extrabold'>Event Name</span>
            </th>

            <th className='px-5 py-3 border-b-2 w-[30%] border-gray-200 bg-gray-100 text-left text-xs text-gray-700 uppercase tracking-wider'>
               <span className='font-extrabold'>Image</span>
            </th>

            <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs text-gray-700 uppercase tracking-wider'>
               <span className='font-extrabold'>Link liên kết</span>
            </th>

            <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs text-gray-700 uppercase tracking-wider'>
               <span className='font-extrabold'>Status</span>
            </th>

            <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs text-gray-700 uppercase tracking-wider'>
               <span className='font-extrabold'>Ngày</span>
            </th>

            <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs text-gray-700 uppercase tracking-wider'></th>
         </tr>
      </thead>
   );
}
