export default function InputCustom({
   type = 'text',
   label = '',
   value = '',
   onChange = () => {},
   props,
}: any) {
   return (
      <div>
         <label>{label}</label>
         <input
            type={type}
            value={value}
            className='w-full border-2 px-2 py-1 rounded-md'
            onChange={onChange}
            {...props}
         />
      </div>
   );
}
