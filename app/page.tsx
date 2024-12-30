

import Hero from "@/components/hero";
import Image from "next/image";
import { Images } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { featuresData } from "./data/landing";


export default function Home() {
  return (
  <div className="">
    <div className="">
  
     <Hero/> 

   {/* feature section */}

   <div className="py-20">
    <h2 className="font-bold text-3xl text-center m-4">Everything you need to manage our Image and video</h2>

    <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8">
      {
        featuresData.map((feature,index)=>{
          return(
      <Card className="p-6">
        <CardContent className="space-y-6 pt-4">
        {feature.icon} 
            <h3 className="text-xl fotn-semibold">{feature.title}</h3>
            <p  className="text-gray-600">{feature.description}</p>
        </CardContent>
      </Card>

          )
        })
      }
    </div>
   </div>
    </div>
  </div>
  );
}
