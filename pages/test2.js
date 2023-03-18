import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

export default function test2() {
  const s= Date.now()
  // const [time,setTime] = useState()
 
  const Test =()=> {
    const [currentCount, setCount] = useState(10);
    useEffect(
      () => {
      const timer = () => setCount(currentCount - 1);
      if (currentCount <= 0) {
        return;
      }
      if (currentCount===5) {
        toast.success('okk')
     }
        const id = setInterval(timer, 1000);
       return () => clearInterval(id);
      },
      [currentCount]
  );
      return <p>{currentCount}</p>
  }



  return (
    <div>
      <Test />
      
    </div>
  )
}
