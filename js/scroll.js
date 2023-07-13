addDragToScroll = (slider, day_id) => {
   let isDown = false;
   let startX;
   let startY;
   let scrollLeft;
   let scrollTop;
   let new_scrollLeft 
   let new_scrollTop 
   let check_remove = false
   let block_button 

   if (typeof day_id !== "undefined")  {
      block_button = document.querySelector(`#Table-${day_id}-container .button-edit-table`)
   }
   slider.addEventListener('mousedown', (e) => {
      isDown = true;
      slider.classList.add('active');
      startX = e.pageX - slider.offsetLeft;
      startY = e.pageY - slider.offsetTop;
      scrollLeft = slider.scrollLeft;
      scrollTop = slider.scrollTop;
      slider.style = "cursor: grabbing !important;"
   });
   slider.addEventListener('mouseleave', () => {
      isDown = false;
      slider.classList.remove('active');
   });
   slider.addEventListener('mouseup', () => {
      isDown = false;
      slider.classList.remove('active');
      slider.style = "cursor: auto;"
      window.setTimeout(() => {
         check_remove = false
         if (typeof day_id !== "undefined")  {
            block_button.setAttribute("onClick", `loadEditableDataIntoRosterTable(this, ${day_id})`)
         }
      }, 50)
   });
   slider.addEventListener('mousemove', (e) => {
      if(!isDown) return;

      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const y = e.pageY - slider.offsetTop;
      const walk = (x - startX) * 3; //scroll-fast
      const walk_y = (y - startY) * 3; //scroll-fast
      new_scrollLeft = scrollLeft - walk;
      new_scrollTop = scrollTop - walk_y;
      if (scrollLeft !== new_scrollLeft && !check_remove) {
         check_remove = true;
         if (typeof day_id !== "undefined")  {
            block_button.removeAttribute("onClick")
         }
      }
      slider.scrollLeft = new_scrollLeft
      slider.scrollTop = new_scrollTop
   });
}
