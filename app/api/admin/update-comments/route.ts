import { type NextRequest, NextResponse } from "next/server"

// Simple token verification
function verifyToken(token: string) {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null

    const payload = JSON.parse(atob(parts[1]))

    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }

    return payload
  } catch (error) {
    return null
  }
}

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

    const body = await request.json()
    const { submissionId, comments } = body

    if (!submissionId) {
      return NextResponse.json({ message: "Submission ID is required" }, { status: 400 })
    }

    // Create audit log entry
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
      auditId: auditEntry.id,
    })
  } catch (error) {
    console.error("Update comments error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
