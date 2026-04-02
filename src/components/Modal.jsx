import {  useRef,useEffect } from 'react';
import { createPortal } from 'react-dom';
//We are here using the useEffect not o avoid the infinite loop but to connect the open or the modal function to the dom api 
//To do a certain behaviour
function Modal({ open, children }, ){
  const dialog = useRef();
  useEffect(() =>{
     if(open){
    dialog.current.showModal();

  }else {
    dialog.current.close();
  }
  //effect dependencies are just any values which makes the function to execute again 
  },[open] )
  
 
  return createPortal(
    <dialog className="modal" ref={dialog} > 
      {open ? children: null}
    </dialog>,
    document.getElementById('modal')
  );
};

export default Modal;
