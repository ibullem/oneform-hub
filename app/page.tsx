"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { FileText, CreditCard, RefreshCw, Receipt, Smartphone, Shield } from "lucide-react"
import StatementOfAccountForm from "@/components/forms/statement-of-account-form"
import EDisputeForm from "@/components/forms/e-dispute-form"
import AccountReactivationForm from "@/components/forms/account-reactivation-form"
import ChequeRequisitionForm from "@/components/forms/cheque-requisition-form"
import EChannelEnrolmentForm from "@/components/forms/e-channel-enrolment-form"
import SuccessModal from "@/components/success-modal"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const forms = [
  {
    id: "statement-of-account",
    title: "Application for Statement of Account",
    description: "Request account statements for reconciliation or embassy purposes",
    icon: FileText,
    color: "bg-blue-500",
  },
  {
    id: "e-dispute",
    title: "E-Dispute Form",
    description: "Report and dispute electronic transaction issues",
    icon: CreditCard,
    color: "bg-red-500",
  },
  {
    id: "account-reactivation",
    title: "Account Reactivation & Asset Reclamation",
    description: "Reactivate dormant accounts or reclaim assets",
    icon: RefreshCw,
    color: "bg-green-500",
  },
  {
    id: "cheque-requisition",
    title: "Cheque Requisition",
    description: "Request new cheque books for your account",
    icon: Receipt,
    color: "bg-purple-500",
  },
  {
    id: "e-channel-enrolment",
    title: "E-Channel Enrolment & Limit Enhancement",
    description: "Enroll in digital banking services and enhance limits",
    icon: Smartphone,
    color: "bg-orange-500",
  },
]

export default function DynamicFormsPage() {
  const [selectedForm, setSelectedForm] = useState<string>("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [submittedData, setSubmittedData] = useState<any>(null)

  const handleFormSubmit = (formData: any) => {
    // Store form data (simulate API call to store in database)
    const submissionData = {
      id: `sub_${Date.now()}`,
      ...formData,
      submittedAt: new Date().toISOString(),
    }

    // In a real app, this would be an API call
    fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submissionData),
    })
      .then(() => {
        console.log("Form submitted:", submissionData)
        setSubmittedData(submissionData)
        setShowSuccess(true)
      })
      .catch(console.error)
  }

  const renderSelectedForm = () => {
    switch (selectedForm) {
      case "statement-of-account":
        return <StatementOfAccountForm onSubmit={handleFormSubmit} />
      case "e-dispute":
        return <EDisputeForm onSubmit={handleFormSubmit} />
      case "account-reactivation":
        return <AccountReactivationForm onSubmit={handleFormSubmit} />
      case "cheque-requisition":
        return <ChequeRequisitionForm onSubmit={handleFormSubmit} />
      case "e-channel-enrolment":
        return <EChannelEnrolmentForm onSubmit={handleFormSubmit} />
      default:
        return null
    }
  }

  const selectedFormData = forms.find((form) => form.id === selectedForm)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">OneForm Hub</h1>
              <Badge variant="secondary" className="ml-3">
                Dynamic Forms
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link href="/admin">
                  <Shield className="h-4 w-4 mr-2" />
                  Admin Portal
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Form Selector */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Select a Form</CardTitle>
            <CardDescription>Choose from the available forms below to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedForm} onValueChange={setSelectedForm}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a form to fill out..." />
              </SelectTrigger>
              <SelectContent>
                {forms.map((form) => {
                  const Icon = form.icon
                  return (
                    <SelectItem key={form.id} value={form.id}>
                      <div className="flex items-center space-x-3">
                        <div className={`p-1 rounded ${form.color} text-white`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium">{form.title}</div>
                          <div className="text-sm text-gray-500">{form.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Selected Form Header */}
        {selectedFormData && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${selectedFormData.color} text-white`}>
                  <selectedFormData.icon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedFormData.title}</h2>
                  <p className="text-gray-600">{selectedFormData.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dynamic Form Rendering */}
        <div className="transition-all duration-300 ease-in-out">
          {selectedForm ? (
            renderSelectedForm()
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No form selected</h3>
                <p className="text-gray-600">Please select a form from the dropdown above to get started</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccess}
        onClose={() => {
          setShowSuccess(false)
          setSelectedForm("")
          setSubmittedData(null)
        }}
        formTitle={selectedFormData?.title || ""}
        submittedData={submittedData}
      />
    </div>
  )
}
