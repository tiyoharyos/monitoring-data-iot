'use client'

import { use, useEffect } from "react"

export default function Home(){

  useEffect(() => {
    const event = new EventSource("/api/monitor", {withCredentials:true})
    event.onopen = function(){
      console.log("Connected")
    }
    event.onmessage = function(ev){
      console.log(ev.data)
    }
    event.onerror = function(er){
      console.log(er)
    }

    return () => {
      event.close()
    }
  },[])


  return (
    <h1>Helo</h1>
  )
}