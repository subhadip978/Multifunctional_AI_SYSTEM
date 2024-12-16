import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {v2 as cloudinary} from 'cloudinary'


const prisma= new PrismaClient();

cloudinary.config({ 
	cloud_name:  process.env.CLOUDINARY_CLOUD_NAME , 
	api_key:     process.env.CLOUDINARY_API_KEY , 
	api_secret:  process.env.CLOUDINARY_API_SECRET
});


interface CloudinaryResult{
	public_id:string;
	bytes:number;
	duration?:number;
	[key:string]:any;

}

export  async function POST(request:NextRequest){

	const {userId}=await auth();
	if(!userId){
		return NextResponse.json({error:"UnAthorized"},{status:401})
	}

	try {

		const formData=await  request.formData();
		
	const file =formData.get("file") as File;
	const title= formData.get("title");
	const description= formData.get("description");
	const originalSize= formData.get("originalSize")

	if(!file){
		return NextResponse.json({error:"file not found"},{status:400})
	}

	const bytes= await file.arrayBuffer()
	const buffer=Buffer.from(bytes);
	
	const result = await new Promise<CloudinaryResult>((resolve,reject)=>{		
		const stream=cloudinary.uploader.upload_stream(
			
			{	resource_type:"video",
				folder:"video-upload",
				transformation:[
					{quality:"auto",fetch_format:"mp4"}
				]

			},
			(error,result)=>{
				if(error) reject(error)
				else resolve(result as CloudinaryResult);			
	})
	stream.end(Buffer);
})

const video= await prisma.video.create({
	data:{
		title,
		description,
		publicId:result.public_id,
		originalSize:String(result.bytes),
		duration:result.duration


	}
})
return NextResponse.json({},{status:201});



} catch (error) {
	console.log(error);
	
}
}


