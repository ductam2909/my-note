import React, { useState } from 'react'

export default function test () {
  function Parent () {
    const [message, setMessage] = useState('')

    const callbackFunction = (childData) => {
      setMessage(childData)
    }

    return (
      <div>
        <Child parentCallback={callbackFunction} />
        <p> {message} </p>
        <button onClick={() => { console.log(message) }}>test</button>
      </div>
    )
  }

  function Child (props) {
    const sendData = () => {
      props.parentCallback('Message from Child')
    }

    return (
      <>
        <button onClick={() => { sendData() }}>ssss</button>
      </>
    )
  };

  return (
    <div>test
      {Parent()}
    </div>
  )
}
