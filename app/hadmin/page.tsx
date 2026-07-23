import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { formatCreatedAt, getEntries, type EntryFilters } from "@/lib/mongodb";
import { logoutAction } from "./actions";

export const metadata = {
  title: "Admin | Vogue Jewellers",
};

function buildExportHref(base: string, filters: EntryFilters) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

export default async function HadminPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  if (!(await isAdminAuthenticated())) {
    redirect("/hadmin/login");
  }

  const sp = await searchParams;
  const filters: EntryFilters = {
    q: typeof sp.q === "string" ? sp.q : undefined,
    from: typeof sp.from === "string" ? sp.from : undefined,
    to: typeof sp.to === "string" ? sp.to : undefined,
  };

  const entries = await getEntries(filters);

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-10 text-zinc-100 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">
              Vogue Jewellers
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-zinc-50">
              Giveaway Registrations
            </h1>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-red-500/50 hover:text-red-300"
            >
              Log out
            </button>
          </form>
        </div>

        <form
          method="get"
          className="mb-6 flex flex-wrap items-end gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4"
        >
          <div className="min-w-[200px] flex-1">
            <label className="mb-1 block text-xs font-medium text-zinc-400">
              Search (name, email, phone)
            </label>
            <input
              type="text"
              name="q"
              defaultValue={filters.q}
              placeholder="Search entries..."
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950/80 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">
              From
            </label>
            <input
              type="date"
              name="from"
              defaultValue={filters.from}
              className="rounded-lg border border-zinc-700 bg-zinc-950/80 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">
              To
            </label>
            <input
              type="date"
              name="to"
              defaultValue={filters.to}
              className="rounded-lg border border-zinc-700 bg-zinc-950/80 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-amber-400"
          >
            Filter
          </button>
          {(filters.q || filters.from || filters.to) && (
            <a
              href="/hadmin"
              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-200"
            >
              Clear
            </a>
          )}
        </form>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-zinc-400">
            {entries.length} {entries.length === 1 ? "entry" : "entries"} found
          </p>
          <div className="flex gap-2">
            <a
              href={buildExportHref("/api/hadmin/export/csv", filters)}
              className="rounded-lg border border-amber-500/40 px-4 py-2 text-sm font-medium text-amber-400 transition-colors hover:bg-amber-500/10"
            >
              Download CSV
            </a>
            <a
              href={buildExportHref("/api/hadmin/export/pdf", filters)}
              className="rounded-lg border border-amber-500/40 px-4 py-2 text-sm font-medium text-amber-400 transition-colors hover:bg-amber-500/10"
            >
              Download PDF
            </a>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-900 text-xs uppercase tracking-wide text-zinc-400">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Registered At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {entries.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-zinc-500"
                  >
                    No entries match your filters.
                  </td>
                </tr>
              ) : (
                entries.map((entry) => (
                  <tr
                    key={String(entry._id)}
                    className="bg-zinc-950/40 hover:bg-zinc-900/60"
                  >
                    <td className="px-4 py-3 text-zinc-100">{entry.name}</td>
                    <td className="px-4 py-3 text-zinc-300">{entry.email}</td>
                    <td className="px-4 py-3 text-zinc-300">{entry.phone}</td>
                    <td className="px-4 py-3 text-zinc-300">{entry.role || "N/A"}</td>
                    <td className="px-4 py-3 text-zinc-400">
                      {formatCreatedAt(entry.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
