import * as Yup from 'yup';
import moment from 'moment';

export const ProductValidateSchema = {
   name: Yup.string().required('Vui lòng nhập tên!'),
   description: Yup.string().required('Vui lòng nhập description!'),

   price: Yup.number()
      .required('Vui lòng nhập giá tiền')
      .test('> 0?', 'Giá thấp nhất 1.000 VNĐ!', (value) => value >= 1000),
   avatar: Yup.mixed().required('Product avatar is required'),
   pictures: Yup.mixed().required('Product images is required'),
   categoryId: Yup.string().required('Vui lòng chọn Category!'),
   quantity: Yup.number()
      .required('Nhập sổ lượng')
      .test('> 0?', 'Số lượng phải lớn hơn 0!', (value) => value > 0),
};
