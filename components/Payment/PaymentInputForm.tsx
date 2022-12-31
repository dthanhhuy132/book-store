interface IPaymentInputForm {
   name?: any;
   onChange?: any;
   label: string;
   placeHolder: string;
   value?: any;
}

export default function PaymetnInputForm({
   name = '',
   onChange = null,
   label,
   placeHolder,
   value = '',
}: IPaymentInputForm) {
   return (
      <div className='flex flex-col gap-2'>
         <label className='font-[500]'>{label}</label>
         <input
            name={name}
            onChange={onChange}
            value={value}
            type='text'
            className='ring-1 ring-gray-300 py-[6px] px-2 rounded-[4px] outline-blue-500'
            placeholder={placeHolder}
         />
      </div>
   );
}
