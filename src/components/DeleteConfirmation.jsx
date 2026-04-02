import {useEffect, useState} from 'react';
const TIMER = 3000;
export default function DeleteConfirmation({ onConfirm, onCancel }) {
  const [remainingTime, setRemainingTime] = useState(TIMER);
//The setInterval defines a function that will be executed every couple of millisecond 
useEffect(()=>{
  //the interval is the reference to the intervall 
   const interval = setInterval(() =>{
    setRemainingTime(prevTime => prevTime-10)
  },10);
  return () =>{
    clearInterval(interval);
  }
},[])
  

  useEffect(() => {
  console.log("Timer Set")
//The setTimeOut simply sets the timer which expires after a given time period 
 const timer=  setTimeout(()=>{
    onConfirm()
  },TIMER);
  //This function below is returned by the useEffect when this effect 
  //function runs again ie right before
  return () =>{
    clearTimeout(timer);
  }
  },[]);

  
  return (
    <div id="delete-confirmation">
      <h2>Are you sure?</h2>
      <p>Do you really want to remove this place?</p>
      <div id="confirmation-actions">
        <button onClick={onCancel} className="button-text">
          No
        </button>
        <button onClick={onConfirm} className="button">
          Yes
        </button>
      </div>
      <progress value ={remainingTime} max={TIMER}/>
    </div>
  );
}
