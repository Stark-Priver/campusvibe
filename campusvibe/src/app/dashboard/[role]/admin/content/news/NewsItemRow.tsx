'use client'

import { useState } from 'react'
import { useToast } from '@/components/ui/Toast'
import { DeleteConfirmDialog } from '@/components/ui/DeleteConfirmDialog'
import type { Database } from '@/types/database'

type NewsItemRowItem = Pick<
  Database['public']['Tables']['news_articles']['Row'],
  "id" | "title" | "slug" | "category" | "author_name" | "is_published" | "updated_at"
>

interface NewsItemRowProps {
  item: NewsItemRowItem
  role: string
  onUpdate: (role: string, formData: FormData) => Promise<void>
  onDelete: (role: string, formData: FormData) => Promise<void>
}

export default function NewsItemRow({
  item,
  role,
  onUpdate,
  onDelete,
}: NewsItemRowProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { addToast } = useToast()

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsUpdating(true)
    try {
      const formData = new FormData(e.currentTarget)
      await onUpdate(role, formData)
      addToast('Article updated successfully', 'success')
    } catch {
      addToast('Failed to update article', 'error')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const formData = new FormData()
      formData.append('id', item.id)
      await onDelete(role, formData)
      setShowDeleteDialog(false)
      addToast('Article deleted successfully', 'success')
    } catch {
      addToast('Failed to delete article', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <tr className="border-b border-slate-50 align-top last:border-0">
        <td className="py-2.5 pr-3">
          <p className="font-semibold text-slate-900">{item.title}</p>
          <p className="text-xs text-slate-500">/{item.slug}</p>
        </td>
        <td className="py-2.5 pr-3">{item.category}</td>
        <td className="py-2.5 pr-3">
          <span className={`rounded-full px-2 py-0.5 text-xs ${item.is_published ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
            {item.is_published ? "Published" : "Draft"}
          </span>
        </td>
        <td className="py-2.5 pr-3 text-slate-600">{new Date(item.updated_at).toLocaleString()}</td>
        <td className="py-2.5">
          <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-2">
            <input type="hidden" name="id" value={item.id} />
            <input name="title" defaultValue={item.title} className="rounded border border-slate-300 px-2 py-1 text-sm" disabled={isUpdating} />
            <input name="slug" defaultValue={item.slug} className="rounded border border-slate-300 px-2 py-1 text-sm" disabled={isUpdating} />
            <input name="category" defaultValue={item.category} className="rounded border border-slate-300 px-2 py-1 text-sm" disabled={isUpdating} />
            <input name="author_name" defaultValue={item.author_name ?? "Admin"} className="rounded border border-slate-300 px-2 py-1 text-sm" disabled={isUpdating} />
            <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" name="is_published" defaultChecked={item.is_published} disabled={isUpdating} /> Published</label>
            <button type="submit" className="rounded bg-slate-800 text-white px-2 py-1 text-sm hover:bg-slate-700 disabled:opacity-50" disabled={isUpdating || isDeleting}>
              {isUpdating ? 'Updating...' : 'Update'}
            </button>
          </form>
          <button
            type="button"
            onClick={() => setShowDeleteDialog(true)}
            className="rounded bg-red-600 text-white px-2 py-1 text-sm hover:bg-red-700 disabled:opacity-50"
            disabled={isDeleting}
          >
            Delete
          </button>
        </td>
      </tr>
      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
        itemName={item.title}
        isLoading={isDeleting}
      />
    </>
  )
}
