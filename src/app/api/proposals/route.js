import { NextResponse } from 'next/server';
import prisma from '../../../lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const jobId = parseInt(body.jobId);
    const freelancerId = parseInt(body.freelancerId);

    // Check if a proposal already exists for this job by this freelancer
    const existingProposal = await prisma.proposal.findFirst({
      where: {
        jobId: jobId,
        freelancerId: freelancerId,
      },
    });

    if (existingProposal) {
      // If rejected, allow resubmission by updating status to PENDING
      if (existingProposal.status === 'REJECTED') {
        const updatedProposal = await prisma.proposal.update({
          where: { id: existingProposal.id },
          data: {
            status: 'PENDING',
            message: body.message || '',
            bidAmount: parseFloat(body.bidAmount) || 0,
          },
        });
        return NextResponse.json(updatedProposal, { status: 200 });
      } else {
        // Already submitted and not rejected
        return NextResponse.json({ error: "Proposal already submitted" }, { status: 400 });
      }
    }

    // Create new proposal
    const newProposal = await prisma.proposal.create({
      data: {
        jobId: jobId,
        freelancerId: freelancerId,
        message: body.message || '',
        bidAmount: parseFloat(body.bidAmount) || 0,
        status: 'PENDING',
      },
    });
    return NextResponse.json(newProposal, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error submitting proposal" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const proposals = await prisma.proposal.findMany({
      include: {
        job: true,
        freelancer: true,
      },
    });
    return NextResponse.json(proposals);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching proposals" }, { status: 500 });
  }
}