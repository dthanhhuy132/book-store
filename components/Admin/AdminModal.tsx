interface IAdminModal {
   children?: any;
   ok?: () => void;
   cancel?: () => void;
   title?: string;
   className?: string;
   showFooter?: boolean;
}

export default function AdminModal({
   children,
   ok = () => {},
   cancel = () => {},
   title = '',
   className = '',
   showFooter = true,
}: IAdminModal) {
   return (
      <>
         <div className='fixed inset-0 bg-black opacity-80 z-[9]'></div>
         <div
            className={`fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-[99] min-w-[600px] min-h-[100px] max-h-[80vh] overflow-auto bg-white rounded-lg px-2 ${className}`}>
            {/* hedaer */}
            <div className='flex justify-between border-b-2 mb-2 py-2 '>
               <p className='font-bold'>{title}</p>
               <p
                  onClick={cancel}
                  className='text-[1.2rem] font-extrabold text-gray-400 hover:text-red-700 cursor-pointer'>
                  x
               </p>
            </div>
            {/* content */}
            {children}

            {/* footer */}
            {showFooter && (
               <div className='flex gap-2 justify-center my-2 border-t-2 pt-2'>
                  <button
                     className='bg-black hover:bg-[green] min-w-[100px] py-2 rounded-lg text-white'
                     onClick={ok}>
                     ok
                  </button>
                  <button
                     className='hover:bg-[#891a1c] bg-black min-w-[100px] py-2 rounded-lg text-white'
                     onClick={cancel}>
                     cancel
                  </button>
               </div>
            )}
         </div>
      </>
   );
}
