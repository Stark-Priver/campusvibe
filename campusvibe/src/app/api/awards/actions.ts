"use server"

import { createClient } from "@/lib/supabase/server"

export async function getAwardsEvents() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("awards_events")
    .select("*")
    .neq("status", "draft")
    .order("created_at", { ascending: false })
  
  if (error) throw error
  return data
}

export async function getAwardsEventBySlug(slug: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("awards_events")
    .select(
      `
      *,
      award_categories (
        id,
        name,
        description,
        icon,
        display_order,
        nominees (
          id,
          full_name,
          bio,
          image_url,
          achievement,
          university,
          votes_count,
          created_at
        )
      )
      `
    )
    .eq("slug", slug)
    .neq("status", "draft")
    .single()
  
  if (error) throw error
  return data
}

export async function getAwardsEventById(id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("awards_events")
    .select("*")
    .eq("id", id)
    .single()
  
  if (error) throw error
  return data
}

export async function createAwardsEvent(event: {
  title: string
  slug: string
  description?: string
  university?: string
  image_url?: string
  banner_url?: string
  nominations_start_at?: string
  nominations_end_at?: string
  voting_start_at?: string
  voting_end_at?: string
}) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("awards_events")
    .insert([
      {
        ...event,
        status: "draft",
        created_by: (await supabase.auth.getUser()).data.user?.id,
      },
    ])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function updateAwardsEvent(
  id: string,
  updates: {
    title?: string
    description?: string
    status?: string
    nominations_start_at?: string
    nominations_end_at?: string
    voting_start_at?: string
    voting_end_at?: string
    image_url?: string
    banner_url?: string
  }
) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("awards_events")
    .update(updates)
    .eq("id", id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function createAwardCategory(
  awards_event_id: string,
  category: {
    name: string
    description?: string
    icon?: string
    display_order?: number
  }
) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("award_categories")
    .insert([
      {
        awards_event_id,
        ...category,
      },
    ])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getAwardCategories(awards_event_id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("award_categories")
    .select("*")
    .eq("awards_event_id", awards_event_id)
    .order("display_order", { ascending: true })
  
  if (error) throw error
  return data
}

export async function addNominee(nominee: {
  awards_event_id: string
  category_id: string
  full_name: string
  bio?: string
  image_url?: string
  achievement?: string
  university?: string
  email?: string
  phone?: string
}) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("nominees")
    .insert([
      {
        ...nominee,
        created_by: (await supabase.auth.getUser()).data.user?.id,
      },
    ])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getNominees(
  awards_event_id: string,
  category_id?: string
) {
  const supabase = await createClient()
  
  let query = supabase
    .from("nominees")
    .select("*")
    .eq("awards_event_id", awards_event_id)
  
  if (category_id) {
    query = query.eq("category_id", category_id)
  }
  
  const { data, error } = await query.order("votes_count", {
    ascending: false,
  })
  
  if (error) throw error
  return data
}

export async function updateNominee(
  id: string,
  updates: {
    full_name?: string
    bio?: string
    image_url?: string
    achievement?: string
    university?: string
    email?: string
    phone?: string
  }
) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("nominees")
    .update(updates)
    .eq("id", id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function deleteNominee(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase.from("nominees").delete().eq("id", id)
  
  if (error) throw error
}

export async function submitVote(nominee_id: string, awards_event_id: string) {
  const supabase = await createClient()
  
  const user = await supabase.auth.getUser()
  if (!user.data.user) throw new Error("User not authenticated")
  
  // Check if user has already voted for this nominee
  const { data: existingVote } = await supabase
    .from("votes")
    .select("id")
    .eq("awards_event_id", awards_event_id)
    .eq("nominee_id", nominee_id)
    .eq("voter_id", user.data.user.id)
    .single()
  
  if (existingVote) {
    throw new Error("You have already voted for this nominee")
  }
  
  // Insert vote
  const { data: vote, error: voteError } = await supabase
    .from("votes")
    .insert([
      {
        awards_event_id,
        nominee_id,
        voter_id: user.data.user.id,
        voter_email: user.data.user.email,
      },
    ])
    .select()
    .single()
  
  if (voteError) throw voteError
  
  // Update nominee votes count
  const { error: updateError } = await supabase.rpc("increment_votes", {
    nominee_id,
  })
  
  if (updateError) {
    // If RPC function doesn't exist, manually update
    const { data: nominee } = await supabase
      .from("nominees")
      .select("votes_count")
      .eq("id", nominee_id)
      .single()
    
    if (nominee) {
      await supabase
        .from("nominees")
        .update({ votes_count: (nominee.votes_count || 0) + 1 })
        .eq("id", nominee_id)
    }
  }
  
  return vote
}

export async function getVoteCounts(awards_event_id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("votes")
    .select("nominee_id, nominees(full_name, category_id)")
    .eq("awards_event_id", awards_event_id)
  
  if (error) throw error
  
  // Group by nominee
  const votesByNominee = data.reduce(
    (acc, vote) => {
      const nomineeId = vote.nominee_id
      acc[nomineeId] = (acc[nomineeId] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )
  
  return votesByNominee
}

export async function hasUserVoted(
  awards_event_id: string,
  nominee_id: string,
  voter_id: string
) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("votes")
    .select("id")
    .eq("awards_event_id", awards_event_id)
    .eq("nominee_id", nominee_id)
    .eq("voter_id", voter_id)
    .single()
  
  return !!data
}
