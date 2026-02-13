import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { title, description, budget, createdBy } = await req.json();
    const newJob = await prisma.job.create({
      data: {
        title,
        description,
        budget: parseFloat(budget),
        createdBy: parseInt(createdBy),
      },
    });
    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  const jobs = await prisma.job.findMany({ include: { author: true } });
  return NextResponse.json(jobs);
}