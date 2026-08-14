import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MaterialIcon from "../components/icons/MaterialIcon.jsx";
import Avatar from "../components/Avatar.jsx";
import FloatingInput from "../components/FloatingInput.jsx";
import { useSalon } from "../lib/SalonContext.jsx";
import { listLeads, createLead } from "../lib/api/leads.js";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "New", value: "new" },
  { label: "Follow-up", value: "follow_up" },
  { label: "Booked", value: "booked" },
  { label: "Lost", value: "lost" },
];

const SOURCE_META = {
  instagram: { label: "Instagram", className: "bg-[#F3E5F5] text-[#7B1FA2]", icon: null },
  whatsapp: { label: "WhatsApp", className: "bg-[#E8F5E9] text-[#388E3C]", icon: "chat" },
  website: { label: "Website", className: "bg-surface-container text-on-surface-variant", icon: "language" },
  manual: { label: "Manual", className: "bg-surface-container text-on-surface-variant", icon: "edit" },
};

const STATUS_META = {
  new: { dot: "bg-error", label: "New inquiry" },
  follow_up: { dot: "bg-tertiary-fixed-dim", label: "Follow-up due" },
  booked: { dot: "bg-primary", label: "Booked" },
  lost: { dot: "bg-outline", label: "Lost" },
};

function AddLeadModal({ onClose, onCreated, salonId }) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [service, setService] = useState("");
  const [potentialValue, setPotentialValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName.trim()) return;
    setSubmitting(true);
    setError("");
    const { data, error: createError } = await createLead(salonId, {
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      service: service.trim(),
      potentialValue: potentialValue ? Number(potentialValue) : null,
      source: "manual",
    });
    setSubmitting(false);
    if (createError) {
      setError(createError.message);
      return;
    }
    onCreated(data);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/40 px-4 pb-4 md:pb-0">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-surface-container-lowest rounded-[24px] p-6 soft-shadow border border-outline-variant/30 space-y-stack-md"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-headline-md text-headline-md text-primary">Add Lead</h2>
          <button type="button" aria-label="Close" onClick={onClose} className="text-on-surface-variant">
            <MaterialIcon name="close" />
          </button>
        </div>
        <FloatingInput id="customerName" label="Customer Name" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
        <FloatingInput id="customerPhone" label="Phone" type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
        <FloatingInput id="service" label="Service" value={service} onChange={(e) => setService(e.target.value)} />
        <FloatingInput id="potentialValue" label="Potential Value ($)" type="number" value={potentialValue} onChange={(e) => setPotentialValue(e.target.value)} />
        {error && <p className="font-body-md text-body-md text-error">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary-container text-on-primary-container font-label-lg text-label-lg py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {submitting ? "Adding…" : "Add Lead"}
        </button>
      </form>
    </div>
  );
}

export default function Leads() {
  const { salon } = useSalon();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const refresh = () => {
    if (!salon) return;
    setLoading(true);
    listLeads(salon.id).then(({ data }) => {
      setLeads(data ?? []);
      setLoading(false);
    });
  };

  useEffect(refresh, [salon]);

  const visibleLeads = activeFilter === "all" ? leads : leads.filter((l) => l.status === activeFilter);

  return (
    <>
      <header className="px-container-padding pt-stack-lg pb-stack-md flex justify-between items-center bg-surface sticky top-0 z-30">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">Leads</h1>
        <button
          aria-label="Search leads"
          className="w-10 h-10 rounded-full border border-surface-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-variant transition-colors"
        >
          <MaterialIcon name="search" />
        </button>
      </header>

      <div className="px-container-padding pb-stack-md overflow-x-auto hide-scrollbar">
        <div className="flex space-x-2">
          {FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`px-4 py-2 rounded-full font-label-lg text-label-lg whitespace-nowrap transition-transform active:scale-95 ${
                activeFilter === filter.value
                  ? "bg-primary-container text-on-primary-container"
                  : "bg-surface-container border border-surface-variant text-on-surface-variant hover:bg-surface-variant"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <main className="px-container-padding flex flex-col gap-stack-md pb-40 relative z-10">
        {loading ? (
          <p className="font-body-md text-body-md text-on-surface-variant">Loading leads…</p>
        ) : visibleLeads.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-2xl p-8 soft-shadow border border-surface-variant text-center">
            <MaterialIcon name="person_search" className="text-on-surface-variant text-4xl mb-3" />
            <p className="font-body-lg text-body-lg text-on-surface font-semibold mb-1">No leads yet</p>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Leads from Instagram, WhatsApp, and your website will appear here once customers reach out.
            </p>
          </div>
        ) : (
          visibleLeads.map((lead) => {
            const source = SOURCE_META[lead.source] ?? SOURCE_META.manual;
            const status = STATUS_META[lead.status] ?? STATUS_META.new;
            return (
              <div
                key={lead.id}
                className={`bg-surface-container-lowest rounded-2xl p-5 soft-shadow border border-surface-variant relative ${
                  lead.status === "lost" ? "opacity-80" : ""
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar initial={lead.customer_name.charAt(0).toUpperCase()} alt={lead.customer_name} />
                    <div>
                      <h3 className="font-headline-md text-headline-md text-on-surface text-[18px] leading-tight">
                        {lead.customer_name}
                      </h3>
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        {[lead.service, lead.potential_value ? `$${lead.potential_value}` : null].filter(Boolean).join(" • ") || "—"}
                      </p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded font-label-sm text-label-sm flex items-center gap-1 ${source.className}`}>
                    {source.icon && <MaterialIcon name={source.icon} filled className="text-[12px]" />}
                    {source.label}
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className={`w-2 h-2 rounded-full ${status.dot}`} />
                  <span
                    className={`font-label-lg text-label-lg uppercase tracking-wider text-[10px] ${
                      lead.status === "booked" ? "text-primary" : "text-on-surface-variant"
                    }`}
                  >
                    {status.label}
                  </span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/conversations/${lead.id}`)}
                    className={`flex-1 py-2.5 rounded-lg font-label-lg text-label-lg active:scale-95 transition-transform ${
                      lead.status === "new" || lead.status === "follow_up"
                        ? "bg-primary-container text-on-primary-container"
                        : "bg-transparent border border-surface-variant text-on-surface hover:bg-surface-variant"
                    }`}
                  >
                    {lead.status === "new" || lead.status === "follow_up" ? "Follow Up" : "View"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </main>

      <button
        aria-label="Add lead"
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-24 right-6 md:bottom-8 md:right-8 w-14 h-14 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center soft-shadow active:scale-90 transition-transform z-40"
      >
        <MaterialIcon name="add" className="text-[28px]" />
      </button>

      {showAddModal && salon && (
        <AddLeadModal
          salonId={salon.id}
          onClose={() => setShowAddModal(false)}
          onCreated={() => {
            setShowAddModal(false);
            refresh();
          }}
        />
      )}
    </>
  );
}
