import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MaterialIcon from "../components/icons/MaterialIcon.jsx";
import Avatar from "../components/Avatar.jsx";
import { useSalon } from "../lib/SalonContext.jsx";
import { listLeads } from "../lib/api/leads.js";

// Simple placeholder heuristic until real lead scoring exists: leads worth
// $100+ are flagged "High Intent". No AI/automation involved.
const HIGH_INTENT_THRESHOLD = 100;

function timeAgo(dateString) {
  if (!dateString) return null;
  const diffMs = Date.now() - new Date(dateString).getTime();
  const hours = Math.round(diffMs / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

export default function Opportunities() {
  const { salon } = useSalon();
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!salon) return;
    let cancelled = false;
    setLoading(true);
    listLeads(salon.id).then(({ data, error: fetchError }) => {
      if (cancelled) return;
      if (fetchError) {
        setError(fetchError.message);
        setLeads([]);
      } else {
        setError("");
        setLeads(data ?? []);
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [salon]);

  const openLeads = leads.filter((l) => l.status === "new" || l.status === "follow_up");
  const potentialRevenue = openLeads.reduce((sum, l) => sum + (Number(l.potential_value) || 0), 0);
  const highIntentCount = openLeads.filter((l) => (Number(l.potential_value) || 0) >= HIGH_INTENT_THRESHOLD).length;
  const followUpsDue = leads.filter((l) => l.status === "follow_up").length;
  const topOpportunities = [...openLeads]
    .sort((a, b) => (Number(b.potential_value) || 0) - (Number(a.potential_value) || 0))
    .slice(0, 5);

  const bookedThisMonth = leads.filter((l) => {
    if (l.status !== "booked") return false;
    const d = new Date(l.created_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const recoveredRevenue = bookedThisMonth.reduce((sum, l) => sum + (Number(l.potential_value) || 0), 0);
  const totalForBar = potentialRevenue + recoveredRevenue || 1;
  const potentialPct = Math.round((potentialRevenue / totalForBar) * 100);
  const recoveredPct = 100 - potentialPct;

  return (
    <>
      <header className="bg-surface flex justify-between items-center px-container-padding pt-stack-lg pb-stack-md w-full sticky top-0 z-30">
        <h1 className="font-headline-md text-headline-md text-primary">Opportunities</h1>
        <button
          aria-label="Notifications"
          className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:opacity-80 transition-opacity"
        >
          <MaterialIcon name="notifications" className="text-primary" />
        </button>
      </header>

      <main className="flex-1 px-container-padding pb-40 space-y-stack-lg">
        <section className="bg-surface-container-lowest rounded-[24px] p-6 shadow-[0px_10px_30px_rgba(45,45,45,0.05)] border border-primary-container/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container opacity-20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          <div className="relative z-10 space-y-4">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface">
                {loading ? "…" : openLeads.length} Customer{openLeads.length === 1 ? "" : "s"} Ready to Recover
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                These customers showed interest but haven't booked yet.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="space-y-1">
                <span className="font-label-lg text-label-lg text-on-surface-variant uppercase tracking-widest">
                  Potential Revenue
                </span>
                <p className="font-headline-md text-headline-md text-primary">
                  ${loading ? "—" : potentialRevenue.toLocaleString()}
                </p>
              </div>
              <div className="space-y-1">
                <span className="font-label-lg text-label-lg text-on-surface-variant uppercase tracking-widest">
                  High-Intent Leads
                </span>
                <p className="font-headline-md text-headline-md text-primary">{loading ? "—" : highIntentCount}</p>
              </div>
            </div>
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 bg-error-container text-on-error-container px-3 py-1.5 rounded-full">
                <MaterialIcon name="schedule" className="text-[16px]" />
                <span className="font-label-lg text-label-lg">Follow-ups Due: {loading ? "—" : followUpsDue}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-stack-md">
          <h3 className="font-headline-md text-[20px] leading-tight text-on-surface">Top Opportunities</h3>

          {loading ? (
            <p className="font-body-md text-body-md text-on-surface-variant">Loading…</p>
          ) : error ? (
            <p className="font-body-md text-body-md text-error">{error}</p>
          ) : topOpportunities.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-[24px] p-8 soft-shadow border border-surface-variant text-center">
              <MaterialIcon name="trending_up" className="text-on-surface-variant text-4xl mb-3" />
              <p className="font-body-md text-body-md text-on-surface-variant">
                No open opportunities yet. New and follow-up leads will show up here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {topOpportunities.map((lead) => {
                const highIntent = (Number(lead.potential_value) || 0) >= HIGH_INTENT_THRESHOLD;
                return (
                  <article
                    key={lead.id}
                    className="bg-surface-container-lowest rounded-[24px] p-5 shadow-[0px_10px_30px_rgba(45,45,45,0.05)] flex flex-col gap-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3">
                        <Avatar initial={lead.customer_name.charAt(0).toUpperCase()} alt={lead.customer_name} />
                        <div>
                          <h4 className="font-label-lg text-body-lg text-on-surface font-semibold">{lead.customer_name}</h4>
                          <p className="font-body-md text-label-lg text-on-surface-variant">
                            {[lead.service, lead.source].filter(Boolean).join(" • ") || "—"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                          {lead.potential_value ? `$${lead.potential_value}` : "—"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-2 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1 ${
                          highIntent ? "bg-surface-container text-on-surface" : "bg-surface-variant text-on-surface-variant"
                        }`}
                      >
                        {highIntent && <span className="text-[12px]">🔥</span>}
                        {highIntent ? "High Intent" : "Medium Intent"}
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant ml-auto">
                        {lead.last_contact_at ? `Last contact: ${timeAgo(lead.last_contact_at)}` : "Not contacted yet"}
                      </span>
                    </div>
                    <button
                      onClick={() => navigate(`/conversations/${lead.id}`)}
                      className="w-full py-3 mt-1 border border-outline-variant rounded-xl font-label-lg text-label-lg text-on-surface hover:bg-surface-variant transition-colors"
                    >
                      Review
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="bg-surface-container-lowest rounded-[24px] p-6 shadow-[0px_10px_30px_rgba(45,45,45,0.05)] space-y-5">
          <h3 className="font-headline-md text-[20px] leading-tight text-on-surface">Recovered This Month</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-1">
                Bookings
              </span>
              <span className="font-headline-md text-[20px] text-on-surface">{loading ? "—" : bookedThisMonth.length}</span>
            </div>
            <div>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-1">
                Revenue
              </span>
              <span className="font-headline-md text-[20px] text-primary">${loading ? "—" : recoveredRevenue.toLocaleString()}</span>
            </div>
          </div>
          <div className="space-y-2 pt-2">
            <div className="flex justify-between font-label-sm text-label-sm">
              <span className="text-on-surface-variant">Potential (${potentialRevenue.toLocaleString()})</span>
              <span className="text-primary font-semibold">Recovered (${recoveredRevenue.toLocaleString()})</span>
            </div>
            <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden flex">
              <div className="h-full bg-secondary-fixed-dim" style={{ width: `${potentialPct}%` }} />
              <div className="h-full bg-primary" style={{ width: `${recoveredPct}%` }} />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
