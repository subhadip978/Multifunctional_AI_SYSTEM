"use client"
import React, { useCallback, useEffect, useState } from 'react'
import {Video} from '@/types/index'
import axios from 'axios'
import VideoCard from '@/components/VideoCard';



export default function page(){
	const[videos,setvideos]=useState<Video[]>([]);
	const [docs,setDocs]=useState();
	const[loading,setLoading]=useState();

	const fetchVideos=async()=>{
		try {
			const response = await axios.get("/api/videos")
			setvideos(response.data)

			
		} catch (error) {			
			console.log(error);
			throw new Error("Unexpected response format");			
			
		}
	}



	useEffect(()=>{
		fetchVideos();


	},[])

	const handleDownload=useCallback((url:string,title:string)=>{
	

			const link= document.createElement("a");
			link.href=url;
			link.setAttribute("download",`${title}.mp4`);
			document.appendChild(link);
			link.click();
			document.removeChild(link);

			

			
		
	},[])

	return (

		<div>
			<div>
				<h1>HOMEPAGE</h1>
				{videos.length ===0?(
					<div>
						no videos available
					</div>

				):(
					<div >
					<h1>video is available</h1> 
					{
						videos.map((video)=>{
							return(

							<div className=''>
								<VideoCard 
								key={video.id}
								video={video}
								onDownload={handleDownload}

								/>
							</div>
							)
						})
					}
					</div>

				)}


			</div>




		</div>
	)
}