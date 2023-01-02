import {useState, useRef, useEffect} from 'react';
import {BiCopyAlt} from 'react-icons/bi';
import FormatPrice from '../../helper/FormatPrice';
import to_string_vn_money from './common/convertMoneyToString';
import PaymentCopy from './common/PaymentCopy';

export default function PaymentMethod({userInfo, formik, toTalPrice}) {
   const [paymentWay, setPaymentWay] = useState(formik.values.paymentMethods);

   const [userInfoForNextJS, setUserInfoForNextJS] = useState(null);
   useEffect(() => {
      setUserInfoForNextJS(userInfo);
   }, [userInfo]);

   useEffect(() => {
      formik.values.paymentMethods = paymentWay;
   }, [paymentWay]);
   return (
      <div className='transition'>
         <p className='font-bold mt-6 mb-2'>PHƯƠNG THỨC THANH TOÁN</p>

         <div>
            <div className='flex items-center gap-1'>
               <input
                  type='radio'
                  id='momo'
                  name='fav_language'
                  defaultValue='momo'
                  disabled
                  checked={paymentWay === 'MOMO'}
                  onChange={(e: any) => {
                     setPaymentWay(e.target.value);
                  }}
               />
               <label htmlFor='MOMO' className='cursor-pointer font-semibold text-gray-400'>
                  Thanh toán qua Momo
               </label>
            </div>

            <div
               className={`h-0 overflow-hidden mt-2 transition  ${
                  paymentWay === 'MOMO' && `h-[200px]`
               }`}>
               Thanh thanh toán bằng momo thì phải chuyển khoản trước nhé Thanh thanh toán bằng momo
               thì phải chuyển khoản trước nhé Thanh thanh toán bằng momo thì phải chuyển khoản
               trước nhé Thanh thanh toán bằng momo thì phải chuyển khoản trước nhé Thanh thanh toán
               bằng momo thì phải chuyển khoản trước nhé Thanh thanh toán bằng momo thì phải chuyển
               khoản trước nhé Thanh thanh toán bằng momo thì phải chuyển khoản trước nhé T
            </div>
         </div>

         {/* -------------------> COD  */}
         <div className='mt-2 border-b-2 border-t-2 py-2 flex flex-col justify-center'>
            <div className='flex items-center gap-1'>
               <input
                  type='radio'
                  id='COD'
                  name='fav_language'
                  defaultValue='COD'
                  checked={paymentWay === 'COD'}
                  onChange={(e: any) => setPaymentWay(e.target.value)}
               />
               <label htmlFor='COD' className='cursor-pointer font-semibold '>
                  Thanh toán khi nhận hàng
               </label>
            </div>

            <div
               className={`h-0 overflow-hidden mt-2 transition-all ${
                  paymentWay === 'COD' && 'h-[40px]'
               } `}>
               Trả tiền mặt khi nhận hàng
            </div>
         </div>
         <div className='mt-2'>
            <div className='flex items-center gap-1'>
               <input
                  type='radio'
                  id='BANK'
                  name='fav_language'
                  defaultValue='BANK'
                  checked={paymentWay === 'BANK'}
                  onChange={(e: any) => setPaymentWay(e.target.value)}
               />
               <label htmlFor='BANK' className='cursor-pointer font-semibold'>
                  Chuyển khoản qua ngân hàng
               </label>
            </div>

            <div
               className={`overflow-hidden mt-2 transition-all pl-4 ${
                  paymentWay === 'BANK' ? `h-full` : 'h-0'
               } `}>
               <p className='uppercase font-bold py-2 border-b-[1px] border-gray-300 text-[#891a1c]'>
                  HƯỚng dẫn thanh toán chuyển khoản
               </p>
               <div className='mt-2 font-bold flex flex-col gap-2'>
                  <p className='flex'>
                     <span className='min-w-[220px] inline-block'>Số tài khoản thanh toán:</span>
                     <span className='font-semibold md:flex md:items-center md:gap-2'>
                        0364602670
                        <PaymentCopy text='0364602670' />
                     </span>
                  </p>
                  <p className='flex'>
                     <span className='min-w-[220px] inline-block'>Tên chủ tài khoản:</span>
                     <span className='font-semibold inline-block'>LE CONG DOAN</span>
                  </p>
                  <div className='flex'>
                     <span className='min-w-[220px] inline-block'>Ngân hàng:</span>
                     <p className='flex flex-col'>
                        <span className=' font-semibold'>Vietcombank - </span>
                        <span>Ngân hàng TMCP Ngoại thương Viet Nam</span>
                     </p>
                  </div>

                  <div className='flex'>
                     <span className='min-w-[220px] inline-block'>Số tiền thanh toán:</span>
                     <p className='flex flex-col'>
                        <span className=' font-semibold text-[#891a1c]'>
                           <FormatPrice fontSize='1.2rem' price={toTalPrice} clas />
                        </span>
                        <span className='font-semibold capitalize'>
                           ({to_string_vn_money(toTalPrice)})
                        </span>
                     </p>

                     <div></div>
                  </div>

                  {userInfoForNextJS && (
                     <div className='flex'>
                        <span className='min-w-[220px] inline-block'>Nội dung chuyển khoản:</span>
                        <p className=''>
                           <span className='font-semibold'>
                              {`${formik.values.name ? `${formik.values.name} - ` : ''}`}{' '}
                              {userInfoForNextJS?.userNumber} - {userInfoForNextJS?.email}
                              <span>
                                 <PaymentCopy
                                    text={`${
                                       formik.values.name ? `${formik.values.name} - ` : ''
                                    } ${userInfoForNextJS?.userNumber} - ${
                                       userInfoForNextJS?.email
                                    }`}
                                 />
                              </span>
                           </span>
                        </p>
                     </div>
                  )}
               </div>

               <div className='flex flex-col md:flex-row justify-between mt-5 py-2 border-t-[1px] border-gray-300'>
                  <p className='uppercase' style={{fontFamily: 'GilroySemibold'}}>
                     Thanh toán chuyển khoản nhanh qua qr code:
                  </p>
                  <div>
                     <img
                        src='https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png'
                        className='w-[150px] h-[150px]'
                        alt='qr code'
                     />
                  </div>
               </div>

               {/* <div className='mt-5'>
                  <p>Upload hình ảnh chuyển khoản</p>
                  {!imgBank && (
                     <div
                        className='flex items-center justify-center w-[150px] h-[150px] border-2 rounded-lg text-[3rem] text-gray-300 cursor-pointer group'
                        onClick={handleClickUploadEvidenceBank}>
                        <span className='group-hover:text-[#891a1c] group-hover:scale-125 transition'>
                           +
                        </span>
                     </div>
                  )}
                  <div className='relative'>
                     {imgBank && <img className='' src={imgBank?.preview}></img>}
                     {imgBank && (
                        <i
                           className='absolute top-3 left-3 fa-sharp fa-solid fa-xmark text-[1.8rem] hover:scale-125 transition cursor-pointer hover:text-[#891a1c]'
                           onClick={() => setImgBank('')}
                        />
                     )}
                  </div>
                  <input
                     ref={inputRef}
                     hidden
                     type='file'
                     accept='png/jpg'
                     onChange={handleUploadImgBank}></input>
               </div> */}
            </div>
         </div>
      </div>
   );
}
