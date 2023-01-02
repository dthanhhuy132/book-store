import {signIn, useSession} from 'next-auth/react';
import {useState} from 'react';

import {HomeBackground} from '../components/HomeBackground';
import {Login} from '../components/Login';
import {useEffect} from 'react';
import {Logo} from '../components/Logo';
import {useAppDispatch} from '../store';
import {loginAsyncAction} from '../store/auth/authAsyncAction';
import {useRouter} from 'next/router';

import Cookies from 'js-cookie';
import {getTokenExpireTime, parseJwt} from '../helper';
import {toast} from 'react-toastify';
import {PHONE_REGEX} from '../components/Login/validateSchema';
import {getCartByUserId} from '../store/cart/cartAsynAction';
import panelApi from '../service/panelApi';
import {PANEL_FOR_HOME} from '../store/panel/panelSlice';
import authApi from '../service/authApi';

export default function MembershipPage({homePanelList}) {
   const loginData = {email: '', password: ''};

   const router = useRouter();
   const dispatch = useAppDispatch();

   const [errorLogin, setErrorLogin] = useState<any>('');
   const [isShowLoading, setIsShowLoading] = useState<boolean>(false);

   async function handleLogin(data: any) {
      setIsShowLoading(true);
      let loginData;
      const {email, password} = data;
      if (PHONE_REGEX.test(email)) {
         loginData = {userNumber: email, password};
      } else {
         loginData = {email, password};
      }

      // const res = await authApi.login(loginData).then((res) => console.log('res la gi', res));

      dispatch(loginAsyncAction({loginData})).then((res) => {
         console.log('res cho nay la gi', res);

         if (res.payload?.ok) {
            const userId = res.payload.user.user._id;
            const accessToken = res.payload.user.accessToken;

            // get cart by userId
            dispatch(getCartByUserId({accessToken, userId}));

            const expireAccessTokenDay = getTokenExpireTime(accessToken);
            Cookies.set('accessToken', accessToken, {expires: expireAccessTokenDay});

            router.push('/shop');
         } else {
            setIsShowLoading(false);
            toast.error(res.payload.message);
            // toast.error('Đăng nhập không thành công, kiểm tra lại tên đăng nhập và password');
         }
      });
   }

   return (
      <div className='relative'>
         <HomeBackground ishomepage={false} homePanelImg={homePanelList}></HomeBackground>
         <div className='fixed top-0 right-0 left-0 bottom-0 bg-black opacity-80 z-0'></div>
         <div className='absolute flex flex-col items-center z-1 top-[50px] left-[50%] translate-x-[-50%] md:top-0 lg:top-[100px]'>
            <Login
               formValue={loginData}
               handleSubmitForm={(data) => handleLogin(data)}
               isShowLoading={isShowLoading}
               errorText={errorLogin}
            />
         </div>
      </div>
   );
}

export const getServerSideProps = async () => {
   let homeImageList;

   try {
      const response = await panelApi.getAllPanel();
      const homePanelRes = response?.data?.data;
      homeImageList = homePanelRes
         ?.filter((item) => item?.status !== 'cancel' && item?.pictures?.length > 0)
         ?.filter((item) => item?.description?.indexOf(PANEL_FOR_HOME) >= 0);
   } catch (error) {}

   return {
      props: {
         homePanelList: homeImageList ? homeImageList[0] : [],
      },
   };
};
