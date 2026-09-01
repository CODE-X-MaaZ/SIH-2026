import { NextResponse } from "next/server";
import { understandComplaint } from "@/lib/ai/complaint-understanding";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        if (!body || !body.text) {
            return NextResponse.json({ success: false, error: "Missing text in request" }, { status: 400 });
        }

        const data = await understandComplaint(body.text);

        return NextResponse.json({
            success: true,
            data
        });
    } catch (error) {
        console.error("Endpoint error:", error);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}
