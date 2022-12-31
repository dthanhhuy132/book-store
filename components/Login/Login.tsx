import {useRouter} from 'next/router';
import {useEffect, useState, useMemo} from 'react';

import {useSession, signIn, signOut} from 'next-auth/react';
import Link from 'next/link';

import {useFormik} from 'formik';
import * as Yup from 'yup';
import {validateLoginSchema, validateRegisterSchema} from './validateSchema';
import {LoginValidateText} from '.';
import {Loading} from '../common';

import {SocialLogin} from './index';
import {AiOutlineEye, AiOutlineEyeInvisible} from 'react-icons/ai';

interface ILogin {
   formValue: {
      email: string;
      userNumber?: string;
      password: string;
      repassword?: string;
   };

   handleSubmitForm: (data: any) => void;
   isShowLoading: boolean;
   errorText: string;
}

export default function Login({
   formValue,
   handleSubmitForm,
   isShowLoading = false,
   errorText = '',
}: ILogin) {
   const router = useRouter();

   const [isShowPassword, setIsShowPassword] = useState(false);

   const yupFormValidateSchema =
      router.pathname === '/register' ? validateRegisterSchema : validateLoginSchema;

   const formik = useFormik({
      initialValues: formValue,
      validationSchema: Yup.object(yupFormValidateSchema),
      onSubmit: (values) => {
         handleSubmitForm(values);
      },
   });

   const isRegisterPage = useMemo(() => router.pathname === '/register', [router.pathname]);

   return (
      <div className='relattive w-[350px] mt-10 p-10 border-1 bg-[#891a1c] rounded-md md:w-[400px] md:rounded-lg  md:p-5 lg:w-[450px] lg:p-10 '>
         <div className='flex flex-col '>
            <form
               autoComplete='new-password'
               onSubmit={formik.handleSubmit}
               className='w-full flex flex-col gap-y-5'>
               <div>
                  <input
                     type='search'
                     name='email'
                     autoComplete='new-password'
                     placeholder='Email/Phone number'
                     className='w-full text-white outline-none bg-transparent border-b-[1px] border-black pb-[4px] placeholder-gray-400'
                     value={formik.values.email}
                     onChange={formik.handleChange}
                  />
                  {formik.errors.email && formik.touched.email && (
                     <LoginValidateText warningText={formik.errors.email} />
                  )}
               </div>

               {isRegisterPage && (
                  <div>
                     <input
                        type='search'
                        name='userNumber'
                        autoComplete='new-password'
                        placeholder='Phone'
                        className='w-full text-white bg-[none] outline-none bg-transparent border-b-[1px] border-black pb-[4px] placeholder-gray-400 placeholder:font-thin'
                        value={formik.values.userNumber}
                        onChange={formik.handleChange}
                     />
                     {formik.errors.userNumber && formik.touched.userNumber && (
                        <LoginValidateText warningText={formik.errors.userNumber} />
                     )}
                  </div>
               )}
               <div>
                  <div className='relative'>
                     <input
                        type={isShowPassword ? 'text' : 'password'}
                        name='password'
                        autoComplete='new-password'
                        placeholder='Password'
                        className='w-full text-white bg-[none] outline-none bg-transparent border-b-[1px] border-black pb-[4px] placeholder-gray-400'
                        value={formik.values.password}
                        onChange={formik.handleChange}
                     />
                     <div
                        className='absolute top-[50%] right-[2px] translate-y-[-50%] text-white font-thin cursor-pointer'
                        onClick={() => setIsShowPassword(!isShowPassword)}>
                        {isShowPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                     </div>
                  </div>
                  {formik.errors.password && formik.touched.password && (
                     <LoginValidateText warningText={formik.errors.password} />
                  )}
               </div>
               {isRegisterPage && (
                  <div>
                     <div className='relative'>
                        <input
                           type={isShowPassword ? 'text' : 'password'}
                           name='repassword'
                           autoComplete='new-password'
                           placeholder='Re-password'
                           className='w-full text-white bg-[none] outline-none bg-transparent border-b-[1px] border-black pb-[4px] placeholder-gray-400'
                           value={formik.values.repassword}
                           onChange={formik.handleChange}
                        />

                        <div
                           className='absolute top-[50%] right-[2px] translate-y-[-50%] text-white font-thin cursor-pointer'
                           onClick={() => setIsShowPassword(!isShowPassword)}>
                           {isShowPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                        </div>
                     </div>

                     {formik.errors.repassword && formik.touched.repassword && (
                        <LoginValidateText warningText={formik.errors.repassword} />
                     )}
                  </div>
               )}
               <button
                  type='submit'
                  disabled={isShowLoading}
                  className={` flex justify-center border-[1px] border-black rounded-lg uppercase text-[0.9rem] font-[400] text-gray-900 hover:text-white py-2 mt-3 mb-2`}>
                  {/* hover:bg-[#b91c1c] */}
                  {isShowLoading && (
                     <span className='mr-2'>
                        <Loading />
                     </span>
                  )}
                  <span className='font-bold'>{isRegisterPage ? 'Register' : 'Login'}</span>
               </button>

               <div className='text-center'>
                  {errorText && (
                     <LoginValidateText
                        warningText={errorText}
                        isError={errorText ? true : false}
                     />
                  )}
               </div>
            </form>

            {/* login or register navigation */}
            <button
               type='submit'
               disabled={isShowLoading}
               className={`flex justify-center border-[1px] border-gray-900 rounded-lg uppercase text-[0.9rem] font-bold text-gray-900 py-2 mb-2 hover:text-white`}
               onClick={() => router.push(`${isRegisterPage ? '/membership' : '/register'}`)}>
               {isRegisterPage ? 'Login' : 'Register'}
            </button>
         </div>
         <p className='mt-5 text-white text-[0.9rem]'>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed mollitia recusandae iste
            ad assumenda culpa incidunt iusto maxime voluptate neque?
         </p>
         {/* login with social network */}
         <SocialLogin />
      </div>
   );
}
