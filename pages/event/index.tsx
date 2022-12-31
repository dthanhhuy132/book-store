import {useRouter} from 'next/router';
import {Logo} from '../../components/Logo';
import stringToSlug from '../../helper/stringToSlug';
import {useAppSelector} from '../../store';

export default function EventPage() {
   const router = useRouter();
   const {eventStateForEvent} = useAppSelector((state) => state.event);

   console.log('eventState trong trang event', eventStateForEvent);
   return (
      <div className='w-full px-2 md:w-3/4 md:mx-auto my-10'>
         {eventStateForEvent && eventStateForEvent?.length > 0 ? (
            <>
               <div className='min-h-[60vh] mx-auto flex justify-center flex-wrap'>
                  {eventStateForEvent.map((event) => (
                     <div
                        key={event._id}
                        className='w-1/2 md:w-1/3 p-1 cursor-pointer'
                        onClick={() => router.push(`/event/${stringToSlug(event.title)}`)}>
                        <h2 className='font-bold text-[1rem] md:text-[1.2rem] text-center text-[#891a1c]'>
                           # {event.title}
                        </h2>
                        <div className='overflow-hidden rounded-lg '>
                           <img
                              src={event?.images[0]}
                              alt='eventImg'
                              className='hover:scale-105 transition-all'
                           />
                        </div>
                     </div>
                  ))}
               </div>
            </>
         ) : (
            //   not render event list if it not existing
            <div className='w-[100vw] h-[71vh] flex justify-center items-center flex-col'>
               <Logo width='200px' height='40px'></Logo>
               <h1 className='font-bold'>Chưa có sự kiện mới</h1>
            </div>
         )}
      </div>
   );
}
