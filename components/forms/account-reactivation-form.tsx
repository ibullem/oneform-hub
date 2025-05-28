"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Upload } from "lucide-react"
import { format } from "date-fns"

interface AccountReactivationFormProps {
  onSubmit: (data: any) => void
}

export default function AccountReactivationForm({ onSubmit }: AccountReactivationFormProps) {
  const [formData, setFormData] = useState({
    accountNumber: "",
    branch: "",
    accountName: "",
    address: "",
    phone: "",
    email: "",
    nearestLandmark: "",
    requestType: "",
    bvn: "",
    nin: "",
    tin: "",
    idDocument: null as File | null,
    utilityBill: null as File | null,
    signature: "",
    date: new Date(),
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = "Account number is required"
    } else if (!/^\d{10}$/.test(formData.accountNumber)) {
      newErrors.accountNumber = "Account number must be 10 digits"
    }
    if (!formData.branch.trim()) newErrors.branch = "Branch is required"
    if (!formData.accountName.trim()) newErrors.accountName = "Account name is required"
    if (!formData.address.trim()) newErrors.address = "Address is required"
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
    if (!formData.requestType) newErrors.requestType = "Request type is required"
    if (!formData.bvn.trim()) newErrors.bvn = "BVN is required"
    if (!formData.signature.trim()) newErrors.signature = "Signature is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit({
        formType: "Account Reactivation & Asset Reclamation",
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

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData((prev) => ({ ...prev, [field]: file }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Reactivation & Asset Reclamation</CardTitle>
        <CardDescription>Reactivate dormant accounts or reclaim assets</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Account Information */}
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
          </div>

          {/* Contact Information */}
          <div>
            <Label htmlFor="address">
              Address <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => updateFormData("address", e.target.value)}
              className={errors.address ? "border-red-500" : ""}
            />
            {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            <div>
              <Label htmlFor="nearestLandmark">Nearest Landmark</Label>
              <Input
                id="nearestLandmark"
                value={formData.nearestLandmark}
                onChange={(e) => updateFormData("nearestLandmark", e.target.value)}
              />
            </div>
          </div>

          {/* Request Type */}
          <div>
            <Label>
              Request Type <span className="text-red-500">*</span>
            </Label>
            <RadioGroup value={formData.requestType} onValueChange={(value) => updateFormData("requestType", value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="reactivation" id="reactivation" />
                <Label htmlFor="reactivation">Account Reactivation</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="asset-reclamation" id="asset-reclamation" />
                <Label htmlFor="asset-reclamation">Asset Reclamation</Label>
              </div>
            </RadioGroup>
            {errors.requestType && <p className="text-sm text-red-500 mt-1">{errors.requestType}</p>}
          </div>

          {/* ID Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="bvn">
                BVN <span className="text-red-500">*</span>
              </Label>
              <Input
                id="bvn"
                value={formData.bvn}
                onChange={(e) => updateFormData("bvn", e.target.value)}
                className={errors.bvn ? "border-red-500" : ""}
              />
              {errors.bvn && <p className="text-sm text-red-500 mt-1">{errors.bvn}</p>}
            </div>

            <div>
              <Label htmlFor="nin">NIN</Label>
              <Input id="nin" value={formData.nin} onChange={(e) => updateFormData("nin", e.target.value)} />
            </div>

            <div>
              <Label htmlFor="tin">TIN</Label>
              <Input id="tin" value={formData.tin} onChange={(e) => updateFormData("tin", e.target.value)} />
            </div>
          </div>

          {/* Document Uploads */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Document Uploads</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="idDocument">ID Document</Label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="idDocument"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Upload ID document</span>
                        <input
                          id="idDocument"
                          name="idDocument"
                          type="file"
                          className="sr-only"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload("idDocument", e.target.files?.[0] || null)}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                  </div>
                </div>
                {formData.idDocument && <p className="text-sm text-green-600 mt-1">✓ {formData.idDocument.name}</p>}
              </div>

              <div>
                <Label htmlFor="utilityBill">Utility Bill</Label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="utilityBill"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Upload utility bill</span>
                        <input
                          id="utilityBill"
                          name="utilityBill"
                          type="file"
                          className="sr-only"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload("utilityBill", e.target.files?.[0] || null)}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                  </div>
                </div>
                {formData.utilityBill && <p className="text-sm text-green-600 mt-1">✓ {formData.utilityBill.name}</p>}
              </div>
            </div>
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
            Submit Request
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
