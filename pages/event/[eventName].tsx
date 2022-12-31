import {useRouter} from 'next/router';
import {getLinkBannerPanel} from '../../components/Admin/Home/getLinkHomePanel';
import NotFound from '../../components/NotFound';
import stringToSlug from '../../helper/stringToSlug';
import {useAppSelector} from '../../store';

export default function EventDetail() {
   const router = useRouter();

   // get event Name from slug
   const eventName = router.query.eventName as string;
   const eventSlug = eventName.split('-').slice(0, -1).join('-');

   // get event state for event
   const {eventStateForEvent} = useAppSelector((state) => state.event);

   // find event by slug name => get event by the name
   const findEventInRedux = eventStateForEvent?.filter(
      (event) => stringToSlug(event.title).split('-').slice(0, -1).join('-') == eventSlug
   )[0];

   // conver event Link from event description
   const eventLinkArr = getLinkBannerPanel(findEventInRedux?.description).map((item) => {
      const linkIndex = item.indexOf('.');
      if (linkIndex) {
         return item.substring(linkIndex + 1, item.length).trim();
      }
      return item.trim();
   });

   console.log('eventLinkArr', eventLinkArr);

   return (
      <div className='overflow-x-hidden'>
         {findEventInRedux ? (
            <>
               {findEventInRedux?.images.map((imgLink, index) => {
                  return (
                     <img
                        key={index}
                        className='min-w-[100vw] cursor-pointer'
                        src={imgLink}
                        onClick={() => {
                           router.push(`/${eventLinkArr[index]}`);
                        }}
                     />
                  );
               })}
            </>
         ) : (
            <NotFound navigateLink='/event' navigateText='GO TO EVENT' title='Event tồn tại' />
         )}
      </div>
   );
}
