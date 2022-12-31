export default function converFirstLetterToUpperCase(str) {
   // converting first letter to uppercase
   const capitalized = str?.replace(/^./, str[0].toUpperCase());

   return capitalized;
}
