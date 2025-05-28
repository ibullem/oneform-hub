"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"

interface EDisputeFormProps {
  onSubmit: (data: any) => void
}

export default function EDisputeForm({ onSubmit }: EDisputeFormProps) {
  const [formData, setFormData] = useState({
    branch: "",
    name: "",
    accountNumber: "",
    phone: "",
    email: "",
    eProduct: "",
    disputeForm: "",
    customDisputeForm: "",
    transferMode: "",
    transactionDate: "",
    transactionTime: "",
    location: "",
    amount: "",
    wrongBeneficiary: "",
    correctBeneficiary: "",
    authorization: false,
    signature: "",
    date: new Date(),
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.branch.trim()) newErrors.branch = "Branch is required"
    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = "Account number is required"
    } else if (!/^\d{10}$/.test(formData.accountNumber)) {
      newErrors.accountNumber = "Account number must be 10 digits"
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^\d{11}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 11 digits"
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }
    if (!formData.eProduct) newErrors.eProduct = "E-Product selection is required"
    if (!formData.disputeForm) newErrors.disputeForm = "Form of dispute is required"
    if (formData.disputeForm === "Others" && !formData.customDisputeForm.trim()) {
      newErrors.customDisputeForm = "Please specify the dispute form"
    }
    if (!formData.transactionDate) newErrors.transactionDate = "Transaction date is required"
    if (!formData.amount.trim()) newErrors.amount = "Amount is required"
    if (!formData.authorization) newErrors.authorization = "Authorization is required"
    if (!formData.signature.trim()) newErrors.signature = "Signature is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit({
        formType: "E-Dispute Form",
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
        <CardTitle>E-Dispute Form</CardTitle>
        <CardDescription>Report and dispute electronic transaction issues</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
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
              <Label htmlFor="name">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateFormData("name", e.target.value)}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            <div>
              <Label htmlFor="phone">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => updateFormData("phone", e.target.value)}
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
            </div>

            <div>
              <Label htmlFor="email">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
            </div>
          </div>

          {/* E-Product Selection */}
          <div>
            <Label htmlFor="eProduct">
              E-Product Selection <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.eProduct} onValueChange={(value) => updateFormData("eProduct", value)}>
              <SelectTrigger className={errors.eProduct ? "border-red-500" : ""}>
                <SelectValue placeholder="Select E-Product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OnePay">OnePay</SelectItem>
                <SelectItem value="PayPro">PayPro</SelectItem>
                <SelectItem value="USSD">USSD</SelectItem>
                <SelectItem value="Verve">Verve</SelectItem>
                <SelectItem value="MasterCard">MasterCard</SelectItem>
              </SelectContent>
            </Select>
            {errors.eProduct && <p className="text-sm text-red-500 mt-1">{errors.eProduct}</p>}
          </div>

          {/* Form of Dispute */}
          <div>
            <Label htmlFor="disputeForm">
              Form of Dispute <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.disputeForm} onValueChange={(value) => updateFormData("disputeForm", value)}>
              <SelectTrigger className={errors.disputeForm ? "border-red-500" : ""}>
                <SelectValue placeholder="Select dispute type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bill Payment">Bill Payment</SelectItem>
                <SelectItem value="Airtime Recharge">Airtime Recharge</SelectItem>
                <SelectItem value="Funds Transfer">Funds Transfer</SelectItem>
                <SelectItem value="Web Payment">Web Payment</SelectItem>
                <SelectItem value="Non-dispense of Cash">Non-dispense of Cash</SelectItem>
                <SelectItem value="Erroneous Transfer">Erroneous Transfer</SelectItem>
                <SelectItem value="Others">Others</SelectItem>
              </SelectContent>
            </Select>
            {errors.disputeForm && <p className="text-sm text-red-500 mt-1">{errors.disputeForm}</p>}
          </div>

          {formData.disputeForm === "Others" && (
            <div>
              <Label htmlFor="customDisputeForm">
                Please specify <span className="text-red-500">*</span>
              </Label>
              <Input
                id="customDisputeForm"
                value={formData.customDisputeForm}
                onChange={(e) => updateFormData("customDisputeForm", e.target.value)}
                className={errors.customDisputeForm ? "border-red-500" : ""}
              />
              {errors.customDisputeForm && <p className="text-sm text-red-500 mt-1">{errors.customDisputeForm}</p>}
            </div>
          )}

          {/* Transaction Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Transaction Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="transactionDate">
                  Transaction Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="transactionDate"
                  type="date"
                  value={formData.transactionDate}
                  onChange={(e) => updateFormData("transactionDate", e.target.value)}
                  className={errors.transactionDate ? "border-red-500" : ""}
                />
                {errors.transactionDate && <p className="text-sm text-red-500 mt-1">{errors.transactionDate}</p>}
              </div>

              <div>
                <Label htmlFor="transactionTime">Transaction Time</Label>
                <Input
                  id="transactionTime"
                  type="time"
                  value={formData.transactionTime}
                  onChange={(e) => updateFormData("transactionTime", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="amount">
                  Amount <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="amount"
                  value={formData.amount}
                  onChange={(e) => updateFormData("amount", e.target.value)}
                  placeholder="0.00"
                  className={errors.amount ? "border-red-500" : ""}
                />
                {errors.amount && <p className="text-sm text-red-500 mt-1">{errors.amount}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => updateFormData("location", e.target.value)}
                placeholder="Transaction location"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="wrongBeneficiary">Wrong Beneficiary Details</Label>
                <Textarea
                  id="wrongBeneficiary"
                  value={formData.wrongBeneficiary}
                  onChange={(e) => updateFormData("wrongBeneficiary", e.target.value)}
                  placeholder="Enter wrong beneficiary details"
                />
              </div>

              <div>
                <Label htmlFor="correctBeneficiary">Correct Beneficiary Details</Label>
                <Textarea
                  id="correctBeneficiary"
                  value={formData.correctBeneficiary}
                  onChange={(e) => updateFormData("correctBeneficiary", e.target.value)}
                  placeholder="Enter correct beneficiary details"
                />
              </div>
            </div>
          </div>

          {/* Authorization */}
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="authorization"
                checked={formData.authorization}
                onCheckedChange={(checked) => updateFormData("authorization", checked)}
                className={errors.authorization ? "border-red-500" : ""}
              />
              <Label htmlFor="authorization" className="text-sm leading-5">
                I hereby authorize the bank to investigate this dispute and take necessary action. I confirm that all
                information provided is accurate. <span className="text-red-500">*</span>
              </Label>
            </div>
            {errors.authorization && <p className="text-sm text-red-500">{errors.authorization}</p>}
          </div>

          {/* Signature and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="signature">
                Signature <span className="text-red-500">*</span>
              </Label>
              <Input
                id="signature"
                value={formData.signature}
                onChange={(e) => updateFormData("signature", e.target.value)}
                placeholder="Type your full name as signature"
                className={errors.signature ? "border-red-500" : ""}
              />
              {errors.signature && <p className="text-sm text-red-500 mt-1">{errors.signature}</p>}
            </div>

            <div>
              <Label htmlFor="date">Date</Label>
              <Input id="date" value={format(formData.date, "PPP")} disabled />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Submit Dispute
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
