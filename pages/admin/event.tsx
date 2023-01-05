import {useState, useEffect} from 'react';

import {AdminLayout, AdminModal} from '../../components/Admin';
import {CategoryTableHeader} from '../../components/Admin/Category';
import {EventTableHeader} from '../../components/Admin/Event';
import eventApi from '../../service/eventApi';
import {useAppSelector} from '../../store';

import {AiOutlinePlusCircle} from 'react-icons/ai';
import {AdminButton} from '../../components/Admin/common';
import ModalCreateEvent from '../../components/Admin/Event/ModalCreateEvent';
import moment from 'moment';
import {useDispatch} from 'react-redux';
import {
   createEventAsyns,
   getAllEventAsync,
   udpateEvetAsync,
} from '../../store/event/eventAsynAction';
import LoadingActionPage from '../../components/common/LoadingPage';
import EventItem from '../../components/Admin/Event/EventItem';

import {toast} from 'react-toastify';
import Cookies from 'js-cookie';
import {EVENT_FOR_EVENT} from '../../store/event/eventSlice';
const accessToken = Cookies.get('accessToken');

export default function AdminEventPage({eventList}) {
   const dispatch = useDispatch();
   const {eventState} = useAppSelector((state) => state.event);

   const [isShowLoading, setIsShowLoading] = useState(false);

   const [isShowModalCreateUpdateEvent, setIsShowModalCreateUpdateEvent] = useState(false);
   const [editingEvent, setEditingEvent] = useState(null);

   const [renderEventList, setRenderEventList] = useState(eventList);

   // handle create new event
   function handleCreateUpdateEvent(event) {
      setIsShowLoading(true);
      const {
         title,
         description,
         startDate,
         endDate,
         status,
         percent,
         typeEvent,
         images,
         id: eventId,
         isChangeImage,
      } = event;

      if (eventId) {
         // xóa id rồi cập nhật
         // 1. cập nhật có hình
         // 2. cập nhật không hình

         if (isChangeImage) {
            const data = new FormData();
            data.append('title', title);
            data.append('description', `[${description}]`);
            data.append('startDate', startDate);
            data.append('endDate', endDate);
            data.append('percent', percent);
            data.append('typeEvent', EVENT_FOR_EVENT);
            images.forEach((imageFile) => {
               data.append('images', imageFile);
            });

            dispatch(udpateEvetAsync({accessToken, eventId, data})).then((res) => {
               if (res.payload.ok) {
                  dispatch(getAllEventAsync());
                  setIsShowModalCreateUpdateEvent(false);
                  setIsShowLoading(false);
               } else {
                  toast.error(res.payload.message);
                  setIsShowLoading(false);
               }
            });
         } else {
            // is not change image
            const data = {
               title,
               description,
               startDate,
               endDate,
               percent,
               typeEvent: EVENT_FOR_EVENT,
            };
            console.log('typeEvent', data);
            dispatch(udpateEvetAsync({accessToken, eventId, data})).then((res) => {
               if (res.payload.ok) {
                  dispatch(getAllEventAsync());
                  setIsShowModalCreateUpdateEvent(false);
                  setIsShowLoading(false);
               } else {
                  toast.error(res.payload.messsage);
                  setIsShowLoading(false);
               }
            });
         }
      }
      if (!eventId) {
         // change event -> need to send new formData to BE
         const formData = new FormData();
         formData.append('title', title);
         formData.append('description', description);
         formData.append('startDate', startDate);
         formData.append('endDate', endDate);
         formData.append('percent', percent);
         formData.append('typeEvent', EVENT_FOR_EVENT);

         images.forEach((imageFile) => {
            formData.append('images', imageFile);
         });

         // ---------------------------->
         dispatch(createEventAsyns({accessToken, formData})).then((res) => {
            if (res.payload.ok) {
               dispatch(getAllEventAsync());
               setIsShowModalCreateUpdateEvent(false);
            } else {
               toast.error(res.payload.message);
            }
            setIsShowLoading(false);
         });
      }
   }

   // function handle edit event
   function handleClickEditEvent(editEvent) {
      setIsShowModalCreateUpdateEvent(true);
      setEditingEvent(editEvent);
   }

   // reset Editting Event
   useEffect(() => {
      if (!isShowModalCreateUpdateEvent) {
         setEditingEvent(null);
      }
   }, [isShowModalCreateUpdateEvent]);

   // update render event list
   useEffect(() => {
      if (eventState || eventState?.length > 0) {
         setRenderEventList(eventState);
      }
   }, [eventState]);

   return (
      <AdminLayout>
         <div className='container w-full px-8'>
            <div className='flex gap-10 items-center'>
               <h2 className='text-2xl font-semibold'>Event list</h2>
               <AdminButton click={() => setIsShowModalCreateUpdateEvent(true)}>
                  <AiOutlinePlusCircle /> Create new Event
               </AdminButton>
            </div>
            <div className='-mx-4 sm:-mx-8 px-4 py-4 overflow-x-auto'>
               <div className='inline-block min-w-full shadow-md rounded-lg overflow-hidden'>
                  {renderEventList.length > 0 ? (
                     <table className='min-w-full leading-normal'>
                        <EventTableHeader />
                        <tbody>
                           {renderEventList.map((eventItem) => (
                              <EventItem
                                 renderEventList={renderEventList}
                                 key={eventItem._id}
                                 eventItem={eventItem}
                                 handleClickEditEvent={handleClickEditEvent}
                              />
                           ))}
                        </tbody>
                     </table>
                  ) : (
                     <p>Danh sách event trống</p>
                  )}
               </div>
            </div>
         </div>
         {isShowModalCreateUpdateEvent && (
            <AdminModal
               title={`${editingEvent ? 'Edit Event' : 'Create new Event'}`}
               showFooter={false}
               className='w-[90vw] pb-2'
               cancel={() => setIsShowModalCreateUpdateEvent(false)}>
               <ModalCreateEvent
                  cancel={() => setIsShowModalCreateUpdateEvent(false)}
                  handleCreateUpdateEvent={handleCreateUpdateEvent}
                  editingEvent={editingEvent}
               />
            </AdminModal>
         )}

         {isShowLoading && <LoadingActionPage />}
      </AdminLayout>
   );
}

export const getServerSideProps = async () => {
   let eventList = [];

   try {
      const eventRes = await eventApi.getAllEvent();
      eventList = eventRes?.data?.data.filter((item) => item.status == true);
   } catch (error) {}

   return {
      props: {
         eventList: eventList || [],
      },
   };
};
