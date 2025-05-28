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
import { Calendar, CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface StatementOfAccountFormProps {
  onSubmit: (data: any) => void
}

export default function StatementOfAccountForm({ onSubmit }: StatementOfAccountFormProps) {
  const [formData, setFormData] = useState({
    accountName: "",
    accountNumber: "",
    dateFrom: null as Date | null,
    dateTo: null as Date | null,
    purpose: "",
    customPurpose: "",
    authorization: false,
    signature: "",
    date: new Date(),
    officialUse: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.accountName.trim()) {
      newErrors.accountName = "Account name is required"
    }

    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = "Account number is required"
    } else if (!/^\d{10}$/.test(formData.accountNumber)) {
      newErrors.accountNumber = "Account number must be 10 digits"
    }

    if (!formData.dateFrom) {
      newErrors.dateFrom = "Start date is required"
    }

    if (!formData.dateTo) {
      newErrors.dateTo = "End date is required"
    }

    if (!formData.purpose) {
      newErrors.purpose = "Purpose is required"
    }

    if (formData.purpose === "Others" && !formData.customPurpose.trim()) {
      newErrors.customPurpose = "Please specify the purpose"
    }

    if (!formData.authorization) {
      newErrors.authorization = "Authorization is required"
    }

    if (!formData.signature.trim()) {
      newErrors.signature = "Signature is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit({
        formType: "Application for Statement of Account",
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
        <CardTitle>Application for Statement of Account</CardTitle>
        <CardDescription>Request account statements for your records</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Account Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="accountName">
                Name of Account <span className="text-red-500">*</span>
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
                placeholder="10-digit account number"
                className={errors.accountNumber ? "border-red-500" : ""}
              />
              {errors.accountNumber && <p className="text-sm text-red-500 mt-1">{errors.accountNumber}</p>}
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>
                Date From <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.dateFrom && "text-muted-foreground",
                      errors.dateFrom && "border-red-500",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dateFrom ? format(formData.dateFrom, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.dateFrom}
                    onSelect={(date) => updateFormData("dateFrom", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.dateFrom && <p className="text-sm text-red-500 mt-1">{errors.dateFrom}</p>}
            </div>

            <div>
              <Label>
                Date To <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.dateTo && "text-muted-foreground",
                      errors.dateTo && "border-red-500",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dateTo ? format(formData.dateTo, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.dateTo}
                    onSelect={(date) => updateFormData("dateTo", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.dateTo && <p className="text-sm text-red-500 mt-1">{errors.dateTo}</p>}
            </div>
          </div>

          {/* Purpose */}
          <div>
            <Label htmlFor="purpose">
              Purpose of Statement <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.purpose} onValueChange={(value) => updateFormData("purpose", value)}>
              <SelectTrigger className={errors.purpose ? "border-red-500" : ""}>
                <SelectValue placeholder="Select purpose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Reconciliation">Reconciliation</SelectItem>
                <SelectItem value="Embassy">Embassy</SelectItem>
                <SelectItem value="Others">Others</SelectItem>
              </SelectContent>
            </Select>
            {errors.purpose && <p className="text-sm text-red-500 mt-1">{errors.purpose}</p>}
          </div>

          {formData.purpose === "Others" && (
            <div>
              <Label htmlFor="customPurpose">
                Please specify <span className="text-red-500">*</span>
              </Label>
              <Input
                id="customPurpose"
                value={formData.customPurpose}
                onChange={(e) => updateFormData("customPurpose", e.target.value)}
                placeholder="Enter custom purpose"
                className={errors.customPurpose ? "border-red-500" : ""}
              />
              {errors.customPurpose && <p className="text-sm text-red-500 mt-1">{errors.customPurpose}</p>}
            </div>
          )}

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
                I hereby authorize the debit of N20.00 per page from my account for the statement requested above.{" "}
                <span className="text-red-500">*</span>
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

          {/* Official Use Only */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-4">For Official Use Only</h3>
            <Textarea
              placeholder="Official comments and processing notes..."
              value={formData.officialUse}
              onChange={(e) => updateFormData("officialUse", e.target.value)}
              disabled
              className="bg-gray-50"
            />
          </div>

          <Button type="submit" className="w-full">
            Submit Application
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
