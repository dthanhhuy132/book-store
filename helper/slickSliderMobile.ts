export default function slickSliderMobile() {
   const slickItemEls = document.querySelectorAll('.slick-thumb-custom li');
   const slickItemFirst = slickItemEls[0] as HTMLLIElement;
   const slickItemWidth = 100 / slickItemEls.length;
   slickItemEls.forEach((item, index) => {
      if (item.classList.contains('slick-active')) {
         slickItemFirst.style.width = `${slickItemWidth * (index + 1)}%`;
      }
   });
}
