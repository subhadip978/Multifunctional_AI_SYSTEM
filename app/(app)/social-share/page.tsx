"use client"



import React,{useEffect,useState,useRef} from 'react'

import {CldImage} from 'next-cloudinary'

const socialFormats={
	"Instagram Square (1:1)":{width:1080, height:1080, aspectRatio:"1:1"},
	"Twitter Header":{width:1500,height:500,aspectRatio:"3:1"},

}
type socialFormat= keyof typeof socialFormats

export default function page(){

	const [uploadedImage,setUploadedImage]=useState<string | null>(null);
	const [selectedFormat,setSelectedFormat]=useState<socialFormat>("Instagram Square (1:1)")
	const[isTransforming,setTransforming]=useState(false)
	const [isUploading,setIsUploading]=useState(false);
	const imageRef= useRef<HTMLImageElement>(null);



	useEffect(()=>{
		if(uploadedImage){
			setTransforming(true);
		}


	},[selectedFormat,uploadedImage])



	const handleFileUpload=async(e:React.ChangeEvent<HTMLInputElement>)=>{
		const file=e.target.files?.[0];
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
			setUploadedImage(data.publicId);

		} catch (error) {
			console.log(error);
			
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


	}

	return (
		<div>
			<h1>
			SOCIAL MEDIA IMAGE CREATOR
				</h1>

				<div>
					<h2>
						Upload an image
					</h2>

					<div>

						<input type="file" 
						name=""
						 id="" 
						 onChange={(e)=>handleFileUpload(e)}
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
							<div>
								<h2>
									SELECT SOCIAL MEDIA FORMAT
								</h2>

								<div>
									<select 
									name=""		
									 id=""
									 onChange={(e)=>setSelectedFormat(e.target.value as socialFormat)}
									 >
										{
											Object.keys(socialFormats).map((format)=>(
												<option value={format}>
													{format}
												</option>
											))
										}

									 </select>
								</div>
							
						
						


				<div>
					{
						isTransforming && (
							<div>
								loading
							</div>

						)
					}

<CldImage
                        width={socialFormats[selectedFormat].width}
                        height={socialFormats[selectedFormat].height}
                        src={uploadedImage}
                        sizes="100vw"
                        alt="transformed image"
                        crop="fill"
                        aspectRatio={socialFormats[selectedFormat].aspectRatio}
                        gravity='auto'
                        ref={imageRef}
                        onLoad={() => setTransforming(false)}
                        />
				</div>
				</div>
				)} 


		</div>
	)
}