

import Hero from "@/components/hero";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


export default function Home() {
  return (
  <div className="">
    <div className="">
  
     <Hero/> 

   {/* feature section */}

   <div>
    <h2 className="font-bold text-3xl">Everything you need to manage our Image and video</h2>

    <div>
      <Card>
        <CardContent>
            <h3>feature title</h3>
            <p>feature description</p>
        </CardContent>
      </Card>
    </div>
   </div>
    </div>
  </div>
  );
}
