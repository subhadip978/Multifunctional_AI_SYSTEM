import React,{useEffect,useState,useRef} from 'react'







const page = () => {


		const [doc,setDoc]=useState(null);

		const [uploading,setUploading]=useState(false);

		const handleFileUplaod=(e: React.ChangeEvent<HTMLInputElement>)=>{

			const file= e.target.files?.[0];
			if(!file ) return ;
			const formdata= new FormData();
			formdata.append('file',file);

			//make api call that should submit the pdf file in database 
			setUploading(true);



		}

		const queryHandler=()=>{

		}




  return (
	<div>

		<div>e

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