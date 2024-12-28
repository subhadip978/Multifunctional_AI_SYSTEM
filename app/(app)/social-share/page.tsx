"use client"



import React,{useEffect,useState,useRef} from 'react'

import {CldImage} from 'next-cloudinary'
import Image from 'next/image'
import image from '@/public/logo.jpg'
// Image

const socialFormats={
	"Instagram Square (1:1)":{width:1080, height:1080, aspectRatio:"1:1"},
	"Twitter Header":{width:1500,height:500,aspectRatio:"3:1"},

}
type socialFormat= keyof typeof socialFormats

export default function page(){

	const [uploadedImage,setUploadedImage]=useState<string | null>(null);
	const [selectedFormat,setSelectedFormat]=useState<socialFormat>("Instagram Square (1:1)")
	const[isTransforming,setTransforming]=useState(false);
	const[transformed,setTransformed]=useState(false);
	const [isUploading,setIsUploading]=useState(false);
	const imageRef= useRef<HTMLImageElement>(null);



	useEffect(()=>{
		if(uploadedImage){
			setTransforming(true);
		}

	},[selectedFormat,uploadedImage])



	const handleFileUpload=async(e:React.ChangeEvent<HTMLInputElement>)=>{
		const file=e.target.files?.[0];
		console.log(file)
		if(!file) return ;
		setIsUploading(true);
		const formData= new FormData();
		formData.append("file",file);

		try {
		const response=	await fetch("/api/image-upload",{
				method:"POST",
				body:formData
			})

			if(!response.ok) throw new Error("Failed to upload image")
			
			const data=await response.json();
			console.log(data);
			setUploadedImage(data.publicId);
			console.log("successfull image uploaded",uploadedImage)

		} catch (error) {
			console.log(error);
			
		}finally{
            setIsUploading(false);
        }
	}

	const handleDownload=async()=>{
		if(!imageRef.current) return ;
		fetch(imageRef.current.src)
		.then((response)=>response.blob())
		.then((blob)=>{
			const url=window.URL.createObjectURL(blob);
			const link= document.createElement("a");
			link.href=url;
			link.download="image.png"
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
		
		})
		.catch((error) => console.error("Download failed:", error));


	}





	return (
		<div className='text-black flex flex-col gap-10  '>			

				<div className='flex flex-col gap-6 '>
				<h1 className='font-bold md:text-6xl text-3xl text-dark-600'>
						IMAGE RESIZE
					</h1>

					<div>
						<input type="file" 
						name=""
						 id="" 
						 onChange={(e)=>handleFileUpload(e)}
						 className='w-full rounded-md '

						 />
					</div>
					{
						isUploading &&(
							<div>
								progressbar
							</div>
						)
					}
					</div>


					{
						uploadedImage && (
							<div className=''>
							

								<div className='mb-4 '>
									<select 
									name=""		
									 id=""
									 onChange={(e)=>setSelectedFormat(e.target.value as socialFormat)}
									 className=''
									 >
										{
											Object.keys(socialFormats).map((format)=>(
												<option value={format} key={format}>
													{format}
												</option>
											))
										}

									 </select>
								</div>
							

				<div>					
					<div className=' flex gap-14 '>
						<div className='' >

						<h2 className='font-semibold md:text-2xl text-1xl text-dark-600'>
						Original Image
							</h2>


						 <CldImage
						width={300}
						height={300}
						sizes='50vw'
					 src={uploadedImage}
						// src={Img.src}
						alt="original image"
						gravity="auto"
						/> 
						
						</div>

					{
						transformed &&(
							<div className=' '>
								<h2 className='font-semibold md:text-3xl text-1xl text-dark-600'>
								   Transformed Image
							   </h2>
							    <CldImage
								   width={socialFormats[selectedFormat].width}
								   height={socialFormats[selectedFormat].height}
								   src={uploadedImage}
								//    sizes="50vw"
								   alt="transformed image"
								   crop="fill"
								   aspectRatio={socialFormats[selectedFormat].aspectRatio}
								   gravity='auto'
								   ref={imageRef}
								   onLoad={() => setTransforming(false)}
								   />  
								 
							</div>

						)
					}
				</div>
				</div>

				<div className='flex  flex-col gap-6 mt-4 '>
					<button className='bg-slate-800 p-2 w-full'
					onClick={()=>{
						setTransformed(true)
					}}>
						APPLY CHANGES
					</button>

					<button  className='w-full bg-slate-800' p-2
					onClick={handleDownload}>
						DOWNLOAD
					</button>
				</div>


				</div>
				)} 


		</div>
	)
}