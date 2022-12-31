import Marquee from 'react-fast-marquee';
import styled from 'styled-components';

export default function HeaderMarquee({eventArr}) {
   return (
      <MarqueeSC className='relative z-10 bg-[#891a1c] ' speed={50} direction={'left'}>
         {eventArr?.map((event, index) => (
            <h3 className={`mx-[50px] md:px-[200px] text-white`} key={index}>
               {event.title}
            </h3>
         ))}
      </MarqueeSC>
   );
}

const MarqueeSC = styled(Marquee)`
   padding: 2px 0px;
   overflow: hidden;
   .overlay {
      &:before {
         background: none;
      }
      &:after {
         background: none;
      }
   }
`;
