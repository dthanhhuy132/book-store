import {useEffect} from 'react';
import {signIn, useSession} from 'next-auth/react';

export default function SocialLogin() {
   // login with google
   // const {data: session} = useSession();

   function handleSignInWithGoogle() {
      signIn('google');
   }
   // useEffect(() => {
   //    if (session) {
   //    }
   // }, [session]);

   return (
      <div className='flex flex-col gap-2 mt-10'>
         <p className='uppercase text-center font-bold text-white '>Tiếp tục với </p>

         {/* login with google */}
         <button
            className='relative p-2 text-center bg-white cursor-pointer rounded-sm hover:bg-slate-300'
            // onClick={handleSignInWithGoogle}
         >
            <img
               src='https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-suite-everything-you-need-know-about-google-newest-0.png'
               className='absolute top-[50%] left-2 translate-y-[-50%] w-[18px] h-[18px]'
               alt='gg-icon'
            />
            Tiếp tục với google
         </button>

         {/* login with facebook */}
         <button className='relative p-2 text-center bg-white cursor-pointer rounded-sm hover:bg-slate-300'>
            <img
               src='https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Facebook_icon_2013.svg/640px-Facebook_icon_2013.svg.png'
               className='absolute top-[50%] left-2 translate-y-[-50%] w-[18px] h-[18px]'
               alt='fb-icon'
            />
            Tiếp tục với facebook
         </button>
         {/* login with apple */}
         <button className='relative p-2 text-center bg-white cursor-pointer rounded-sm hover:bg-slate-300'>
            <img
               src='https://cdn3.iconfinder.com/data/icons/picons-social/57/56-apple-512.png'
               className='absolute top-[50%] left-2 translate-y-[-50%] w-[18px] h-[18px]'
               alt='ap-icon'
            />
            Tiếp tục với apple
         </button>
      </div>
   );
}
