import * as Yup from 'yup';
import moment from 'moment';

export const validateVoucherSchema = {
   title: Yup.string().required('Nhập title!'),
   description: Yup.string().required('Nhập description!'),
   startDate: Yup.date().required('Nhập start time'),
   endDate: Yup.date()
      .required('Nhập end time')
      .when('startDate', (startDate, schema) => startDate && schema.min(startDate)),
   percent: Yup.number().required('Nhập phần trăm giảm giá cho Event'),
   code: Yup.string().required('Nhập mã CODE khuyến mãi!'),
   amount: Yup.number().required('Nhập số lượng cho mã giảm giá'),
};
