import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

// In production, this would be a database operation
const auditLog: Array<{
  id: string
  submissionId: string
  adminId: string
  adminName: string
  action: string
  timestamp: string
  oldValue: string
  newValue: string
}> = []

function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as any
  } catch (error) {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    const { submissionId, comments } = await request.json()

    if (!submissionId) {
      return NextResponse.json({ message: "Submission ID is required" }, { status: 400 })
    }

    // In production, you would:
    // 1. Update the submission in the database
    // 2. Log the change in an audit table
    // 3. Return the updated submission

    // For demo purposes, we'll simulate the update
    const auditEntry = {
      id: `audit_${Date.now()}`,
      submissionId,
      adminId: decoded.userId,
      adminName: decoded.username,
      action: "UPDATE_COMMENTS",
      timestamp: new Date().toISOString(),
      oldValue: "", // In production, fetch the old value from database
      newValue: comments || "",
    }

    auditLog.push(auditEntry)

    // Simulate database update delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json({
      message: "Comments updated successfully",
      updatedAt: new Date().toISOString(),
      updatedBy: decoded.username,
    })
  } catch (error) {
    console.error("Update comments error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
