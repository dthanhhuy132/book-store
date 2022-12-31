import React from 'react';

export default function ProductDescription({description = ''}) {
   function createMarkup() {
      return;
   }

   function MyComponent() {
      return;
   }

   return (
      <div className='my-2 mt-[40px] px-2 md:px-0 md:mt-7'>
         <div dangerouslySetInnerHTML={{__html: `${description}`}} />
      </div>
   );
}
