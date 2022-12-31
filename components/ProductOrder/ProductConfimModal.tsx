import {GrFormClose} from 'react-icons/gr';
import {MdOutlineDone} from 'react-icons/md';

export default function ProductConfirmModal({title = '', ok = () => {}, close = () => {}}) {
   return (
      <>
         <div className='fixed bg-black bg-opacity-75 inset-0 z-[49]'></div>
         <div className='absolute top-[100%] right-0 z-[200] bg-black bg-opacity-50 p-2 rounded-lg flex flex-col justify-center items-center'>
            <p className='text-white text-[0.9rem] mb-2 text-center'>{title}</p>
            <div className='flex gap-2'>
               <div
                  className='py-1 px-4 text-[1.5rem] bg-green-600 hover:bg-green-400 text-white rounded-lg cursor-pointer'
                  onClick={ok}>
                  <MdOutlineDone />
               </div>
               <div
                  className='py-1 px-4 text-[1.5rem] bg-red-600 hover:bg-red-400 text-white rounded-lg cursor-pointer'
                  onClick={close}>
                  <GrFormClose />
               </div>
            </div>
         </div>
      </>
   );
}
