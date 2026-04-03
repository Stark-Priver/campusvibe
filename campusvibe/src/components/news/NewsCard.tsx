"use client"

import Link from "next/link"
import Image from "next/image"
import { Trash2, Edit2, Share2, Copy, MessageCircle, CheckCircle, Clock } from "lucide-react"
import { useState } from "react"

interface NewsCardProps {
  id: string
  title: string
  slug: string
  excerpt?: string
  category: string
  author_name?: string
  image_url?: string
  is_published: boolean
  published_at?: string
  updated_at: string
  role: string
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function NewsCard({
  id,
  title,
  slug,
  excerpt,
  category,
  author_name,
  image_url,
  is_published,
  published_at,
  updated_at,
  role,
  onEdit,
  onDelete,
}: NewsCardProps) {
  const [shareMenuOpen, setShareMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const baseUrl = "http://localhost:3000" // Will be updated with actual domain in production
  const articleUrl = `${baseUrl}/news/${slug}`
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`Check this out: ${title}\n${articleUrl}`)}`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(articleUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formattedDate = new Date(updated_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div className="group rounded-xl border border-slate-200 bg-white overflow-hidden hover:border-slate-300 hover:shadow-lg transition-all duration-300">
      {/* Image Container */}
      {image_url ? (
        <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
          <Image
            src={image_url}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-300/50 mb-2">
              📰
            </div>
            <p className="text-xs text-slate-500">No image</p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Status & Category */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
            is_published
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}>
            {is_published ? (
              <>
                <CheckCircle size={12} /> Published
              </>
            ) : (
              <>
                <Clock size={12} /> Draft
              </>
            )}
          </span>
          <span className="inline-flex text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700">
            {category}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-slate-900 line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors">
          {title}
        </h3>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-sm text-slate-600 line-clamp-2 mb-3">
            {excerpt}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-4 pb-4 border-t border-slate-100">
          <div className="space-y-1 mt-3">
            {author_name && <p className="font-medium text-slate-700">By {author_name}</p>}
            <p className="text-slate-500">{formattedDate}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(id)}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
          >
            <Edit2 size={14} /> Edit
          </button>

          <button
            onClick={() => {
              window.open(whatsappUrl, "_blank")
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
            title="Share on WhatsApp"
          >
            <MessageCircle size={14} />
          </button>

          <div className="relative">
            <button
              onClick={() => setShareMenuOpen(!shareMenuOpen)}
              className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              title="More options"
            >
              <Share2 size={14} />
            </button>

            {shareMenuOpen && (
              <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-lg border border-slate-200 shadow-xl z-50">
                <button
                  onClick={() => {
                    handleCopyLink()
                    setShareMenuOpen(false)
                  }}
                  className="w-full text-left px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Copy size={16} className={copied ? "text-emerald-600" : "text-slate-600"} />
                  {copied ? "Copied!" : "Copy Link"}
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              if (confirm("Delete this article? This cannot be undone.")) {
                onDelete(id)
              }
            }}
            className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
