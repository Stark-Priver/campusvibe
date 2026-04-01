import AdminShell from "../../AdminShell"
import { requireAdministrator } from "../../guard"
import { createAdminClient } from "@/lib/supabase/server"
import { createListing, updateListing, deleteListing } from "../../actions"
import type { Database } from "@/types/database"

type Props = { params: Promise<{ role: string }> }

export default async function AdminContentMarketplacePage({ params }: Props) {
  const { role } = await params
  const user = await requireAdministrator(role)
  const supabase = await createAdminClient()

  const { data: listings } = await supabase
    .from("marketplace_listings")
    .select("id, title, slug, category, condition, price, currency, seller_name, is_published, updated_at")
    .order("updated_at", { ascending: false })
    .limit(100)

  return (
    <AdminShell role={role} section="content-marketplace" user={user} breadcrumb={["Home", "Admin", "Content", "Marketplace"]}>
      <section className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
        <h2 className="font-section font-bold text-slate-900 mb-3">Create Marketplace Listing</h2>
        <form action={createListing.bind(null, role)} className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input name="title" placeholder="Title" className="md:col-span-2 rounded-lg border border-slate-300 px-3 py-2 text-sm" required />
          <input name="slug" placeholder="Slug" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <input name="category" placeholder="Category" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" defaultValue="General" />
          <input name="condition" placeholder="Condition" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" defaultValue="Good" />
          <input name="price" type="number" step="0.01" placeholder="Price" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <input name="currency" defaultValue="TZS" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <input name="seller_name" defaultValue="CampusVibe" placeholder="Seller Name" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <input name="university" placeholder="University" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <label className="inline-flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" name="is_published" /> Published</label>
          <textarea name="description" placeholder="Description" className="md:col-span-3 rounded-lg border border-slate-300 px-3 py-2 text-sm min-h-24" />
          <button className="rounded-lg bg-[#3A22A3] px-3 py-2 text-white text-sm">Create Listing</button>
        </form>
      </section>

      <section className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm overflow-x-auto">
        <h2 className="font-section font-bold text-slate-900 mb-3">Marketplace Listing Table</h2>
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase text-slate-500 border-b border-slate-100">
              <th className="py-2 pr-3">Listing</th><th className="py-2 pr-3">Category</th><th className="py-2 pr-3">Price</th><th className="py-2 pr-3">Status</th><th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(listings ?? []).map((item: Database["public"]["Tables"]["marketplace_listings"]["Row"]) => (
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
      </section>
    </AdminShell>
  )
}
