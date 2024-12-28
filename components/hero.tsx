
"use client"
import Link from 'next/link'
// conatin with frontend logic whcih not running in server
import React, { useEffect, useRef } from 'react'
import { Button } from './ui/button'
import Image from 'next/image'

const Hero = () => {
	const imageRef=useRef<HTMLImageElement | null>(null);

	useEffect(()=>{
		const imageElement=imageRef.current;
		const handleScroll=()=>{
			 if (!imageElement) return;
			const scrollPosition=window.scrollY;
			console.log("scroll position",scrollPosition)
			const scrollThreeshold=100;
					if(scrollPosition >scrollThreeshold){
						imageElement.classList.add("scrolled")
					}else{
						imageElement.classList.remove("scrolled")
					}
		}
		window.addEventListener("scroll",handleScroll);
		return ()=>window.removeEventListener("scroll",handleScroll)
	},[])




  return (
	<div className='px-4 flex justify-center items-center  mt-12'>
		<div className='flex flex-col justify-center items-center mx-auto '>
			<h1 className='text-5xl bg-gradient-to-br from-blue-600 to-purple-600 font-extrabold text-transparent bg-clip-text'>Multifunctional AI SYSTEM</h1>
			<p className='text-xl text-gray-600 mb-8 '>
				An AI powered tool that helps to play with image and video
			</p>

			<div>
				<Link href="/home">
					<Button>
						Get started
						
					</Button>
				</Link>
			</div>

			<div className='hero-image-wrapper'>
				<div ref={imageRef} className='hero-image'>
					<Image
					src='/banner.jpeg'
					width={1280}
					height={720}
					className='rounded-lg mx-auto'
					alt="Dashboard Preview"
					
					/>
				</div>
			</div>
		</div>


	</div>
  )
}

export default Hero