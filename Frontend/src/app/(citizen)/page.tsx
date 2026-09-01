import Link from "next/link";
import { Mic, Camera, Type, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CitizenHome() {
  return (
    <div className="flex flex-col gap-6 py-6 max-w-sm mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 leading-tight">
          Report a problem in your area
        </h1>
        <p className="text-lg text-gray-600">
          Tell us what happened. We&apos;ll figure out the rest.
        </p>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        {/* Primary Action */}
        <Link href="/report" passHref className="w-full">
          <Button className="w-full h-32 rounded-2xl flex flex-col gap-3 text-lg bg-primary hover:bg-primary/90 text-white shadow-lg transition-transform active:scale-95">
            <Mic className="w-8 h-8" />
            <div className="flex flex-col items-center">
              <span className="font-semibold">Speak to us</span>
              <span className="text-sm opacity-90">बोलकर बताएं</span>
            </div>
          </Button>
        </Link>

        <div className="grid grid-cols-2 gap-4">
          <Link href="/report?mode=photo" passHref>
            <Button
              variant="outline"
              className="w-full h-24 rounded-2xl flex flex-col gap-2 bg-white hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors shadow-sm"
            >
              <Camera className="w-6 h-6" />
              <span>Take a photo</span>
            </Button>
          </Link>

          <Link href="/report?mode=text" passHref>
            <Button
              variant="outline"
              className="w-full h-24 rounded-2xl flex flex-col gap-2 bg-white hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors shadow-sm"
            >
              <Type className="w-6 h-6" />
              <span>Type instead</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <Link href="/track" passHref>
          <Button variant="ghost" className="w-full text-gray-600 hover:text-gray-900 justify-center h-14 text-base rounded-xl">
            <MapPin className="w-5 h-5 mr-2 text-gray-400" />
            Track my complaint
          </Button>
        </Link>
      </div>
    </div>
  );
}
