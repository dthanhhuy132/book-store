import {useRouter} from 'next/router';
import {useState} from 'react';
import {toast} from 'react-toastify';
import {HomeBackground} from '../components/HomeBackground';
import {Login} from '../components/Login';
import {Logo} from '../components/Logo';
import {useAppDispatch} from '../store';
import {registerAsyncAction} from '../store/auth/authAsyncAction';

import Cookies from 'js-cookie';
import {getTokenExpireTime} from '../helper';
import panelApi from '../service/panelApi';
import {PANEL_FOR_HOME} from '../store/panel/panelSlice';
export default function RegisterPage({homePanelList}) {
   const registerData = {
      email: '',
      userNumber: '',
      password: '',
      repassword: '',
   };
   const dispatch = useAppDispatch();
   const router = useRouter();

   const [isShowLoading, setIsShowLoading] = useState(false);
   const [errorLogin, setErrorLogin] = useState<any>('');

   function handleRegister(registerData) {
      setIsShowLoading(true);
      const {email, userNumber, password} = registerData;
      dispatch(registerAsyncAction({email, userNumber, password})).then((res) => {
         if (res.payload.ok) {
            // router.push('/shop');
            const userData = res.payload.data;

            const accessToken = res.payload.user.accessToken;
            const expireAccessTokenDay = getTokenExpireTime(accessToken);

            Cookies.set('accessToken', accessToken, {expires: expireAccessTokenDay});
         } else {
            toast.error(res.payload.message);
            setIsShowLoading(false);
         }
      });
   }
   return (
      <div className='relative'>
         <HomeBackground ishomepage={false} homePanelImg={homePanelList}></HomeBackground>
         <div className='fixed top-0 right-0 left-0 bottom-0 bg-black opacity-80'></div>
         <div className='absolute flex flex-col items-center z-1 top-[40px] left-[50%] translate-x-[-50%] md:top-0 lg:top-[100px]'>
            <Login
               formValue={registerData}
               handleSubmitForm={handleRegister}
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
         homePanelList: homeImageList[0] || [],
      },
   };
};
