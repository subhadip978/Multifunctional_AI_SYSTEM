import axios from 'axios';
import { useRouter } from 'next/router';
import React,{useState} from 'react'




const VideoUpload = () => {

  const [file,setFile]=useState<File |null>(null);
  const [title,setTitle]=useState("");
  const [description,setDescription]=useState("");


  const router= useRouter()


  const MAX_FILE_SIZE=70*1024*1024

  const handleSubmit=async(e:React.FormEvent)=>{
    e.preventDefault()
    if(!file) return ;
    if(file.size>MAX_FILE_SIZE){
      return ;
    }

    const formData= new FormData();
    formData.append('file',file);
    formData.append('title',title);
    formData.append('description',description);
    formData.append('originalSize',file.size.toString());

      try {
        await axios.post("/api/video-upload",{
          formData
        })
        
      } catch (error) {
        console.log(error);
        
      }


  }



  return (

	<div>
    VideoUpload

    <form onSubmit={handleSubmit} action="">

      <input
       type="text"
       name="" 
       id="" 
       value={title}
       onChange={(e)=>setTitle(e.target.value)}
       />

      <input type="text"
       name=""
        id="" 
        onChange={(e)=>setDescription(e.target.value)}
        />

        <input 
        type="file"
        accept="video/"
         name="" id=""
         onChange={(e)=>setFile(e.target.files?.[0] ||null)} />


         <button type="submit">
          Upload video
         </button>
    </form>
    
    
    </div>
  )
}

export default VideoUpload