import { type NextRequest, NextResponse } from "next/server"

// In production, this would be a database operation
const submissionsStore: any[] = []

export async function POST(request: NextRequest) {
  try {
    const submissionData = await request.json()

    // Add to mock database
    submissionsStore.push(submissionData)

    // Simulate database save delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json({
      message: "Submission saved successfully",
      id: submissionData.id,
    })
  } catch (error) {
    console.error("Save submission error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      submissions: submissionsStore,
      total: submissionsStore.length,
    })
  } catch (error) {
    console.error("Get submissions error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
