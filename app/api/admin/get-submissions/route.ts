import { type NextRequest, NextResponse } from "next/server"

// Simple token verification
function verifyToken(token: string) {
  try {
    // Simple verification for demo - in production use proper JWT library
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

// Comprehensive demo submissions data (10 records across different accounts and form types)
const submissions = [
  {
    id: "sub_001",
    formType: "Application for Statement of Account",
    accountNumber: "1234567890",
    submittedAt: "2024-01-25T10:30:00Z",
    formData: {
      accountName: "John Doe",
      accountNumber: "1234567890",
      dateFrom: "2024-01-01",
      dateTo: "2024-01-31",
      purpose: "Embassy",
      authorization: true,
      signature: "John Doe",
    },
    officialComments: "Statement processed and sent to customer via email. Customer contacted for confirmation.",
    lastUpdatedBy: "System Administrator",
    lastUpdatedAt: "2024-01-25T14:30:00Z",
  },
  {
    id: "sub_002",
    formType: "E-Dispute Form",
    accountNumber: "1234567890",
    submittedAt: "2024-01-24T09:15:00Z",
    formData: {
      branch: "Victoria Island",
      name: "John Doe",
      accountNumber: "1234567890",
      phone: "08012345678",
      email: "john.doe@email.com",
      eProduct: "OnePay",
      disputeForm: "Funds Transfer",
      transactionDate: "2024-01-20",
      transactionTime: "14:30",
      location: "ATM - Victoria Island Branch",
      amount: "50000",
      wrongBeneficiary: "Wrong Account: 9999999999 - Unknown Beneficiary",
      correctBeneficiary: "Correct Account: 1111111111 - Jane Smith",
      authorization: true,
      signature: "John Doe",
    },
    officialComments:
      "Dispute investigated. Transaction reversed successfully. Customer refunded within 24 hours. Case closed.",
    lastUpdatedBy: "Branch Manager",
    lastUpdatedAt: "2024-01-24T16:45:00Z",
  },
  {
    id: "sub_003",
    formType: "Cheque Requisition",
    accountNumber: "1234567890",
    submittedAt: "2024-01-23T16:20:00Z",
    formData: {
      branch: "Victoria Island",
      accountName: "John Doe",
      accountNumber: "1234567890",
      accountType: "Savings",
      chequeLeaves: "50",
      signature: "John Doe",
    },
    officialComments:
      "Cheque book ready for collection. Customer notified via SMS and email. Collection deadline: March 23, 2024.",
    lastUpdatedBy: "System Administrator",
    lastUpdatedAt: "2024-01-24T10:00:00Z",
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
      address: "123 Lagos Street, Lagos Island, Lagos State",
      phone: "08098765432",
      email: "jane.smith@email.com",
      nearestLandmark: "Near National Theatre",
      requestType: "reactivation",
      bvn: "12345678901",
      nin: "98765432109",
      signature: "Jane Smith",
    },
    officialComments: "Account reactivation completed. All compliance requirements met. Account now active.",
    lastUpdatedBy: "Branch Manager",
    lastUpdatedAt: "2024-01-23T09:30:00Z",
  },
  {
    id: "sub_005",
    formType: "E-Channel Enrolment & Limit Enhancement",
    accountNumber: "1234567890",
    submittedAt: "2024-01-21T14:10:00Z",
    formData: {
      cardRequest: "new",
      cardType: "Debit",
      cardScheme: "MasterCard",
      currency: "NGN",
      requestReason: "New Account",
      smsAlert: true,
      emailAlert: true,
      smsNumber: "08012345678",
      emailAddress: "john.doe@email.com",
      mobileBanking: true,
      pinIssuance: true,
      signature: "John Doe",
    },
    officialComments:
      "Card production initiated. SMS and email alerts activated. Mobile banking enrollment completed. PIN sent via SMS.",
    lastUpdatedBy: "System Administrator",
    lastUpdatedAt: "2024-01-22T08:15:00Z",
  },
  {
    id: "sub_006",
    formType: "Application for Statement of Account",
    accountNumber: "9876543210",
    submittedAt: "2024-01-20T08:45:00Z",
    formData: {
      accountName: "Jane Smith",
      accountNumber: "9876543210",
      dateFrom: "2023-12-01",
      dateTo: "2023-12-31",
      purpose: "Reconciliation",
      authorization: true,
      signature: "Jane Smith",
    },
    officialComments: "Statement generated and emailed to customer. Hard copy also prepared for collection.",
    lastUpdatedBy: "Branch Manager",
    lastUpdatedAt: "2024-01-20T15:20:00Z",
  },
  {
    id: "sub_007",
    formType: "E-Dispute Form",
    accountNumber: "5555666677",
    submittedAt: "2024-01-19T13:25:00Z",
    formData: {
      branch: "Ikeja",
      name: "Michael Johnson",
      accountNumber: "5555666677",
      phone: "08055566677",
      email: "michael.johnson@email.com",
      eProduct: "USSD",
      disputeForm: "Airtime Recharge",
      transactionDate: "2024-01-18",
      transactionTime: "19:45",
      location: "Mobile Banking",
      amount: "2000",
      wrongBeneficiary: "MTN - 08099999999",
      correctBeneficiary: "Airtel - 08077777777",
      authorization: true,
      signature: "Michael Johnson",
    },
    officialComments:
      "Airtime recharge dispute resolved. Incorrect recharge reversed. Customer advised to double-check numbers.",
    lastUpdatedBy: "Customer Service Rep",
    lastUpdatedAt: "2024-01-19T17:30:00Z",
  },
  {
    id: "sub_008",
    formType: "Cheque Requisition",
    accountNumber: "5555666677",
    submittedAt: "2024-01-18T12:10:00Z",
    formData: {
      branch: "Ikeja",
      accountName: "Michael Johnson",
      accountNumber: "5555666677",
      accountType: "Current",
      chequeLeaves: "100",
      signature: "Michael Johnson",
    },
    officialComments: "Cheque book processed. Ready for collection at Ikeja branch. Customer notified.",
    lastUpdatedBy: "Branch Officer",
    lastUpdatedAt: "2024-01-19T09:15:00Z",
  },
  {
    id: "sub_009",
    formType: "E-Channel Enrolment & Limit Enhancement",
    accountNumber: "7777888899",
    submittedAt: "2024-01-17T15:30:00Z",
    formData: {
      cardRequest: "reissue",
      cardType: "Credit",
      cardScheme: "Visa",
      currency: "USD",
      requestReason: "Lost",
      customReason: "",
      tokenRequest: true,
      tokenType: "Premium",
      smsAlert: true,
      emailAlert: true,
      smsNumber: "08077788899",
      emailAddress: "sarah.williams@email.com",
      mobileBanking: true,
      pinReset: true,
      signature: "Sarah Williams",
    },
    officialComments:
      "Lost card blocked successfully. New card issued and dispatched. Token request processed. PIN reset completed.",
    lastUpdatedBy: "Card Services Team",
    lastUpdatedAt: "2024-01-18T11:45:00Z",
  },
  {
    id: "sub_010",
    formType: "Account Reactivation & Asset Reclamation",
    accountNumber: "7777888899",
    submittedAt: "2024-01-16T10:20:00Z",
    formData: {
      accountNumber: "7777888899",
      branch: "Abuja",
      accountName: "Sarah Williams",
      address: "456 Wuse II, Abuja, FCT",
      phone: "08077788899",
      email: "sarah.williams@email.com",
      nearestLandmark: "Near Silverbird Cinemas",
      requestType: "asset-reclamation",
      bvn: "55566677788",
      nin: "11122233344",
      tin: "99988877766",
      signature: "Sarah Williams",
    },
    officialComments:
      "Asset reclamation request approved. Dormant funds of ₦125,000 transferred to active account. Process completed.",
    lastUpdatedBy: "Compliance Officer",
    lastUpdatedAt: "2024-01-17T14:25:00Z",
  },
]

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
      accountNumber: accountNumber,
    })
  } catch (error) {
    console.error("Get submissions error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
