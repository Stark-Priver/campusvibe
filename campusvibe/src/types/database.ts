export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          email: string | null
          phone: string | null
          university: string | null
          avatar_url: string | null
          bio: string | null
          roles: string[]
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          email?: string | null
          phone?: string | null
          university?: string | null
          avatar_url?: string | null
          bio?: string | null
          roles?: string[]
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          email?: string | null
          phone?: string | null
          university?: string | null
          avatar_url?: string | null
          bio?: string | null
          roles?: string[]
          is_verified?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      news_articles: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string | null
          content: string | null
          category: string
          author_id: string | null
          author_name: string | null
          image_url: string | null
          is_featured: boolean
          is_trending: boolean
          is_published: boolean
          read_time: string | null
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt?: string | null
          content?: string | null
          category: string
          author_id?: string | null
          author_name?: string | null
          image_url?: string | null
          is_featured?: boolean
          is_trending?: boolean
          is_published?: boolean
          read_time?: string | null
          published_at?: string | null
        }
        Update: {
          title?: string
          slug?: string
          excerpt?: string | null
          content?: string | null
          category?: string
          author_name?: string | null
          image_url?: string | null
          is_featured?: boolean
          is_trending?: boolean
          is_published?: boolean
          read_time?: string | null
          published_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          date: string
          time: string | null
          location: string | null
          university: string | null
          category: string
          attendees_count: number
          is_featured: boolean
          is_published: boolean
          image_url: string | null
          rsvp_url: string | null
          organizer_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string | null
          date: string
          time?: string | null
          location?: string | null
          university?: string | null
          category: string
          attendees_count?: number
          is_featured?: boolean
          is_published?: boolean
          image_url?: string | null
          rsvp_url?: string | null
          organizer_id?: string | null
        }
        Update: {
          title?: string
          slug?: string
          description?: string | null
          date?: string
          time?: string | null
          location?: string | null
          university?: string | null
          category?: string
          attendees_count?: number
          is_featured?: boolean
          is_published?: boolean
          image_url?: string | null
          rsvp_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      media_items: {
        Row: {
          id: string
          title: string
          slug: string
          type: string
          duration: string | null
          channel: string | null
          views_count: number
          image_url: string | null
          media_url: string | null
          is_featured: boolean
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          type: string
          duration?: string | null
          channel?: string | null
          views_count?: number
          image_url?: string | null
          media_url?: string | null
          is_featured?: boolean
          is_published?: boolean
        }
        Update: {
          title?: string
          slug?: string
          type?: string
          duration?: string | null
          channel?: string | null
          views_count?: number
          image_url?: string | null
          media_url?: string | null
          is_featured?: boolean
          is_published?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      marketplace_listings: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          price: number
          currency: string
          category: string
          condition: string
          seller_id: string | null
          seller_name: string | null
          university: string | null
          image_url: string | null
          images: string[]
          is_sold: boolean
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string | null
          price: number
          currency?: string
          category: string
          condition: string
          seller_id?: string | null
          seller_name?: string | null
          university?: string | null
          image_url?: string | null
          images?: string[]
          is_sold?: boolean
          is_published?: boolean
        }
        Update: {
          title?: string
          description?: string | null
          price?: number
          category?: string
          condition?: string
          image_url?: string | null
          images?: string[]
          is_sold?: boolean
          is_published?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          id: string
          full_name: string
          email: string
          organization: string | null
          interest: string
          message: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          full_name: string
          email: string
          organization?: string | null
          interest: string
          message: string
          is_read?: boolean
        }
        Update: {
          is_read?: boolean
        }
        Relationships: []
      }
      event_rsvps: {
        Row: {
          id: string
          event_id: string
          user_id: string
          name: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          name: string
          email: string
        }
        Update: Record<string, never>
        Relationships: []
      }
      breaking_news: {
        Row: {
          id: string
          text: string
          is_active: boolean
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          text: string
          is_active?: boolean
          order_index?: number
        }
        Update: {
          text?: string
          is_active?: boolean
          order_index?: number
        }
        Relationships: []
      }
      platform_stats: {
        Row: {
          id: string
          key: string
          value: string
          label: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: string
          label: string
        }
        Update: {
          value?: string
          label?: string
          updated_at?: string
        }
        Relationships: []
      },
      users: {
        Row: {
          id: string
          email: string
          password_hash: string
          full_name: string
          university: string | null
          roles: string[]
          email_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          full_name: string
          university?: string | null
          roles?: string[]
          email_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          full_name?: string
          university?: string | null
          roles?: string[]
          email_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }

    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
export type NewsArticle = Database["public"]["Tables"]["news_articles"]["Row"]
export type Event = Database["public"]["Tables"]["events"]["Row"]
export type MediaItem = Database["public"]["Tables"]["media_items"]["Row"]
export type MarketplaceListing = Database["public"]["Tables"]["marketplace_listings"]["Row"]
export type ContactSubmission = Database["public"]["Tables"]["contact_submissions"]["Row"]
export type AuthUserRow = Database["public"]["Tables"]["users"]["Row"]

export type DashboardRole =
  | "administrator"
  | "ambassador"
  | "student"
  | "driver"
  | "restaurant-owner"
  | "delivery"
