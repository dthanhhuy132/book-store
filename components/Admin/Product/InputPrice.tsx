import {useState, useEffect} from 'react';

const InputPrice = ({name, value, className, formik}) => {
   const [valueInput, setValue] = useState(value);

   const addCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
   const removeNonNumeric = (num) => num.toString().replace(/[^0-9]/g, '');

   const handleChange = (event) => setValue(addCommas(removeNonNumeric(event.target.value)));
   function handleChangePrice() {
      if (valueInput && valueInput?.indexOf(',') >= 0) {
         formik.values.price = Number(valueInput?.split(',').join(''));
      }
   }
   return (
      <div>
         <input
            type='text'
            value={valueInput}
            onInput={handleChange}
            onChange={handleChangePrice}
            name={name}
            className={className}
         />
      </div>
   );
};

export default InputPrice;

// type='text' name={name} value={value} onChange={onChange} className={className}
