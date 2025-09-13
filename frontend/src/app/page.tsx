import Navbar from "./components/navbar"
import Ball from "./components/ball"
export default function Home(){
  return(
    <>
    <Navbar/>
    <div className="p-10 flex min-h-screen ">
  
        <div className="w-[940px] relative">
          <h1 className="text-[150px] absolute top-[150px]  font-medium ">Data<span className="text-green-500">Charm</span></h1>
          <h1 className="text-[60px] absolute top-[350px] text-sky-500 hover:text-green-600 transition-colors duration-500 font-medium "> Tool For Data Preview</h1>
          <button className="rounded-2xl w-50 h-15 text-2xl bg-white hover:bg-green-600 text-black absolute top-[450px] left-[30px] "> Upload Files</button>
        </div>
       <div className="">
        <Ball/>
       
         {/* //Objects */}
       </div>
      
    </div>
   
    </>
  )
}