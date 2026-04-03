import AdminShell from "../../AdminShell"
import { requireAdministrator } from "../../guard"
import { createAdminClient } from "@/lib/supabase/server"
import { createListing, updateListing, deleteListing } from "../../actions"

type Props = { params: Promise<{ role: string }> }

export default async function AdminContentMarketplacePage({ params, searchParams }: Props & { searchParams: Promise<{ q?: string; status?: string }> }) {
  const { role } = await params
  const { q = "", status = "all" } = await searchParams
  const user = await requireAdministrator(role)
  const supabase = await createAdminClient()

  const { data: listings } = await supabase
    .from("marketplace_listings")
    .select("id, title, slug, category, condition, price, currency, seller_name, is_published, updated_at")
    .order("updated_at", { ascending: false })
    .limit(100)

  const filtered = (listings ?? []).filter((item) => {
    const matchesQ = !q || [item.title, item.slug, item.category, item.seller_name ?? ""].join(" ").toLowerCase().includes(q.toLowerCase())
    const matchesStatus = status === "all" || (status === "published" ? item.is_published : !item.is_published)
    return matchesQ && matchesStatus
  })

  return (
    <AdminShell role={role} section="content-marketplace" user={user} breadcrumb={["Home", "Admin", "Content", "Marketplace"]}>
      <section className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
        <h2 className="font-section font-bold text-slate-900 mb-1">Create Marketplace Listing</h2>
        <p className="text-sm text-slate-600 mb-4">Publish inventory with pricing and seller context for student marketplace operations.</p>
        <form action={createListing.bind(null, role)} className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <label className="md:col-span-2 text-xs text-slate-600">Listing title
            <input name="title" placeholder="Title" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" required />
          </label>
          <label className="text-xs text-slate-600">Slug
            <input name="slug" placeholder="Slug" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="text-xs text-slate-600">Category
            <input name="category" placeholder="Category" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" defaultValue="General" />
          </label>
          <label className="text-xs text-slate-600">Condition
            <input name="condition" placeholder="Condition" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" defaultValue="Good" />
          </label>
          <label className="text-xs text-slate-600">Price
            <input name="price" type="number" step="0.01" placeholder="Price" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="text-xs text-slate-600">Currency
            <input name="currency" defaultValue="TZS" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="text-xs text-slate-600">Seller name
            <input name="seller_name" defaultValue="CampusVibe" placeholder="Seller Name" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="text-xs text-slate-600">University
            <input name="university" placeholder="University" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" name="is_published" /> Published</label>
          <label className="md:col-span-3 text-xs text-slate-600">Description
            <textarea name="description" placeholder="Description" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm min-h-24" />
          </label>
          <button className="rounded-lg bg-[#3A22A3] px-3 py-2 text-white text-sm">Create Listing</button>
        </form>
      </section>

      <section className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm overflow-x-auto">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-3">
          <div>
            <h2 className="font-section font-bold text-slate-900">Marketplace Listing Table</h2>
            <p className="text-xs text-slate-500">{filtered.length} of {(listings ?? []).length} listings shown</p>
          </div>
          <form method="get" className="flex flex-wrap gap-2">
            <input name="q" defaultValue={q} placeholder="Search listing, slug, seller" className="w-[250px] rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            <select name="status" defaultValue={status} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
              <option value="all">All statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            <button className="rounded-lg bg-slate-800 text-white px-3 py-2 text-sm">Apply</button>
          </form>
        </div>
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">No listings matched your filters.</div>
        ) : (
          <div className="max-h-[560px] overflow-auto rounded-xl border border-slate-200">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 bg-slate-50 z-10">
            <tr className="text-left text-xs uppercase text-slate-500 border-b border-slate-100">
              <th className="py-2 pr-3">Listing</th><th className="py-2 pr-3">Category</th><th className="py-2 pr-3">Price</th><th className="py-2 pr-3">Status</th><th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-b border-slate-50 align-top last:border-0">
                <td className="py-2.5 pr-3">
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-500">/{item.slug}</p>
                </td>
                <td className="py-2.5 pr-3 text-slate-700">{item.category}</td>
                <td className="py-2.5 pr-3 text-slate-700">{item.price} {item.currency}</td>
                <td className="py-2.5 pr-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${item.is_published ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                    {item.is_published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="py-2.5">
                  <form action={updateListing.bind(null, role)} className="grid grid-cols-1 md:grid-cols-6 gap-2 mb-2">
                    <input type="hidden" name="id" value={item.id} />
                    <input name="title" defaultValue={item.title} className="rounded border border-slate-300 px-2 py-1" />
                    <input name="slug" defaultValue={item.slug} className="rounded border border-slate-300 px-2 py-1" />
                    <input name="category" defaultValue={item.category} className="rounded border border-slate-300 px-2 py-1" />
                    <input name="condition" defaultValue={item.condition} className="rounded border border-slate-300 px-2 py-1" />
                    <input name="price" type="number" step="0.01" defaultValue={item.price} className="rounded border border-slate-300 px-2 py-1" />
                    <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" name="is_published" defaultChecked={item.is_published} /> Published</label>
                    <button className="rounded bg-slate-800 text-white px-2 py-1">Update</button>
                  </form>
                  <form action={deleteListing.bind(null, role)}>
                    <input type="hidden" name="id" value={item.id} />
                    <button className="rounded bg-red-600 text-white px-2 py-1">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
          </div>
        )}
      </section>
    </AdminShell>
  )
}
