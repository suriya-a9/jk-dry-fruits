// src/app/api/admin/delivery-charges/[id]/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import DeliveryCharge from "@/models/DeliveryCharge";

export async function PUT(request, { params }) {
    await dbConnect();
    const body = await request.json();
    const { max, charge } = body;

    const updated = await DeliveryCharge.findByIdAndUpdate(
        params.id,
        { max, charge },
        { new: true }
    );

    return NextResponse.json(updated);
}

export async function DELETE(request, { params }) {
    await dbConnect();
    await DeliveryCharge.findByIdAndDelete(params.id);
    return new NextResponse(null, { status: 204 });
}