"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"

interface EChannelEnrolmentFormProps {
  onSubmit: (data: any) => void
}

export default function EChannelEnrolmentForm({ onSubmit }: EChannelEnrolmentFormProps) {
  const [formData, setFormData] = useState({
    // Card Request
    cardRequest: "",
    cardType: "",
    cardScheme: "",
    currency: "",
    requestReason: "",
    customReason: "",

    // Token Request
    tokenRequest: false,
    tokenType: "",

    // Alert Request
    smsAlert: false,
    emailAlert: false,
    smsNumber: "",
    emailAddress: "",

    // Mobile Banking
    mobileBanking: false,
    pinIssuance: false,
    pinReset: false,

    signature: "",
    date: new Date(),
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.cardRequest) newErrors.cardRequest = "Card request type is required"
    if (formData.cardRequest && !formData.cardType) newErrors.cardType = "Card type is required"
    if (formData.cardType && !formData.cardScheme) newErrors.cardScheme = "Card scheme is required"
    if (formData.cardScheme && !formData.currency) newErrors.currency = "Currency is required"
    if (formData.cardRequest && !formData.requestReason) newErrors.requestReason = "Request reason is required"
    if (formData.requestReason === "Others" && !formData.customReason.trim()) {
      newErrors.customReason = "Please specify the reason"
    }

    if (formData.smsAlert && !formData.smsNumber.trim()) {
      newErrors.smsNumber = "SMS number is required for SMS alerts"
    } else if (formData.smsNumber && !/^\d{11}$/.test(formData.smsNumber)) {
      newErrors.smsNumber = "SMS number must be 11 digits"
    }

    if (formData.emailAlert && !formData.emailAddress.trim()) {
      newErrors.emailAddress = "Email address is required for email alerts"
    } else if (formData.emailAddress && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
      newErrors.emailAddress = "Invalid email format"
    }

    if (!formData.signature.trim()) newErrors.signature = "Signature is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit({
        formType: "E-Channel Enrolment & Limit Enhancement",
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
        <CardTitle>E-Channel Enrolment & Limit Enhancement</CardTitle>
        <CardDescription>Enroll in digital banking services and enhance transaction limits</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card Request Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Card Request</h3>

            <div>
              <Label>
                Card Request Type <span className="text-red-500">*</span>
              </Label>
              <RadioGroup value={formData.cardRequest} onValueChange={(value) => updateFormData("cardRequest", value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="new" id="new" />
                  <Label htmlFor="new">New Card</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="reissue" id="reissue" />
                  <Label htmlFor="reissue">Re-issue</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="block-replace" id="block-replace" />
                  <Label htmlFor="block-replace">Block/Replace</Label>
                </div>
              </RadioGroup>
              {errors.cardRequest && <p className="text-sm text-red-500 mt-1">{errors.cardRequest}</p>}
            </div>

            {formData.cardRequest && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cardType">
                      Card Type <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.cardType} onValueChange={(value) => updateFormData("cardType", value)}>
                      <SelectTrigger className={errors.cardType ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select card type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Debit">Debit Card</SelectItem>
                        <SelectItem value="Credit">Credit Card</SelectItem>
                        <SelectItem value="Prepaid">Prepaid Card</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.cardType && <p className="text-sm text-red-500 mt-1">{errors.cardType}</p>}
                  </div>

                  <div>
                    <Label htmlFor="cardScheme">
                      Card Scheme <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.cardScheme} onValueChange={(value) => updateFormData("cardScheme", value)}>
                      <SelectTrigger className={errors.cardScheme ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select card scheme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MasterCard">MasterCard</SelectItem>
                        <SelectItem value="Visa">Visa</SelectItem>
                        <SelectItem value="Verve">Verve</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.cardScheme && <p className="text-sm text-red-500 mt-1">{errors.cardScheme}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currency">
                      Currency <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.currency} onValueChange={(value) => updateFormData("currency", value)}>
                      <SelectTrigger className={errors.currency ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NGN">NGN (Nigerian Naira)</SelectItem>
                        <SelectItem value="USD">USD (US Dollar)</SelectItem>
                        <SelectItem value="GBP">GBP (British Pound)</SelectItem>
                        <SelectItem value="EUR">EUR (Euro)</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.currency && <p className="text-sm text-red-500 mt-1">{errors.currency}</p>}
                  </div>

                  <div>
                    <Label htmlFor="requestReason">
                      Request Reason <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.requestReason}
                      onValueChange={(value) => updateFormData("requestReason", value)}
                    >
                      <SelectTrigger className={errors.requestReason ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select reason" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New Account">New Account</SelectItem>
                        <SelectItem value="Lost">Lost Card</SelectItem>
                        <SelectItem value="Stolen">Stolen Card</SelectItem>
                        <SelectItem value="Damaged">Damaged Card</SelectItem>
                        <SelectItem value="Expired">Expired Card</SelectItem>
                        <SelectItem value="Others">Others</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.requestReason && <p className="text-sm text-red-500 mt-1">{errors.requestReason}</p>}
                  </div>
                </div>

                {formData.requestReason === "Others" && (
                  <div>
                    <Label htmlFor="customReason">
                      Please specify <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="customReason"
                      value={formData.customReason}
                      onChange={(e) => updateFormData("customReason", e.target.value)}
                      placeholder="Enter custom reason"
                      className={errors.customReason ? "border-red-500" : ""}
                    />
                    {errors.customReason && <p className="text-sm text-red-500 mt-1">{errors.customReason}</p>}
                  </div>
                )}
              </>
            )}
          </div>

          <Separator />

          {/* Token Request Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Token Request</h3>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="tokenRequest"
                checked={formData.tokenRequest}
                onCheckedChange={(checked) => updateFormData("tokenRequest", checked)}
              />
              <Label htmlFor="tokenRequest">Request Hardware Token</Label>
            </div>

            {formData.tokenRequest && (
              <div>
                <Label htmlFor="tokenType">Token Type</Label>
                <Select value={formData.tokenType} onValueChange={(value) => updateFormData("tokenType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select token type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Standard">Standard Token</SelectItem>
                    <SelectItem value="Premium">Premium Token</SelectItem>
                    <SelectItem value="Corporate">Corporate Token</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <Separator />

          {/* Alert Request Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Alert Request</h3>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="smsAlert"
                  checked={formData.smsAlert}
                  onCheckedChange={(checked) => updateFormData("smsAlert", checked)}
                />
                <Label htmlFor="smsAlert">SMS Alerts</Label>
              </div>

              {formData.smsAlert && (
                <div>
                  <Label htmlFor="smsNumber">
                    SMS Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="smsNumber"
                    value={formData.smsNumber}
                    onChange={(e) => updateFormData("smsNumber", e.target.value)}
                    placeholder="Enter 11-digit phone number"
                    className={errors.smsNumber ? "border-red-500" : ""}
                  />
                  {errors.smsNumber && <p className="text-sm text-red-500 mt-1">{errors.smsNumber}</p>}
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="emailAlert"
                  checked={formData.emailAlert}
                  onCheckedChange={(checked) => updateFormData("emailAlert", checked)}
                />
                <Label htmlFor="emailAlert">Email Alerts</Label>
              </div>

              {formData.emailAlert && (
                <div>
                  <Label htmlFor="emailAddress">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="emailAddress"
                    type="email"
                    value={formData.emailAddress}
                    onChange={(e) => updateFormData("emailAddress", e.target.value)}
                    placeholder="Enter email address"
                    className={errors.emailAddress ? "border-red-500" : ""}
                  />
                  {errors.emailAddress && <p className="text-sm text-red-500 mt-1">{errors.emailAddress}</p>}
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Mobile Banking Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Mobile Banking Request</h3>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="mobileBanking"
                  checked={formData.mobileBanking}
                  onCheckedChange={(checked) => updateFormData("mobileBanking", checked)}
                />
                <Label htmlFor="mobileBanking">Enable Mobile Banking</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pinIssuance"
                  checked={formData.pinIssuance}
                  onCheckedChange={(checked) => updateFormData("pinIssuance", checked)}
                />
                <Label htmlFor="pinIssuance">PIN Issuance</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pinReset"
                  checked={formData.pinReset}
                  onCheckedChange={(checked) => updateFormData("pinReset", checked)}
                />
                <Label htmlFor="pinReset">PIN Reset</Label>
              </div>
            </div>
          </div>

          <Separator />

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
            Submit Enrolment Request
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
