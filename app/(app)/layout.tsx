"use client"


import { SignedOut, useClerk, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'
import { LogOut } from 'lucide-react';

const sidebarItems=[
	{route:"/home",  label:"Home Page"},
	{route:"/social-share", label:"Social Share"},
	{route:"/video-upload", label:"Video Upload"},
	{route:"/document-upload",label:"DOC Upload"}
]

export default function AppLayout({
	children,
  }: Readonly<{
	children: React.ReactNode;
  }>){

	const pathname= usePathname();
	const {signOut}=useClerk();
	const { user } =  useUser();
    console.log("user is ",user)

	const handleSignout=async()=>{
		await signOut();
	}


  return (
	<div className='flex  flex-col '>
		{/* navbar */}
			<nav>
				<ul className='flex text-black justify-end gap-8'>
					<li>{user?.username || user?.emailAddresses[0].emailAddress}</li>
					<li><button onClick={handleSignout}>
					<LogOut />
						</button>
						  </li>
					<li></li>
				</ul>
			</nav>


			<div className='flex'>

	 <div className='flex  h-screen min-w-[200px] '>

			

		<ul className='flex flex-col space-y-6'>

		{
			sidebarItems.map((item)=>{
				const isActive= item.route ===pathname

				return (
				<li key={item.route} className={ `p-2 rounded-lg ${isActive ? 'bg-blue-gradient text-white':'text-gray-700' }`}>
					<Link href={item.route}>


						<span className=''>{item.label}</span>
					</Link>
				</li>
				)
				
  })
		}
		</ul>
	</div>
		<div className='flex-1 '>
		 {children} 
		</div>
		</div>
	</div>
  )
}


