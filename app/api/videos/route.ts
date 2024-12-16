import { PrismaClient } from "@prisma/client";
import { NextRequest,NextResponse } from "next/server";


const prisma=new PrismaClient();

export async function GET(request:NextRequest){

	try{
			const videos=await prisma.video.findMany({

				orderBy:{createdAt:"desc"}
			})
			return NextResponse.json(videos) ;

	}catch(err){
		return NextResponse.json({err:"error in fetching videos"},{status:500})

	}
}