import { NextResponse } from "next/server";
import prisma from "../../../../lib/db";

export async function PATCH(req, { params }) {
  try {
    const resolvedParams = await params;
    const proposalId = resolvedParams.proposalId;
    const { status } = await req.json();

    console.log('Updating proposal:', proposalId, 'to status:', status);

    if (!['ACCEPTED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updatedProposal = await prisma.proposal.update({
      where: { id: parseInt(proposalId) },
      data: { status },
      include: {
        job: true,
        freelancer: true,
      },
    });

    return NextResponse.json(updatedProposal);
  } catch (error) {
    console.error('Error updating proposal:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const resolvedParams = await params;
    const proposalId = resolvedParams.proposalId;

    // Only allow deletion of non-accepted proposals
    const proposal = await prisma.proposal.findUnique({
      where: { id: parseInt(proposalId) },
    });

    if (!proposal) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
    }

    if (proposal.status === 'ACCEPTED') {
      return NextResponse.json({ error: "Cannot delete accepted proposals" }, { status: 400 });
    }

    await prisma.proposal.delete({
      where: { id: parseInt(proposalId) },
    });

    return NextResponse.json({ message: "Proposal deleted successfully" });
  } catch (error) {
    console.error('Error deleting proposal:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
