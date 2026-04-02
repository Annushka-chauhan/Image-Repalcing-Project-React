import {useState, useEffect} from 'react';

export default function ProgressBar({timer}){
    const [remainingTime, setRemainingTime] = useState(timer);
    //The setInterval defines a function that will be executed every couple of millisecond 
    useEffect(()=>{
      //the interval is the reference to the intervall 
       const interval = setInterval(() =>{
        setRemainingTime(prevTime => prevTime-10)
      },10);
      return () =>{
        clearInterval(interval);
      }
    },[]);
    return <progress value ={remainingTime} max={timer}/>
}