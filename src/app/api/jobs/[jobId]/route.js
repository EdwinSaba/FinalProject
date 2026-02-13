import { NextResponse } from "next/server";
import prisma from "../../../../lib/db";

export async function DELETE(req, { params }) {
  try {
    const resolvedParams = await params;
    const jobId = parseInt(resolvedParams.jobId);

    // Check if job has any accepted proposals
    const acceptedProposals = await prisma.proposal.findMany({
      where: {
        jobId: jobId,
        status: 'ACCEPTED'
      }
    });

    if (acceptedProposals.length > 0) {
      return NextResponse.json({ error: "Cannot delete job with accepted proposals" }, { status: 400 });
    }

    // Delete the job (proposals will cascade delete due to schema)
    await prisma.job.delete({
      where: { id: jobId },
    });

    return NextResponse.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
