import Navbar from "./components/navbar"
import Ball from "./components/ball"
import Link from 'next/link';
export default function Home(){
  return(
    <>
    <Navbar/>
    <div className="p-10 flex min-h-screen ">
  
        <div className="w-[940px] relative">
          <h1 className="text-[150px] absolute top-[150px]  font-medium ">Data<span className="text-green-500 font-bold">Charm</span></h1>
          <h1 className="text-[60px] absolute top-[350px]  hover:text-blue-500 transition-colors duration-500 font-medium"> Tool For <span className="">Data Preview</span> </h1>
          <Link href="/home">
           <button className="rounded-2xl w-50 h-15 text-2xl bg-green-500 text-black  hover:bg-red-700 hover:text-white transition-colors duration-500 absolute top-[450px] left-[20px] font-medium "> Upload File</button>
          </Link>
         
        </div>
       <div className="">
        <Ball/>
       
         {/* //Objects */}
       </div>
      
    </div>
   
    </>
  )
}