import { type NextRequest, NextResponse } from "next/server"

// Demo admin users (in production, this would be from a database with hashed passwords)
const adminUsers = [
  {
    id: "1",
    username: "admin",
    password: "admin123", // In production, this would be hashed
    name: "System Administrator",
    role: "Administrator",
  },
  {
    id: "2",
    username: "manager",
    password: "manager123",
    name: "Branch Manager",
    role: "Manager",
  },
]

// Simple JWT implementation without external library for demo
function createToken(payload: any): string {
  const header = {
    alg: "HS256",
    typ: "JWT",
  }

  const encodedHeader = btoa(JSON.stringify(header))
  const encodedPayload = btoa(
    JSON.stringify({
      ...payload,
      exp: Math.floor(Date.now() / 1000) + 8 * 60 * 60, // 8 hours
    }),
  )

  const signature = btoa(`${encodedHeader}.${encodedPayload}.secret`)

  return `${encodedHeader}.${encodedPayload}.${signature}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    console.log("Login attempt:", { username, password })

    // Validate input
    if (!username || !password) {
      return NextResponse.json({ message: "Username and password are required" }, { status: 400 })
    }

    // Find user
    const user = adminUsers.find((u) => u.username === username && u.password === password)

    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    // Generate simple token
    const token = createToken({
      userId: user.id,
      username: user.username,
      role: user.role,
    })

    console.log("Login successful for user:", user.username)

    // Return success response
    return NextResponse.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
