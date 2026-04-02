'use client'

import { useRef } from 'react'
import { useToast } from './Toast'

interface FormWithToastProps {
  action: (formData: FormData) => Promise<void>
  onSuccess?: (message?: string) => void
  onError?: (error: Error) => void
  successMessage?: string
  errorMessage?: string
  children: React.ReactNode
  className?: string
  formClassName?: string
}

export function FormWithToast({
  action,
  onSuccess,
  onError,
  successMessage = 'Operation completed successfully',
  errorMessage = 'Operation failed',
  children,
  className,
  formClassName,
}: FormWithToastProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const { addToast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const formData = new FormData(e.currentTarget)
      await action(formData)
      addToast(successMessage, 'success')
      formRef.current?.reset()
      onSuccess?.()
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      addToast(errorMessage, 'error')
      onError?.(err)
    } finally {
    }
  }

  return (
    <div className={className}>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className={formClassName}
        noValidate
      >
        {children}
      </form>
    </div>
  )
}
