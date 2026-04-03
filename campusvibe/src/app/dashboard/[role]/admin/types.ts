export type AdminSnapshot = {
  totalUsers: number
  adminUsers: number
  publishedNews: number
  totalNews: number
  publishedEvents: number
  totalEvents: number
  publishedMedia: number
  totalMedia: number
  publishedListings: number
  totalListings: number
  unreadContacts: number
  activeBreakingNews: number
  pendingNews: number
  pendingEvents: number
  pendingMedia: number
  pendingListings: number
  recentContacts: Array<{
    id: string
    full_name: string
    email: string
    interest: string
    created_at: string
    is_read: boolean
  }>
}
