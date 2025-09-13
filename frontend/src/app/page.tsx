import Navbar from "./components/navbar"
import Ball from "./components/ball"
export default function Home(){
  return(
    <>
    <Navbar/>
    <div className="p-10 flex min-h-screen ">
  
        <div className="w-[940px] relative">
          <h1 className="text-[150px] absolute top-[150px]  font-medium ">Data<span className="text-green-500">Charm</span></h1>
          <h1 className="text-[60px] absolute top-[350px]  hover:text-green-500 transition-colors duration-500 font-medium"> Tool For <span className="text-yellow-300">Data Preview</span> </h1>
          <button className="rounded-2xl w-50 h-15 text-2xl bg-blue-500  hover:bg-yellow-400 hover:text-black transition-colors duration-500 absolute top-[450px] left-[20px] "> Upload Files</button>
        </div>
       <div className="">
        <Ball/>
       
         {/* //Objects */}
       </div>
      
    </div>
   
    </>
  )
}