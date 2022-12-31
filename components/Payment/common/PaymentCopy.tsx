import {useState} from 'react';
import {BiCopyAlt} from 'react-icons/bi';

export default function PaymentCopy({text = ''}) {
   const [isCopyEnd, setIsCopyEnd] = useState('copy');

   function copyToClipBoard() {
      setIsCopyEnd('copied');
      navigator.clipboard.writeText(text);
      setTimeout(() => {
         setIsCopyEnd('copy');
      }, 1000);
   }
   return (
      <span
         className={`text-[0.8rem] flex ${
            isCopyEnd === 'copied' ? 'text-[green]' : 'text-[#a5a5a5]'
         } hover:${isCopyEnd === 'copied' ? 'text-[green]' : 'text-[#a5a5a5]'} cursor-pointer`}
         onClick={() => copyToClipBoard()}>
         <BiCopyAlt fontSize={'1.2rem'} />
         {isCopyEnd}
      </span>
   );
}
