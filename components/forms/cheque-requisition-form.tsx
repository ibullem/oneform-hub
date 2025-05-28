"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"
import { format } from "date-fns"

interface ChequeRequisitionFormProps {
  onSubmit: (data: any) => void
}

export default function ChequeRequisitionForm({ onSubmit }: ChequeRequisitionFormProps) {
  const [formData, setFormData] = useState({
    branch: "",
    accountName: "",
    accountNumber: "",
    accountType: "",
    chequeLeaves: "",
    signature: "",
    date: new Date(),
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.branch.trim()) newErrors.branch = "Branch is required"
    if (!formData.accountName.trim()) newErrors.accountName = "Account name is required"
    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = "Account number is required"
    } else if (!/^\d{10}$/.test(formData.accountNumber)) {
      newErrors.accountNumber = "Account number must be 10 digits"
    }
    if (!formData.accountType) newErrors.accountType = "Account type is required"
    if (!formData.chequeLeaves) newErrors.chequeLeaves = "Number of cheque leaves is required"
    if (!formData.signature.trim()) newErrors.signature = "Signature is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit({
        formType: "Cheque Requisition",
        ...formData,
        submittedAt: new Date().toISOString(),
      })
    }
  }

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cheque Requisition</CardTitle>
        <CardDescription>Request new cheque books for your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Branch and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="branch">
                Branch <span className="text-red-500">*</span>
              </Label>
              <Input
                id="branch"
                value={formData.branch}
                onChange={(e) => updateFormData("branch", e.target.value)}
                className={errors.branch ? "border-red-500" : ""}
              />
              {errors.branch && <p className="text-sm text-red-500 mt-1">{errors.branch}</p>}
            </div>

            <div>
              <Label htmlFor="date">Date</Label>
              <Input id="date" value={format(formData.date, "PPP")} disabled />
            </div>
          </div>

          {/* Account Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="accountName">
                Account Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="accountName"
                value={formData.accountName}
                onChange={(e) => updateFormData("accountName", e.target.value)}
                className={errors.accountName ? "border-red-500" : ""}
              />
              {errors.accountName && <p className="text-sm text-red-500 mt-1">{errors.accountName}</p>}
            </div>

            <div>
              <Label htmlFor="accountNumber">
                Account Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="accountNumber"
                value={formData.accountNumber}
                onChange={(e) => updateFormData("accountNumber", e.target.value)}
                className={errors.accountNumber ? "border-red-500" : ""}
              />
              {errors.accountNumber && <p className="text-sm text-red-500 mt-1">{errors.accountNumber}</p>}
            </div>
          </div>

          {/* Account Type */}
          <div>
            <Label htmlFor="accountType">
              Account Type <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.accountType} onValueChange={(value) => updateFormData("accountType", value)}>
              <SelectTrigger className={errors.accountType ? "border-red-500" : ""}>
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Savings">Savings Account</SelectItem>
                <SelectItem value="Current">Current Account</SelectItem>
                <SelectItem value="Fixed Deposit">Fixed Deposit Account</SelectItem>
                <SelectItem value="Business">Business Account</SelectItem>
              </SelectContent>
            </Select>
            {errors.accountType && <p className="text-sm text-red-500 mt-1">{errors.accountType}</p>}
          </div>

          {/* Number of Cheque Leaves */}
          <div>
            <Label htmlFor="chequeLeaves">
              Number of Cheque Leaves <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.chequeLeaves} onValueChange={(value) => updateFormData("chequeLeaves", value)}>
              <SelectTrigger className={errors.chequeLeaves ? "border-red-500" : ""}>
                <SelectValue placeholder="Select number of leaves" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25 Leaves</SelectItem>
                <SelectItem value="50">50 Leaves</SelectItem>
                <SelectItem value="100">100 Leaves</SelectItem>
              </SelectContent>
            </Select>
            {errors.chequeLeaves && <p className="text-sm text-red-500 mt-1">{errors.chequeLeaves}</p>}
          </div>

          {/* Important Notice */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Important Notice:</strong> Cheque books must be collected within 60 days of issuance. Uncollected
              cheque books will be destroyed after this period for security reasons.
            </AlertDescription>
          </Alert>

          {/* Signature */}
          <div>
            <Label htmlFor="signature">
              Signature(s) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="signature"
              value={formData.signature}
              onChange={(e) => updateFormData("signature", e.target.value)}
              placeholder="Type your full name as signature"
              className={errors.signature ? "border-red-500" : ""}
            />
            {errors.signature && <p className="text-sm text-red-500 mt-1">{errors.signature}</p>}
            <p className="text-sm text-gray-500 mt-1">
              For joint accounts, all signatories must sign or provide authorization
            </p>
          </div>

          <Button type="submit" className="w-full">
            Submit Cheque Requisition
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
