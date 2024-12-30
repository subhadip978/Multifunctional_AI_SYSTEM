import { getCldImageUrl, getCldVideoUrl } from 'next-cloudinary'
import React,{useState,useEffect,useCallback} from 'react'

import {Video } from '@/types/index'

import {filesize } from "filesize";

interface VideoCardProps{
	video:Video;
	onDownload:(url:string,title:string)=>void;

}

const VideoCard:React.FC<VideoCardProps> = ({video,onDownload}) => {

	const [isHovered,setIsHovered]=useState(false);
	const [previewError,setPreviewError]=useState(false);



			const getThumbNailUrl=useCallback((publicId:string)=>{
			return getCldImageUrl({
				src:publicId,
					width: 400,
					height: 225,
					crop:"fill",					
					gravity: "auto",
					format: "jpg",
					quality: "auto",
					assetType: "video"
				  
			})


		},[])

		const getFullVideoUrl=useCallback((publicId:string)=>{
			return getCldVideoUrl({
				src: publicId,
				width: 1920,
				height: 1080,
			})
		},[])


		const getPreviewVideoUrl=useCallback((publicId:string)=>{
				return getCldVideoUrl({
					src:publicId,
					width:400,
					height:225,
					rawTransformations:["e_preview:duration_15:max_seg_9:min_seg_dur_1"]

				})
		},[])


		const formatSize=useCallback((size:number)=>{
			return filesize(size) 


		},[])

		const formatDuration=useCallback((seconds:number)=>{

			const mm=Math.floor (seconds/60) ;
			const ss= Math.round(seconds%60) ;
			return `${mm}:${ss.toString().padStart(2,"0")}`

		},[])

		const compressionPercentage=Math.round((
			1 - video.compressedSize/video.originalSize
		)*100)



  return (
	<div className=' border-2  card'
	 onMouseEnter={()=>setIsHovered(true)}
	 onMouseLeave={()=>setIsHovered(false)}>		
			<figure className='border-2 border-slate-600 w-60 '>
		{
			isHovered?(
					<video
					src={getPreviewVideoUrl(video.publicId)}
					autoPlay
					muted
					
					className='w-full h-full  object-cover'
					/>
				
			):(
				<>
				<img src={getThumbNailUrl(video.publicId)} alt="" className='w-full h-full  object-cover' />
				</>
			)
		}
		</figure>
		<div>
			video duration{formatDuration(video.duration)}
		</div>

		<div>
			video description
		</div>

		<p>Uploaded few days ago</p>

		<div>
			<span>original size{formatSize(video.originalSize)} </span>
			<span>compressed size {formatSize(video.compressedSize)} </span>

			<p>compressed percentage {compressionPercentage}%</p>

			
			<button onClick={()=>onDownload(getFullVideoUrl(video.publicId),video.title)}>DOWNLOAD</button>
		</div>

	</div>
  )
}

export default VideoCard


//When you pass a video public ID inside getCldImageUrl(), it typically generates a thumbnail URL for that video. Cloudinary provides the ability to create thumbnails from video files using their transformation API.