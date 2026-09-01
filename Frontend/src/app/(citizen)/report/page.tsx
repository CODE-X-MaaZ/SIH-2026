"use client";

import Link from "next/link";
import { Mic, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getCurrentLocation, LocationResult } from "@/lib/location";

function ReportForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialMode = searchParams.get('mode') || 'voice';
    const [mode, setMode] = useState(initialMode);

    // Voice support
    const [isVoiceSupported, setIsVoiceSupported] = useState(true);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const recognitionRef = useRef<any>(null);

    // Text & generic state
    const [text, setText] = useState("");
    const [location, setLocation] = useState<LocationResult | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        // Load preserved initial text if "Edit report" was clicked
        const preservedReport = sessionStorage.getItem("nagrik_draft_report");
        if (preservedReport) {
            setText(preservedReport);
            setTranscript(preservedReport);
            setMode("text"); // switch to text mode if editing
        }

        // Check voice support
        if (typeof window !== "undefined") {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (!SpeechRecognition) {
                setIsVoiceSupported(false);
                if (initialMode === "voice") {
                    setMode("text");
                }
            } else {
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = true;
                recognitionRef.current.interimResults = true;
                recognitionRef.current.lang = 'en-IN';

                recognitionRef.current.onresult = (event: any) => {
                    let currentTranscript = "";
                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        currentTranscript += event.results[i][0].transcript;
                    }
                    setTranscript(currentTranscript);
                    setText(currentTranscript); // sync
                };

                recognitionRef.current.onerror = (event: any) => {
                    console.error("Speech recognition error", event.error);
                    setIsListening(false);
                };

                recognitionRef.current.onend = () => {
                    setIsListening(false);
                };
            }
        }

        // Load location
        getCurrentLocation().then(loc => setLocation(loc)).catch(console.error);

    }, [initialMode]);

    const toggleListening = () => {
        if (!recognitionRef.current) return;
        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            setTranscript("");
            setText("");
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const submitReport = async () => {
        if (!text.trim()) return;

        setIsProcessing(true);

        try {
            const res = await fetch("/api/complaints/understand", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: text.trim(),
                    latitude: location?.latitude,
                    longitude: location?.longitude
                })
            });

            const data = await res.json();

            if (data.success) {
                sessionStorage.setItem("nagrik_understanding", JSON.stringify(data.data));
                sessionStorage.setItem("nagrik_draft_report", text.trim());
                if (location) {
                    sessionStorage.setItem("nagrik_draft_location", JSON.stringify(location));
                }
                router.push("/report/review");
            } else {
                console.error("AI understanding failed", data.error);
                setIsProcessing(false);
            }
        } catch (error) {
            console.error("Submission error", error);
            setIsProcessing(false);
        }
    };

    if (isProcessing) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] max-w-sm mx-auto">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <h2 className="text-xl font-semibold text-gray-900">Understanding your report...</h2>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 py-4 max-w-sm mx-auto h-[calc(100vh-100px)]">
            <div>
                <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">
                    {mode === 'voice' ? 'Tell us what happened' : 'What is the problem?'}
                </h1>
            </div>

            {mode === 'voice' ? (
                <div className="flex-1 flex flex-col items-center justify-start mt-8 gap-8">
                    {!isVoiceSupported ? (
                        <div className="text-center space-y-4">
                            <p className="text-gray-600">Voice reporting isn&apos;t available on this device.</p>
                            <Button variant="outline" onClick={() => setMode("text")}>Type instead</Button>
                        </div>
                    ) : (
                        <>
                            <div className="relative">
                                {isListening && <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>}
                                <button
                                    onClick={toggleListening}
                                    className={`w-32 h-32 ${isListening ? 'bg-primary' : 'bg-gray-200'} rounded-full flex items-center justify-center shadow-xl relative z-10 transition-colors cursor-pointer`}
                                >
                                    <Mic className={`w-12 h-12 ${isListening ? 'text-white animate-pulse' : 'text-gray-500'}`} />
                                </button>
                            </div>

                            <div className="text-center space-y-2 min-h-[100px]">
                                {isListening ? (
                                    <>
                                        <p className="text-xl font-semibold text-gray-900">Listening...</p>
                                        <p className="text-gray-500">Speak naturally in your language.</p>
                                        <p className="font-medium text-primary mt-2">{transcript}</p>
                                    </>
                                ) : (
                                    transcript ? (
                                        <div className="space-y-4">
                                            <p className="text-gray-500">We heard:</p>
                                            <p className="font-medium text-lg italic text-gray-900">&quot;{transcript}&quot;</p>
                                            <Button variant="outline" onClick={() => setMode("text")} size="sm">Edit manually</Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <p className="text-gray-500">Tap to start speaking</p>
                                            <Button variant="link" onClick={() => setMode("text")} className="text-gray-500">Type instead</Button>
                                        </div>
                                    )
                                )}
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <div className="flex-1 flex flex-col gap-4">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full h-40 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-base resize-none"
                        placeholder="Example: &quot;There has been no water in our area since yesterday.&quot;"
                    ></textarea>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center gap-3">
                        <div className="text-xl">📍</div>
                        <div>
                            {location ? (
                                <>
                                    <p className="font-semibold text-gray-900 text-sm">Location detected</p>
                                    <p className="text-gray-500 text-sm">{location.displayName}</p>
                                </>
                            ) : (
                                <p className="font-semibold text-gray-900 text-sm">Locating...</p>
                            )}
                        </div>
                        <Button variant="link" className="ml-auto text-sm px-0">Change</Button>
                    </div>

                    <Button variant="outline" className="h-14 border-dashed border-2 rounded-xl text-gray-600 bg-gray-50">
                        + Add a photo (optional)
                    </Button>
                </div>
            )}

            <div className="mt-auto pt-4">
                <Button
                    className="w-full h-14 text-lg rounded-xl"
                    variant={mode === 'voice' && !transcript ? "secondary" : "default"}
                    onClick={submitReport}
                    disabled={!text.trim() || isProcessing}
                >
                    Continue
                </Button>
            </div>
        </div>
    );
}

export default function ReportPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
            <ReportForm />
        </Suspense>
    );
}
