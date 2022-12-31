import * as Yup from 'yup';

export const PHONE_REGEX = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;
const EMAIL_REGEX = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

const validateLoginSchema = {
   email: Yup.string()
      .required('Email/Phone number is required')
      .test('test-name', 'Enter Valid Phone/Email', function (value) {
         let isValidEmail = EMAIL_REGEX.test(value);
         let isValidPhone = PHONE_REGEX.test(value);
         if (!isValidEmail && !isValidPhone) {
            return false;
         }
         return true;
      }),

   password: Yup.string().min(8, 'Minimum 8 characters').required('Please enter your password!'),
};
const validateRegisterSchema = {
   email: Yup.string().email('Invalid email format').required('Please enter your email!'),
   userNumber: Yup.string()
      .matches(PHONE_REGEX, 'Số điện thoại không phù hợp')
      .required('Please enter your phone number!'),
   password: Yup.string().min(8, 'Minimum 8 characters').required('Please enter your password!'),
   repassword: Yup.string()
      .oneOf([Yup.ref('password')], "Password's not match")
      .required('Please enter re-password'),
};

export {validateLoginSchema, validateRegisterSchema};
