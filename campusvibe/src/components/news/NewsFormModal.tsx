"use client"

import { useTransition, useState, useRef } from "react"
import { X, Upload, Loader2 } from "lucide-react"
import Image from "next/image"

interface NewsFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (formData: FormData) => Promise<void>
  initialData?: {
    id: string
    title: string
    slug: string
    excerpt?: string
    content?: string
    category: string
    author_name?: string
    image_url?: string
    is_published: boolean
  }
  isLoading?: boolean
}

export function NewsFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: NewsFormModalProps) {
  const [isPending, startTransition] = useTransition()
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isEditing = !!initialData

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    if (imageFile) {
      formData.set("image_file", imageFile)
    }

    startTransition(async () => {
      await onSubmit(formData)
      onClose()
    })
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 flex items-center justify-between p-6 border-b border-slate-200 bg-white">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {isEditing ? "Edit Article" : "Create New Article"}
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                {isEditing ? "Update your news article details and image" : "Write a new news article with an engaging title and compelling content"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 hover:bg-slate-100 transition-colors"
            >
              <X size={20} className="text-slate-500" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {isEditing && <input type="hidden" name="id" value={initialData?.id} />}

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-3">
                Featured Image
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative w-full h-64 rounded-lg border-2 border-dashed border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center overflow-hidden group"
              >
                {imagePreview ? (
                  <>
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="text-white font-medium flex items-center gap-2">
                        <Upload size={16} /> Change Image
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 mb-2">
                      <Upload className="text-indigo-600" size={24} />
                    </div>
                    <p className="font-medium text-slate-900">Click to upload image</p>
                    <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 10MB</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Headline *
              </label>
              <input
                type="text"
                name="title"
                defaultValue={initialData?.title}
                placeholder="Enter article headline..."
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            {/* Slug & Category Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  name="slug"
                  defaultValue={initialData?.slug}
                  placeholder="article-slug"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  defaultValue={initialData?.category || "Habari za Elimu"}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="Habari za Elimu">Habari za Elimu (Education News)</option>
                  <option value="Siasa za Chuo">Siasa za Chuo (Campus Politics)</option>
                  <option value="Maisha ya Chuo">Maisha ya Chuo (Campus Life)</option>
                  <option value="Michezo na Utamaduni">Michezo na Utamaduni (Sports & Culture)</option>
                  <option value="Fursa na Masomo">Fursa na Masomo (Opportunities & Scholarships)</option>
                </select>
              </div>
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Author
              </label>
              <input
                type="text"
                name="author_name"
                defaultValue={initialData?.author_name || "Admin"}
                placeholder="Author name"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Publish Status - Prominent */}
            <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-200">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_published"
                  defaultChecked={initialData?.is_published ?? true}
                  className="w-5 h-5 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm font-semibold text-slate-900">Publish immediately to news feed</span>
              </label>
              <p className="text-xs text-slate-600 mt-2 ml-8">Uncheck to save as draft</p>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Excerpt
              </label>
              <textarea
                name="excerpt"
                defaultValue={initialData?.excerpt}
                placeholder="Brief summary of the article (appears in listings)..."
                rows={3}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Content *
              </label>
              <textarea
                name="content"
                defaultValue={initialData?.content}
                placeholder="Write your article content here..."
                rows={8}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none font-mono"
                required
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending || isLoading}
                className="flex-1 rounded-lg bg-indigo-600 text-white px-4 py-3 text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isPending || isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    {isEditing ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>{isEditing ? "Update Article" : "Create Article"}</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
