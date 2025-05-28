"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Search,
  LogOut,
  FileText,
  CreditCard,
  RefreshCw,
  Receipt,
  Smartphone,
  Download,
  Filter,
  Save,
  Clock,
  User,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileDown,
  BarChart3,
  Database,
} from "lucide-react"
import { format } from "date-fns"

interface Submission {
  id: string
  formType: string
  accountNumber: string
  submittedAt: string
  formData: any
  officialComments: string
  lastUpdatedBy?: string
  lastUpdatedAt?: string
}

interface AdminUser {
  id: string
  username: string
  name: string
  role: string
}

export default function AdminDashboard() {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [editingComments, setEditingComments] = useState<Record<string, string>>({})
  const [savingComments, setSavingComments] = useState<Record<string, boolean>>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const router = useRouter()

  const formIcons = {
    "Application for Statement of Account": FileText,
    "E-Dispute Form": CreditCard,
    "Account Reactivation & Asset Reclamation": RefreshCw,
    "Cheque Requisition": Receipt,
    "E-Channel Enrolment & Limit Enhancement": Smartphone,
  }

  const formColors = {
    "Application for Statement of Account": "bg-blue-100 text-blue-700",
    "E-Dispute Form": "bg-red-100 text-red-700",
    "Account Reactivation & Asset Reclamation": "bg-green-100 text-green-700",
    "Cheque Requisition": "bg-purple-100 text-purple-700",
    "E-Channel Enrolment & Limit Enhancement": "bg-orange-100 text-orange-700",
  }

  // Sample account numbers for easy testing
  const sampleAccounts = [
    { number: "1234567890", name: "John Doe", submissions: 3 },
    { number: "9876543210", name: "Jane Smith", submissions: 2 },
    { number: "5555666677", name: "Michael Johnson", submissions: 2 },
    { number: "7777888899", name: "Sarah Williams", submissions: 2 },
  ]

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("adminToken")
    const userStr = localStorage.getItem("adminUser")

    if (!token || !userStr) {
      router.push("/admin")
      return
    }

    try {
      const user = JSON.parse(userStr)
      setAdminUser(user)
    } catch (error) {
      router.push("/admin")
    }
  }, [router])

  useEffect(() => {
    // Filter submissions based on form type
    if (filterType === "all") {
      setFilteredSubmissions(submissions)
    } else {
      setFilteredSubmissions(submissions.filter((sub) => sub.formType === filterType))
    }
    setCurrentPage(1) // Reset to first page when filtering
  }, [submissions, filterType])

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    localStorage.removeItem("adminUser")
    router.push("/admin")
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter an account number")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch(`/api/admin/get-submissions?accountNumber=${searchQuery}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (response.ok) {
        setSubmissions(data.submissions)
        // Initialize editing comments with existing comments
        const initialComments: Record<string, string> = {}
        data.submissions.forEach((sub: Submission) => {
          initialComments[sub.id] = sub.officialComments || ""
        })
        setEditingComments(initialComments)
      } else {
        setError(data.message || "Failed to fetch submissions")
        setSubmissions([])
      }
    } catch (error) {
      setError("Network error. Please try again.")
      setSubmissions([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateComments = async (submissionId: string) => {
    setSavingComments((prev) => ({ ...prev, [submissionId]: true }))

    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch("/api/admin/update-comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          submissionId,
          comments: editingComments[submissionId],
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Update the submission in the local state
        setSubmissions((prev) =>
          prev.map((sub) =>
            sub.id === submissionId
              ? {
                  ...sub,
                  officialComments: editingComments[submissionId],
                  lastUpdatedBy: adminUser?.name,
                  lastUpdatedAt: new Date().toISOString(),
                }
              : sub,
          ),
        )
      } else {
        setError(data.message || "Failed to update comments")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setSavingComments((prev) => ({ ...prev, [submissionId]: false }))
    }
  }

  const exportToCSV = () => {
    if (filteredSubmissions.length === 0) return

    const headers = [
      "Submission ID",
      "Form Type",
      "Account Number",
      "Submission Date",
      "Official Comments",
      "Last Updated By",
      "Last Updated At",
    ]

    const csvContent = [
      headers.join(","),
      ...filteredSubmissions.map((sub) =>
        [
          sub.id,
          `"${sub.formType}"`,
          sub.accountNumber,
          format(new Date(sub.submittedAt), "yyyy-MM-dd HH:mm:ss"),
          `"${sub.officialComments || ""}"`,
          `"${sub.lastUpdatedBy || ""}"`,
          sub.lastUpdatedAt ? format(new Date(sub.lastUpdatedAt), "yyyy-MM-dd HH:mm:ss") : "",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `submissions_${searchQuery}_${format(new Date(), "yyyy-MM-dd")}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const renderFormData = (formData: any, formType: string) => {
    const excludeFields = ["formType", "submittedAt", "signature", "date"]

    return (
      <div className="space-y-3">
        {Object.entries(formData)
          .filter(([key]) => !excludeFields.includes(key))
          .map(([key, value]) => {
            if (value === null || value === undefined || value === "") return null

            const displayKey = key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())
              .trim()

            let displayValue = value
            if (typeof value === "boolean") {
              displayValue = value ? "Yes" : "No"
            } else if (key.includes("Date") && typeof value === "string") {
              try {
                displayValue = format(new Date(value), "PPP")
              } catch {
                displayValue = value
              }
            } else if (typeof value === "object") {
              displayValue = JSON.stringify(value, null, 2)
            }

            return (
              <div key={key} className="grid grid-cols-3 gap-2 py-2 border-b border-gray-100 last:border-b-0">
                <div className="font-medium text-gray-700 text-sm">{displayKey}:</div>
                <div className="col-span-2 text-gray-900 text-sm break-words">{String(displayValue)}</div>
              </div>
            )
          })}
      </div>
    )
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentSubmissions = filteredSubmissions.slice(startIndex, endIndex)

  if (!adminUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">OneForm Hub Admin</h1>
              <Badge variant="secondary" className="ml-3 bg-blue-100 text-blue-800">
                {adminUser.role}
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>Welcome, {adminUser.name}</span>
              </div>
              <Button variant="outline" onClick={handleLogout} className="border-red-200 text-red-600 hover:bg-red-50">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <Card className="mb-8 shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Search Customer Submissions
            </CardTitle>
            <CardDescription className="text-blue-100">
              Enter an account number to view all related form submissions
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="search" className="text-gray-700 font-medium">
                  Account Number
                </Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter 10-digit account number"
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <Button
                    onClick={handleSearch}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 min-w-[120px]"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    {isLoading ? "Searching..." : "Search"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Sample Account Numbers */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center mb-3">
                <Database className="h-4 w-4 mr-2 text-blue-600" />
                <h4 className="text-sm font-medium text-blue-900">Sample Account Numbers (Click to Search)</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                {sampleAccounts.map((account) => (
                  <Button
                    key={account.number}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery(account.number)
                      handleSearch()
                    }}
                    className="justify-start text-left h-auto p-3 bg-white hover:bg-blue-50 border-blue-200"
                  >
                    <div>
                      <div className="font-medium text-blue-900">{account.number}</div>
                      <div className="text-xs text-blue-600">
                        {account.name} • {account.submissions} submissions
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        {submissions.length > 0 && (
          <>
            {/* Summary and Filters */}
            <Card className="mb-6 shadow-lg border-0">
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">Total Submissions</p>
                        <p className="text-2xl font-bold text-gray-900">{submissions.length}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600">Account Number</p>
                        <p className="text-lg font-semibold text-gray-900">{searchQuery}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <div>
                      <Label htmlFor="filter" className="text-sm font-medium text-gray-700">
                        Filter by Form Type
                      </Label>
                      <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-[250px] mt-1">
                          <Filter className="h-4 w-4 mr-2" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Forms ({submissions.length})</SelectItem>
                          <SelectItem value="Application for Statement of Account">Statement of Account</SelectItem>
                          <SelectItem value="E-Dispute Form">E-Dispute</SelectItem>
                          <SelectItem value="Account Reactivation & Asset Reclamation">Account Reactivation</SelectItem>
                          <SelectItem value="Cheque Requisition">Cheque Requisition</SelectItem>
                          <SelectItem value="E-Channel Enrolment & Limit Enhancement">E-Channel Enrolment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <Button
                        variant="outline"
                        onClick={exportToCSV}
                        disabled={filteredSubmissions.length === 0}
                        className="border-green-200 text-green-700 hover:bg-green-50"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submissions List */}
            <div className="space-y-6">
              {currentSubmissions.map((submission) => {
                const Icon = formIcons[submission.formType as keyof typeof formIcons] || FileText
                const colorClass =
                  formColors[submission.formType as keyof typeof formColors] || "bg-gray-100 text-gray-700"

                return (
                  <Card
                    key={submission.id}
                    className="overflow-hidden shadow-lg border-0 hover:shadow-xl transition-shadow"
                  >
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-3 rounded-lg ${colorClass}`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div>
                            <CardTitle className="text-lg text-gray-900">{submission.formType}</CardTitle>
                            <CardDescription className="flex items-center gap-4 mt-1">
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                Submitted on {format(new Date(submission.submittedAt), "PPP 'at' p")}
                              </span>
                            </CardDescription>
                          </div>
                        </div>
                        <Badge variant="outline" className="font-mono text-xs">
                          ID: {submission.id.slice(-8)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      {/* Form Data */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          Submitted Information
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-4 border">
                          {renderFormData(submission.formData, submission.formType)}
                        </div>
                      </div>

                      {/* Official Use Section */}
                      <div className="border-t pt-6">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900 flex items-center">
                            <FileDown className="h-4 w-4 mr-2" />
                            Official Use Only
                          </h4>
                          {submission.lastUpdatedBy && (
                            <div className="flex items-center text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                              <Clock className="h-3 w-3 mr-1" />
                              Last updated by <strong className="ml-1">{submission.lastUpdatedBy}</strong> on{" "}
                              {format(new Date(submission.lastUpdatedAt!), "PPP 'at' p")}
                            </div>
                          )}
                        </div>
                        <div className="space-y-3">
                          <Textarea
                            value={editingComments[submission.id] || ""}
                            onChange={(e) =>
                              setEditingComments((prev) => ({
                                ...prev,
                                [submission.id]: e.target.value,
                              }))
                            }
                            placeholder="Add official comments, processing notes, status updates, or administrative remarks..."
                            rows={4}
                            className="resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                          <div className="flex justify-end">
                            <Button
                              onClick={() => handleUpdateComments(submission.id)}
                              disabled={savingComments[submission.id]}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Save className="h-4 w-4 mr-2" />
                              {savingComments[submission.id] ? "Saving..." : "Update Comments"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Card className="mt-6 shadow-lg border-0">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Showing {startIndex + 1} to {Math.min(endIndex, filteredSubmissions.length)} of{" "}
                      {filteredSubmissions.length} submissions
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className={currentPage === page ? "bg-blue-600 hover:bg-blue-700" : ""}
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Empty State */}
        {submissions.length === 0 && searchQuery && !isLoading && (
          <Card className="text-center py-12 shadow-lg border-0">
            <CardContent>
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions found</h3>
              <p className="text-gray-600">
                No form submissions found for account number: <strong>{searchQuery}</strong>
              </p>
              <p className="text-sm text-gray-500 mt-2">Try one of the sample account numbers above</p>
            </CardContent>
          </Card>
        )}

        {/* Initial State */}
        {submissions.length === 0 && !searchQuery && !isLoading && (
          <Card className="text-center py-12 shadow-lg border-0">
            <CardContent>
              <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Search className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Search for Customer Submissions</h3>
              <p className="text-gray-600">Enter an account number above to view all related form submissions</p>
              <p className="text-sm text-gray-500 mt-2">Use the sample account numbers for quick testing</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
