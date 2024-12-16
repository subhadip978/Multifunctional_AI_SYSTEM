


import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse,NextRequest } from 'next/server';


const prisma=new PrismaClient();


cloudinary.config({ 
	cloud_name:  process.env.CLOUDINARY_CLOUD_NAME , 
	api_key:     process.env.CLOUDINARY_API_KEY , 
	api_secret:  process.env.CLOUDINARY_API_SECRET
});

interface CloudinaryUploadResult{
		public_id:string;
		// bytes:number;
        [key:string]:any

}

// (async function() {

    
 
//      const uploadResult = await cloudinary.uploader
//        .upload(
//            'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//                public_id: 'shoes',
//            }
//        )
//        .catch((error) => {
//            console.log(error);
//        });
    
//     console.log(uploadResult);
    
//     // Optimize delivery by resizing and applying auto-format and auto-quality
//     const optimizeUrl = cloudinary.url('shoes', {
//         fetch_format: 'auto',
//         quality: 'auto'
//     });
    
//     console.log(optimizeUrl);
    
//     // Transform the image: auto-crop to square aspect_ratio
//     const autoCropUrl = cloudinary.url('shoes', {
//         crop: 'auto',
//         gravity: 'auto',
//         width: 500,
//         height: 500,
//     });
    
//     console.log(autoCropUrl);    
// })();





export async function POST(request:NextRequest){

	const {userId}=await auth();
	if(!userId){
		return NextResponse.json({error:"unauthorized"},{status:401})
	}

	try {

		const formData= request.formData();
		const file=  (await formData).get("file") as File | null;

		if(!file){
			return NextResponse.json({error:"File not found"},{status:400})
		}
		const bytes=await file.arrayBuffer();
		const buffer= Buffer.from(bytes);

       const result= await new Promise<CloudinaryUploadResult>(
            (resolve,reject)=>{
             const uploadStream=   cloudinary.uploader.upload_stream(
                    {folder:"next-clouudinary-uploads"},
                    (error,result)=>{
                        if(error)reject(error);
                        else resolve(result as CloudinaryUploadResult)

                    }
                )
                uploadStream.end(buffer)


            }
        )
        return NextResponse.json({result},{status:200})
		
	} catch (error) {
        console.log("Upload image failed",error);
		
	}


}

// grab form data ---pick  a file ----convert in buffer