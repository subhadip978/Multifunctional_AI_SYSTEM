import { Images } from "lucide-react"
import { Loader } from 'lucide-react';
import { FileVideo } from 'lucide-react';



export const featuresData=[
	{
		icon:<Images  className="text-[#430cc6]"/>,
		title:"Advanced image editing",
		description:"You can remove image backeground, crop image just one click"
	},
	{icon: <FileVideo className="text-[#430cc6]"/>,
		title:"Video compressing",
		description:"Dont worry , minimize the size of your video"
	},
	{
		icon:<Loader className="text-[#430cc6]"/>
		,
		title:"Wait a minute",
		description:"many more coming soon"
	}
]