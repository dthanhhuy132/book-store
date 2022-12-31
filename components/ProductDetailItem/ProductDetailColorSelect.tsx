import {useEffect} from 'react';

export default function ProductDetailColorSelect({
   colorList,
   colorSelect,
   setColorSelect,
   smallSize = false,
}) {
   useEffect(() => {}, []);
   return (
      <div className='flex items-center gap-1 px-3 md:px-0 mt-2 md:mt-5 pb-2 border-b-[1px] md:pb-5'>
         <p className={`${smallSize ? 'min-w-[50px] text-white' : 'min-w-[70px]'} `}>Color: </p>
         <div className={`flex flex-row items-center w-full ${smallSize ? 'gap-2' : 'gap-4'}`}>
            {colorList
               .toString()
               .split(',')
               .map((colorItem, index) => (
                  <div
                     key={index}
                     className={`cursor-pointer ${
                        smallSize ? 'w-[35px] h-[20px]' : 'w-[50px] h-[30px]'
                     }`}
                     style={{
                        backgroundColor: `${colorItem}`,
                        border: colorSelect === colorItem ? '2px solid red' : 'none',
                        padding: colorSelect === colorItem ? '5px' : 'none',
                     }}
                     onClick={() => setColorSelect(colorItem)}
                  />
               ))}
         </div>
      </div>
   );
}
