

"use client"
import React,{useEffect,useState,useRef} from 'react'







const page = () => {


		const [doc,setDoc]=useState(null);

		const [uploading,setUploading]=useState(false);
		const[title,setTitle]=useState("");
		const[description,setDescription]=useState("");

		const handleFileUplaod=(e: React.ChangeEvent<HTMLInputElement>)=>{

			const file= e.target.files?.[0];
			if(!file ) return ;
			const formData= new FormData();
			formData.append('file',file);
			formData.append("title",title);
			formData.append("description",description);

			setUploading(true);

			try {

				// call api   await axios.post("/api/doc",formdata);
				
				
			} catch (error) {
				
			}finally{

			}



		}

		const queryHandler=()=>{

		}




  return (
	<div>

		<div>
			<input type="text" name="title" id=""    onChange={(e)=>setTitle(e.target.value)}/>
			<input type="text" name="description" id="" onChange={(e)=>setDescription(e.target.name)}/>
			

			<input type="file"
			 name="" 
			 id=""
			 onChange={(e)=>handleFileUplaod(e)}
			  />




		</div>
	</div>
  )
}

export default page