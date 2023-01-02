import {useState} from 'react';
import Skeleton from 'react-loading-skeleton';

export default function SkeletonBookLoading() {
   const [randomHeigth] = useState(Math.floor(Math.random() * 100 + 250));
   return (
      <div>
         <Skeleton
            highlightColor='#fff'
            className={`rounded-lg object-cover brightness-[85%] inline-block dark:brightness-75`}
            style={{height: `${randomHeigth}px`}}
         />
         <Skeleton
            highlightColor='#fff'
            className={`rounded-lg object-cover brightness-[85%] inline-block dark:brightness-75`}
            style={{height: `20px`}}
         />
         <Skeleton
            highlightColor='#fff'
            className={`rounded-lg object-cover brightness-[95%] inline-block dark:brightness-75`}
            style={{height: `20px`}}
         />
      </div>
   );
}
