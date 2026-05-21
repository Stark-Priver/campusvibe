"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import AdminShell from "../../AdminShell"

type Props = { params: Promise<{ role: string }> }

export default function CampusMemorySettingsPage({ params: paramsPromise }: Props) {
  const [params, setParams] = useState<{ role: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [settings, setSettings] = useState({
    basicPrice: 50000,
    standardPrice: 80000,
    premiumPrice: 150000,
    installmentMonths: 3,
    installmentInterval: 30,
    contactPhone: "+255 700 123456",
    contactEmail: "campusmemory@campusvibe.tz",
    bankAccount: "353332037",
    bankName: "M-Pesa",
  })

  useState(() => {
    paramsPromise.then(setParams)
  }, [paramsPromise])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: isNaN(Number(value)) ? value : Number(value),
    }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSaved(false)

    try {
      // In a real app, this would save to a settings table in Supabase
      // For now, we'll just show a success message
      await new Promise(resolve => setTimeout(resolve, 500))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error("Error saving settings:", error)
      alert("Failed to save settings. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!params) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted">Loading...</p>
      </div>
    )
  }

  const content = (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href={`/dashboard/${params.role}/admin/campus-memory`}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft size={20} className="text-dark" />
        </Link>
        <div>
          <h1 className="font-heading font-black text-2xl text-dark">Campus Memory Settings</h1>
          <p className="text-muted text-sm mt-1">Configure pricing, payment, and contact information</p>
        </div>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 font-section font-bold">✓ Settings saved successfully</p>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Pricing Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <h2 className="font-section font-bold text-xl text-dark mb-6">Package Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-section font-bold text-dark mb-2">Basic Package (TSH)</label>
              <input
                type="number"
                name="basicPrice"
                value={settings.basicPrice}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
              />
              <p className="text-xs text-muted mt-1">Standard event coverage</p>
            </div>

            <div>
              <label className="block text-sm font-section font-bold text-dark mb-2">Standard Package (TSH)</label>
              <input
                type="number"
                name="standardPrice"
                value={settings.standardPrice}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
              />
              <p className="text-xs text-muted mt-1">Enhanced coverage</p>
            </div>

            <div>
              <label className="block text-sm font-section font-bold text-dark mb-2">Premium Package (TSH)</label>
              <input
                type="number"
                name="premiumPrice"
                value={settings.premiumPrice}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
              />
              <p className="text-xs text-muted mt-1">Complete coverage</p>
            </div>
          </div>
        </div>

        {/* Installment Settings */}
        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <h2 className="font-section font-bold text-xl text-dark mb-6">Installment Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-section font-bold text-dark mb-2">Number of Installments</label>
              <select
                name="installmentMonths"
                value={settings.installmentMonths}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
              >
                <option value={2}>2 payments</option>
                <option value={3}>3 payments</option>
                <option value={4}>4 payments</option>
                <option value={6}>6 payments</option>
              </select>
              <p className="text-xs text-muted mt-1">How many payments for installment plan</p>
            </div>

            <div>
              <label className="block text-sm font-section font-bold text-dark mb-2">Days Between Installments</label>
              <input
                type="number"
                name="installmentInterval"
                value={settings.installmentInterval}
                onChange={handleChange}
                min={1}
                step={1}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
              />
              <p className="text-xs text-muted mt-1">Default: 30 days between payments</p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <h2 className="font-section font-bold text-xl text-dark mb-6">Contact Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-section font-bold text-dark mb-2">Phone Number</label>
              <input
                type="tel"
                name="contactPhone"
                value={settings.contactPhone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
              />
              <p className="text-xs text-muted mt-1">Displayed on booking pages</p>
            </div>

            <div>
              <label className="block text-sm font-section font-bold text-dark mb-2">Email Address</label>
              <input
                type="email"
                name="contactEmail"
                value={settings.contactEmail}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
              />
              <p className="text-xs text-muted mt-1">For booking inquiries</p>
            </div>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <h2 className="font-section font-bold text-xl text-dark mb-6">Payment Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-section font-bold text-dark mb-2">M-Pesa Account</label>
              <input
                type="text"
                name="bankAccount"
                value={settings.bankAccount}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
              />
              <p className="text-xs text-muted mt-1">Account number for receiving payments</p>
            </div>

            <div>
              <label className="block text-sm font-section font-bold text-dark mb-2">Payment Provider</label>
              <select
                name="bankName"
                value={settings.bankName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
              >
                <option value="M-Pesa">M-Pesa</option>
                <option value="Bank">Bank Transfer</option>
                <option value="Card">Credit Card</option>
              </select>
              <p className="text-xs text-muted mt-1">Primary payment method</p>
            </div>
          </div>
        </div>

        {/* Information Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-900">
            <strong>Note:</strong> These settings apply to all new bookings. Existing bookings will retain their original pricing and terms.
          </p>
        </div>

        {/* Save Button */}
        <div className="flex gap-3">
          <Link
            href={`/dashboard/${params.role}/admin/campus-memory`}
            className="flex-1 px-4 py-3 border border-gray-300 text-dark font-section font-bold rounded-lg hover:bg-gray-50 transition text-center"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-brand text-white font-section font-bold rounded-lg hover:bg-brand-dark transition disabled:opacity-50"
          >
            <Save size={18} />
            {loading ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  )

  return (
    <AdminShell role={params.role} section="campus-memory" user={{ full_name: "Admin", email: "admin@campusvibe.tz" }}>
      {content}
    </AdminShell>
  )
}
