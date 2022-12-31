import Loading from './Loading';

export default function LoadingActionPage() {
   return (
      <div className=''>
         <div className='fixed inset-0 bg-black  opacity-80 z-[99999]'></div>
         <div className='absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-[99999999999999999]'>
            <Loading width='50px' height='50px'></Loading>
         </div>
      </div>
   );
}
