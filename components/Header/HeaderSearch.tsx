import {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import {BsSearch} from 'react-icons/bs';
import {useRouter} from 'next/router';
import {useDebounce} from 'use-debounce';
import useWindowDimensions from '../../hooks/UseWindowDimensions';
interface IHeaderSearch {
   whiteLine?: Boolean;
}

export default function HeaderSearch({whiteLine = false}: IHeaderSearch) {
   const router = useRouter();

   const [isOnInput, setOnInput] = useState(false);
   const [searchStr, setSearchStr] = useState('');
   const {width} = useWindowDimensions();
   const [searchStrDebounced] = useDebounce(searchStr, 500);

   const [isMobileScreen, setIsMobileScreen] = useState(false);

   const inputRef = useRef(null);

   useEffect(() => {
      if (searchStr.trim()) {
         router.push(`/search?q=${searchStrDebounced}`);
      } else if (!searchStrDebounced.trim() && router.pathname.indexOf('/search') >= 0) {
         router.push('/');
      }
   }, [searchStrDebounced]);

   useEffect(() => {
      if (width > 600) {
         setIsMobileScreen(false);
      }
      if (width < 600) {
         setIsMobileScreen(true);
      }
   }, [width]);

   return (
      <div className='flex items-end'>
         <DivSC isOnInput={isOnInput} hasSearchStr={searchStr.length > 0} whiteLine={whiteLine}>
            <input
               type='text'
               className={`lg:block p-0 outline-none relative bg-transparent w-full text-${
                  isMobileScreen ? 'center' : 'left'
               }`}
               onBlur={() => setOnInput(false)}
               onFocus={() => setOnInput(true)}
               onChange={(e) => setSearchStr(e.target.value)}
               value={searchStr}
               ref={inputRef}
            />
         </DivSC>
         <span className='pl-2 mb-[1px]'>
            <BsSearch
               className=' -scale-x-100 cursor-pointer text-[1.4rem]'
               onClick={() => inputRef.current && inputRef.current.focus()}
            />
         </span>
      </div>
   );
}

const DivSC = styled('div')<any>(
   (props) => `
         position: relative;

            &:before {
               content: '';
               position: absolute;
               right: 0;
               bottom: ${props.isOnInput || props.hasSearchStr ? '-2px' : '1px'};
               width: 100%;
               height: 1px;
               background: ${
                  props.isOnInput || props.hasSearchStr
                     ? '#999'
                     : props.whiteLine
                     ? '#999'
                     : 'black'
               };
               z-index: 99;
               transition: all ease 0.2s
            }
         `
);
