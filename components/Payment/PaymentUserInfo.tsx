import {WarningText} from '../Admin/common';
import PaymentAddress from './PaymentAddress';
import PaymetnInputForm from './PaymentInputForm';

export default function PaymentUserInfo({userInfo, formik, setShipCost}) {
   return (
      <>
         <div className='grid grid-cols-1 md:gap-5'>
            <div>
               <PaymetnInputForm
                  label='Tên *'
                  placeHolder='Họ và tên của bạn'
                  value={formik.values.name}
                  name='name'
                  onChange={formik.handleChange}
               />
               {formik.errors.name && formik.touched.name && (
                  <WarningText warningText={formik.errors.name} />
               )}
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 md:gap-5'>
               <div>
                  <PaymetnInputForm
                     name='phone'
                     label='Số điện thoại *'
                     placeHolder='Nhập số điện thoại'
                     onChange={formik.handleChange}
                     value={formik.values.phone}
                  />
                  {formik.errors.phone && formik.touched.phone && (
                     <WarningText warningText={formik.errors.phone} />
                  )}
               </div>

               <div>
                  <PaymetnInputForm
                     label='Email *'
                     placeHolder='Nhập email'
                     name='email'
                     value={formik.values.email}
                     onChange={formik.handleChange}
                  />
                  {formik.errors.email && formik.touched.email && (
                     <WarningText warningText={formik.errors.email} />
                  )}
               </div>
            </div>
         </div>
         <div>
            <p className='font-bold mt-6 mb-2 underline'>Địa chỉ nhận hàng</p>
            <PaymentAddress formik={formik} setShipCost={setShipCost} />
         </div>
      </>
   );
}
