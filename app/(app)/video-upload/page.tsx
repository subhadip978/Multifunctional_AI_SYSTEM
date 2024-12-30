
"use client"
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React,{useState} from 'react'







const VideoUpload = () => {

  const [file,setFile]=useState<File |null>(null);
  const [title,setTitle]=useState("");
  const [description,setDescription]=useState("");

   const[isUploading,setIsUploading]= useState(false);

  const router= useRouter();


  const MAX_FILE_SIZE=70*1024*1024

  const handleSubmit=async(e:React.FormEvent)=>{
    e.preventDefault()
    if(!file) return ;
    if(file.size>MAX_FILE_SIZE){
      return ;
    }

      setIsUploading(true)
    const formData= new FormData();
    formData.append('file',file);
    formData.append('title',title);
    formData.append('description',description);
    formData.append('originalSize',file.size.toString());

      try {
        await axios.post("/api/video-upload",formData)
        
      } catch (error) {
        console.log(error);
        
      }finally{
        setIsUploading(true)
      }


  }



  return (

	<div className='text-dark-600 flex flex-col justify-center items-center'>
    <h1 className='font-bold md:text-6xl text-3xl text-dark-600'>Video Compresser</h1>

    <form onSubmit={handleSubmit} action="" className='flex  flex-col justify-center items-center gap-16 mt-6 w-full '>


<div className='flex flex-col w-full justify-center items-center'>

    <label htmlFor="title">Title</label>
      <input
       type="text"
       name="title" 
       id="" 
       value={title}
       className='w-2/3 rounded-md ring-1 ring-slate-500 px-3 py-2 text-sm border outline-none '

       onChange={(e)=>setTitle(e.target.value)}
       />
</div>

<div className='flex flex-col w-full justify-center items-center'>
  <label htmlFor="description">Description</label>

      <input type="text"
       name="description"
        id="" 
        className='w-full rounded-md ring-1 ring-slate-500 px-3 py-2 text-sm border outline-none '
        onChange={(e)=>setDescription(e.target.value)}
        />
</div>
<div className='flex flex-col w-full justify-center items-center'>
  <label htmlFor="video">Video</label>

        <input 
        type="file"
        accept="video/"
         name="video" id=""
         className='w-full rounded-md ring-1 ring-slate-500 px-3 py-2 text-sm border outline-none '
         onChange={(e)=>setFile(e.target.files?.[0] ||null)} />
</div>



         <button type="submit" className='bg-purple-700 p-2 rounded-lg'>
          Upload video
         </button>
    </form>
    
    
    </div>
  )
}

export default VideoUpload