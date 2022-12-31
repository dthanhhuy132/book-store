import Select from 'react-select';
import React, {useEffect, useState} from 'react';

import PaymetnInputForm from './PaymentInputForm';
import {address} from './address/address';
import {province} from './address/province';
import {WarningText} from '../Admin/common';

export default function PaymentAddress({formik, setShipCost}) {
   const formatProvince = province.map((item) => ({value: item, label: item}));
   const [initProvince, setProvince] = useState('Thành phố Hồ Chí Minh');
   const [districtName, setDistrictName] = useState('');
   const [district, setDistrict] = useState([]);

   function getAndFormatDistrict() {
      const districtList = address.filter((x) => x.province === initProvince)[0].districtsArr;
      return districtList.map((item) => ({value: item, label: item}));
   }

   useEffect(() => {
      const newDistrictList = getAndFormatDistrict();
      setDistrict(newDistrictList);

      if (initProvince.indexOf('Hồ Chí Minh') <= 0) {
         setShipCost(22000);
      } else {
         setShipCost(15000);
      }
   }, [initProvince]);

   return (
      <div className='flex gap-3 flex-col mb-5'>
         <div className='flex flex-col md:flex-row justify-between gap-5'>
            <div className='md:w-[50%]'>
               <label className='font-semibold'>Tỉnh/Thành phố *</label>
               <Select
                  id='short-value-select'
                  instanceId='short-value-select'
                  placeholder='Chọn Tỉnh/Thành phố'
                  defaultInputValue={formik.values.address1 || initProvince}
                  name='address1'
                  options={formatProvince}
                  onChange={(e) => {
                     setProvince(e.value);
                     formik.values.address1 = e.value;
                  }}
               />
               {formik.errors.address1 && formik.touched.address1 && (
                  <WarningText warningText={formik.errors.address1} />
               )}
            </div>

            <div className='md:w-[50%]'>
               <label className='font-semibold'>Quận/Huyện *</label>
               <Select
                  name='address2'
                  id='long-value-select'
                  instanceId='long-value-select'
                  placeholder='Chọn Quận/Huyện'
                  options={district.length > 0 ? district : [{value: '', label: ''}]}
                  onChange={(e) => {
                     setDistrictName(e.value);
                     formik.values.address2 = e.value;
                  }}
               />

               {formik.errors.address2 && formik.touched.address2 && (
                  <WarningText warningText={formik.errors.address2} />
               )}
            </div>
         </div>
         <div>
            <PaymetnInputForm
               label='Địa chỉ'
               name='address3'
               placeHolder='Địa chỉ cụ thể'
               value={formik.values.address3}
               onChange={formik.handleChange}
            />
            {formik.errors.address3 && formik.touched.address3 && (
               <WarningText warningText={formik.errors.address3} />
            )}
         </div>
      </div>
   );
}
