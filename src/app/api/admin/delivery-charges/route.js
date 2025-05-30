// src/app/api/admin/delivery-charges/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import DeliveryCharge from "@/models/DeliveryCharge";

export async function GET() {
    await dbConnect();
    const rules = await DeliveryCharge.find().sort({ max: 1 });
    return NextResponse.json(rules);
}

export async function POST(request) {
    await dbConnect();
    const body = await request.json();
    const { max, charge } = body;

    if (max == null || charge == null) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const rule = await DeliveryCharge.create({ max, charge });
    return NextResponse.json(rule, { status: 201 });
}