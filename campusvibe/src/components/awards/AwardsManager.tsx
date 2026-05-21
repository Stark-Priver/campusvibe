"use client"

import { useState } from "react"
import { FormWithToast } from "@/components/ui/FormWithToast"
import Toast from "@/components/ui/Toast"

interface AwardsEvent {
  id: string
  title: string
  slug: string
  description?: string
  status: "draft" | "nominations_open" | "voting_open" | "voting_closed" | "completed"
  nominations_start_at?: string
  nominations_end_at?: string
  voting_start_at?: string
  voting_end_at?: string
  image_url?: string
  banner_url?: string
}

interface AwardsManagerProps {
  onEventCreated?: (event: AwardsEvent) => void
}

export function AwardsManager({ onEventCreated }: AwardsManagerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [events, setEvents] = useState<AwardsEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<AwardsEvent | null>(null)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/awards/events")
      if (!response.ok) throw new Error("Failed to fetch events")
      const data = await response.json()
      setEvents(data)
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : "Failed to fetch events",
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateEvent = async (formData: FormData) => {
    try {
      const payload = {
        title: formData.get("title"),
        slug: formData.get("slug"),
        description: formData.get("description"),
        nominations_start_at: formData.get("nominations_start_at"),
        nominations_end_at: formData.get("nominations_end_at"),
        voting_start_at: formData.get("voting_start_at"),
        voting_end_at: formData.get("voting_end_at"),
      }

      const response = await fetch("/api/awards/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error("Failed to create event")
      const event = await response.json()

      setEvents([event, ...events])
      setToast({ message: "Event created successfully!", type: "success" })
      onEventCreated?.(event)
      setIsOpen(false)
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : "Failed to create event",
        type: "error",
      })
    }
  }

  const handleStatusChange = async (eventId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/awards/events/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error("Failed to update event")
      const updatedEvent = await response.json()

      setEvents(events.map((e) => (e.id === eventId ? updatedEvent : e)))
      setToast({ message: "Event status updated!", type: "success" })
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : "Failed to update event",
        type: "error",
      })
    }
  }

  return (
    <div className="space-y-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Awards Events Manager</h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {isOpen ? "Cancel" : "Create Event"}
        </button>
      </div>

      {isOpen && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Create New Awards Event</h3>
          <form action={handleCreateEvent} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Event Title*</label>
              <input
                type="text"
                name="title"
                placeholder="e.g., Campus Excellence Awards 2026"
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">URL Slug*</label>
              <input
                type="text"
                name="slug"
                placeholder="e.g., campus-excellence-2026"
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                placeholder="Describe the awards event..."
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nominations Start
                </label>
                <input
                  type="datetime-local"
                  name="nominations_start_at"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nominations End
                </label>
                <input
                  type="datetime-local"
                  name="nominations_end_at"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Voting Start
                </label>
                <input
                  type="datetime-local"
                  name="voting_start_at"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Voting End
                </label>
                <input
                  type="datetime-local"
                  name="voting_end_at"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Create Event
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Your Events</h3>
        {loading ? (
          <div className="text-center py-8">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No events created yet
          </div>
        ) : (
          <div className="grid gap-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{event.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                    <div className="mt-3 flex items-center gap-4">
                      <span className="text-sm">
                        <strong>Status:</strong> {event.status}
                      </span>
                    </div>
                  </div>
                  <select
                    value={event.status}
                    onChange={(e) => handleStatusChange(event.id, e.target.value)}
                    className="px-3 py-1 border rounded-lg text-sm"
                  >
                    <option value="draft">Draft</option>
                    <option value="nominations_open">Nominations Open</option>
                    <option value="voting_open">Voting Open</option>
                    <option value="voting_closed">Voting Closed</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
