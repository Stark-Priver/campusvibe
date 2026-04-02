'use client'

import { useState } from 'react'
import { useToast } from './Toast'
import { DeleteConfirmDialog } from './DeleteConfirmDialog'

interface DeleteButtonProps {
  itemName?: string
  onDelete: () => Promise<void>
  onSuccess?: (message?: string) => void
  onError?: (error: Error) => void
  successMessage?: string
  errorMessage?: string
}

export function DeleteButton({
  itemName = 'this item',
  onDelete,
  onSuccess,
  onError,
  successMessage = 'Item deleted successfully',
  errorMessage = 'Failed to delete item',
}: DeleteButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { addToast } = useToast()

  const handleConfirm = async () => {
    try {
      await onDelete()
      setIsOpen(false)
      addToast(successMessage, 'success')
      onSuccess?.()
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      addToast(errorMessage, 'error')
      onError?.(err)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded bg-red-600 text-white px-2 py-1 text-sm hover:bg-red-700"
      >
        Delete
      </button>
      <DeleteConfirmDialog
        isOpen={isOpen}
        onConfirm={handleConfirm}
        onCancel={() => setIsOpen(false)}
        itemName={itemName}
        title="Delete item"
        message="Are you sure you want to delete this item? This action cannot be undone."
      />
    </>
  )
}
