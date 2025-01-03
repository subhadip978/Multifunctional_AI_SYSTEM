import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {v2 as cloudinary} from 'cloudinary'


const prisma= new PrismaClient();

cloudinary.config({ 
	cloud_name:  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME , 
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
	console.log("userid is ",userId)

	try {

		const formData=await  request.formData();
		
	const file =formData.get("file") as File;
	const title= formData.get("title") as string;
	const description= formData.get("description") as string;
	const originalSize= formData.get("originalSize") as string

	if(!file){
		return NextResponse.json({error:"file not found"},{status:400})
	}

	const bytes= await file.arrayBuffer()
	const buffer=Buffer.from(bytes);
	console.log("started upload to cloudinary")
	
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
	stream.end(buffer);
})

const video= await prisma.video.create({
	data:{
		title,
		description,
		publicId:result.public_id,
		originalSize:originalSize,
		compressedSize:String(result.bytes),
		duration:result.duration||0


	}
})
return NextResponse.json({video},{status:201});

} catch (error) {
	console.log("Error uploading video",error);
	NextResponse.json({error:"Internal server err"},{status:500})
	
}
}


