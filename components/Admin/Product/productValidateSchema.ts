import * as Yup from 'yup';
import moment from 'moment';

export const ProductValidateSchema = {
   name: Yup.string().required('Vui lòng nhập tên sản phẩm!'),
   description: Yup.string().required('Vui lòng nhập description cho sản phẩm!'),

   price: Yup.number().required('Vui lòng nhập giá tiền cho sản phẩm').min(0, 'Min is 0'),
   colorList: Yup.string().required('Vui lòng nhập màu cho sản phẩm sản phẩm!'),
   avatar: Yup.mixed().required('Product avatar is required'),
   pictures: Yup.mixed().required('Product images is required'),
   categoryId: Yup.string().required('Vui lòng chọn Category cho sản phẩm!'),
};
