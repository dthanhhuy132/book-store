import {useState} from 'react';
import {AiTwotoneEdit} from 'react-icons/ai';
import {RiDeleteBin4Fill} from 'react-icons/ri';
import AdminModal from '../AdminModal';
import {AdminButton} from '../common';
import handleCategoryDescription from '../common/handleCategoryDescription';

export default function PromoAdminItem({promo, eventList}: any) {
   console.log('promo item la gi', promo);
   const [isShowModalDelete, setIsShowModalDelete] = useState(false);
   function handleClickEditPromo(promo) {}

   function handleDeletePromo() {}
   return (
      <div className='border-[1px] p-1 flex flex-col justify-between'>
         <div>
            <img
               src={promo.categoryImage[0]}
               className='h-[300px] w-full object-cover'
               alt='Promo img'
            />
            <p className='font-bold'>Name: {promo.name}</p>
            <p className='italic'>Description: {handleCategoryDescription(promo?.description)}</p>

            {/* render event for promo */}
            <div>
               <div className='font-bold'>Event: </div>
               {promo.event.map((eventItem, index) => (
                  <p key={index}>- {eventItem?.eventId?.title}</p>
               ))}
            </div>
         </div>
         <div>
            <div className='flex justify-between mt-2'>
               <AdminButton
                  click={() => handleClickEditPromo(promo)}
                  className='py-[4px] w-[80px] flex justify-center'>
                  <AiTwotoneEdit fontSize='1rem' />
                  Edit
               </AdminButton>
               <AdminButton
                  click={() => setIsShowModalDelete(true)}
                  type='delete'
                  className='py-[4px] w-[80px] flex justify-center'>
                  <RiDeleteBin4Fill fontSize='1.5rem' />
                  Delete
               </AdminButton>

               {/* modal delete confirm */}
            </div>
         </div>
         {isShowModalDelete && (
            <AdminModal
               ok={handleDeletePromo}
               cancel={() => setIsShowModalDelete(false)}
               title={`Bạn có muốn xóa sản phẩm: ${promo.name}`}></AdminModal>
         )}
      </div>
   );
}
