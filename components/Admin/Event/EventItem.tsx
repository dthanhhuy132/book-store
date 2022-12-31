import {useState} from 'react';

import moment from 'moment';
import {AiTwotoneEdit} from 'react-icons/ai';
import {RiDeleteBin4Fill} from 'react-icons/ri';
import AdminModal from '../AdminModal';
import {AdminButton} from '../common';
import {useAppDispatch} from '../../../store';

import {deleteEventAsync, getAllEventAsync} from '../../../store/event/eventAsynAction';
import {toast} from 'react-toastify';
import LoadingActionPage from '../../common/LoadingPage';

import Cookies from 'js-cookie';
import {getLinkBannerPanel} from '../Home/getLinkHomePanel';
const accessToken = Cookies.get('accessToken');

export default function EventTableBody({eventItem, handleClickEditEvent, renderEventList}: any) {
   const dispatch = useAppDispatch();
   const [isShowModalDelete, setIsShowModalDelete] = useState(false);
   const [isShowLoading, setIsShowLoading] = useState(false);

   function handleDeleteEvent() {
      const eventId = eventItem._id;
      console.log(eventId);

      if (renderEventList.length === 1) {
         toast.warning('Không thể xóa Event duy nhất này -> Hãy cập nhật lại event');
         setIsShowModalDelete(false);
         return;
      }
      dispatch(deleteEventAsync({accessToken, eventId})).then((res) => {
         if (res.payload.ok) {
            dispatch(getAllEventAsync());
         } else {
            toast.error(res.payload.message);
         }
         setIsShowLoading(false);
         setIsShowModalDelete(false);
      });
   }

   return (
      <tr key={eventItem._id}>
         {/* name */}
         <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
            <span>{eventItem.title}</span>
         </td>
         {/* image */}
         <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-1'>
               {eventItem.images.map((img) => (
                  <img src={img} className='w-[200px]' key={img}></img>
               ))}
            </div>
         </td>

         {/* link liên kết */}
         <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
            <div className='grid grid-cols-1'>
               {getLinkBannerPanel(eventItem.description).map((eventLink, index) => (
                  <p className='' key={index}>
                     {eventLink}
                  </p>
               ))}
            </div>
         </td>

         {/* status */}
         <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
            <span className='relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight'>
               <span
                  aria-hidden
                  className='absolute inset-0 bg-green-400 opacity-50 rounded-full'
               />
               <span className='px-2'>{eventItem.status ? 'active' : 'disabled'}</span>
            </span>
         </td>

         {/* Date start and end */}
         <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm text-right'>
            <div className='flex flex-col items-start'>
               <span>{moment(eventItem.startDate).format('DD/MM/YYYY')}</span>
               <span>-</span>
               <span>{moment(eventItem.endDate).format('DD/MM/YYYY')}</span>
            </div>
         </td>

         {/* edit */}
         <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm text-right'>
            <div className='flex flex-col gap-2 justify-between mt-2'>
               <AdminButton
                  click={() => handleClickEditEvent(eventItem)}
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
         </td>
         {isShowModalDelete && (
            <AdminModal
               ok={handleDeleteEvent}
               cancel={() => setIsShowModalDelete(false)}
               title={`Bạn có muốn xóa Event: ${eventItem.title}`}></AdminModal>
         )}
         {isShowLoading && <LoadingActionPage />}
      </tr>
   );
}
