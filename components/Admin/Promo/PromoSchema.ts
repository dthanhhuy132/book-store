import * as Yup from 'yup';
import moment from 'moment';

export const validateEventForPromoSchema = {
   title: Yup.string().required('Vui lòng nhập title!'),
   description: Yup.string().required('Vui lòng nhập description!'),
   startDate: Yup.date().required('Vui lòng nhập start time'),
   endDate: Yup.date()
      .required('Vui lòng nhập end time')
      .when('startDate', (startDate, schema) => startDate && schema.min(startDate)),
   percent: Yup.number().required('vui lòng nhập phần trăm giảm giá cho Event'),
   images: Yup.mixed().required('Images is required'),
};

export const validatePromoSchema = {
   name: Yup.string().required('Vui lòng nhập name!'),
   categoryImage: Yup.mixed().required('Images is required'),
   event: Yup.array()
      .of(Yup.string())
      .required('Vui lòng chọn event tương ứng với promo')
      .min(1, 'Vui lòng chọn event tương ứng với promo'),
};
