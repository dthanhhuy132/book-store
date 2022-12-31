import React from 'react';

type Props = {
   isShow3Col?: boolean;
};

export default function CategoryTableHeader({isShow3Col = true}: Props) {
   return (
      <thead>
         <tr>
            <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs text-gray-700 uppercase tracking-wider'>
               <span className='font-extrabold'>Event Name</span>
            </th>

            {isShow3Col && (
               <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs text-gray-700 uppercase tracking-wider'></th>
            )}
         </tr>
      </thead>
   );
}
