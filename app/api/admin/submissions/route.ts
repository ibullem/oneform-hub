import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

// Demo submissions data (in production, this would be from a database)
const submissions = [
  {
    id: "sub_001",
    formType: "Application for Statement of Account",
    accountNumber: "1234567890",
    submittedAt: "2024-01-20T10:30:00Z",
    formData: {
      accountName: "John Doe",
      accountNumber: "1234567890",
      dateFrom: "2024-01-01",
      dateTo: "2024-01-31",
      purpose: "Embassy",
      authorization: true,
      signature: "John Doe",
    },
    officialComments: "Statement processed and sent to customer via email.",
    lastUpdatedBy: "System Administrator",
    lastUpdatedAt: "2024-01-20T14:30:00Z",
  },
  {
    id: "sub_002",
    formType: "E-Dispute Form",
    accountNumber: "1234567890",
    submittedAt: "2024-01-18T09:15:00Z",
    formData: {
      branch: "Victoria Island",
      name: "John Doe",
      accountNumber: "1234567890",
      phone: "08012345678",
      email: "john.doe@email.com",
      eProduct: "OnePay",
      disputeForm: "Funds Transfer",
      transactionDate: "2024-01-15",
      amount: "50000",
      authorization: true,
      signature: "John Doe",
    },
    officialComments: "Dispute investigated. Transaction reversed successfully.",
    lastUpdatedBy: "Branch Manager",
    lastUpdatedAt: "2024-01-19T11:45:00Z",
  },
  {
    id: "sub_003",
    formType: "Cheque Requisition",
    accountNumber: "1234567890",
    submittedAt: "2024-01-15T16:20:00Z",
    formData: {
      branch: "Victoria Island",
      accountName: "John Doe",
      accountNumber: "1234567890",
      accountType: "Savings",
      chequeLeaves: "50",
      signature: "John Doe",
    },
    officialComments: "Cheque book ready for collection. Customer notified.",
    lastUpdatedBy: "System Administrator",
    lastUpdatedAt: "2024-01-16T10:00:00Z",
  },
  {
    id: "sub_004",
    formType: "Account Reactivation & Asset Reclamation",
    accountNumber: "9876543210",
    submittedAt: "2024-01-22T11:45:00Z",
    formData: {
      accountNumber: "9876543210",
      branch: "Lagos Island",
      accountName: "Jane Smith",
      address: "123 Lagos Street, Lagos",
      phone: "08098765432",
      email: "jane.smith@email.com",
      requestType: "reactivation",
      bvn: "12345678901",
      signature: "Jane Smith",
    },
    officialComments: "",
    lastUpdatedBy: "",
    lastUpdatedAt: "",
  },
]

function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export async function GET(request: NextRequest) {
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

    // Get account number from query params
    const { searchParams } = new URL(request.url)
    const accountNumber = searchParams.get("accountNumber")

    if (!accountNumber) {
      return NextResponse.json({ message: "Account number is required" }, { status: 400 })
    }

    // Filter submissions by account number and sort by submission date (newest first)
    const accountSubmissions = submissions
      .filter((sub) => sub.accountNumber === accountNumber)
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())

    return NextResponse.json({
      submissions: accountSubmissions,
      total: accountSubmissions.length,
    })
  } catch (error) {
    console.error("Get submissions error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
