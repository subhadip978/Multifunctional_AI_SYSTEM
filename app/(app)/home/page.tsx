
import React, { useEffect, useState } from 'react'

import {Video} from '@/types/index'
import axios from 'axios'



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

	const handleDownload=()=>{
		try {

			const link= document.createElement("a");

			

			
		} catch (error) {
			
		}
	}

	return (

		<div>Home
			<div>
				<h1>HOMEPAGE</h1>
				{videos.length ===0?(
					<div>
						no videos available
					</div>

				):(
					<>
					{
						videos.map(()=>{
							<div>
								video
							</div>
						})
					}
					</>

				)}


			</div>




		</div>
	)
}