import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MaterialIcon from "../components/icons/MaterialIcon.jsx";
import Avatar from "../components/Avatar.jsx";
import FloatingInput from "../components/FloatingInput.jsx";
import FloatingSelect from "../components/FloatingSelect.jsx";
import { useSalon } from "../lib/SalonContext.jsx";
import { listLeads, createLead, updateLead, deleteLead } from "../lib/api/leads.js";

const SOURCE_OPTIONS = [
  { value: "instagram", label: "Instagram" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "website", label: "Website" },
  { value: "manual", label: "Manual" },
];

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "follow_up", label: "Follow-up" },
  { value: "booked", label: "Booked" },
  { value: "lost", label: "Lost" },
];

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

// Converts a stored ISO timestamp to the local "YYYY-MM-DDTHH:mm" value a
// <input type="datetime-local"> expects.
function toDateTimeLocalValue(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function LeadFormModal({ onClose, onSaved, salonId, initialLead }) {
  const isEdit = Boolean(initialLead);
  const [customerName, setCustomerName] = useState(initialLead?.customer_name ?? "");
  const [customerPhone, setCustomerPhone] = useState(initialLead?.customer_phone ?? "");
  const [service, setService] = useState(initialLead?.service ?? "");
  const [source, setSource] = useState(initialLead?.source ?? "manual");
  const [potentialValue, setPotentialValue] = useState(initialLead?.potential_value ?? "");
  const [status, setStatus] = useState(initialLead?.status ?? "new");
  const [lastContactAt, setLastContactAt] = useState(toDateTimeLocalValue(initialLead?.last_contact_at));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName.trim()) return;
    setSubmitting(true);
    setError("");
    const payload = {
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      service: service.trim(),
      source,
      potentialValue: potentialValue !== "" ? Number(potentialValue) : null,
      status,
      lastContactAt: lastContactAt ? new Date(lastContactAt).toISOString() : null,
    };
    const { data, error: saveError } = isEdit
      ? await updateLead(initialLead.id, payload)
      : await createLead(salonId, payload);
    setSubmitting(false);
    if (saveError) {
      setError(saveError.message);
      return;
    }
    onSaved(data);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/40 px-4 pb-4 md:pb-0">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-surface-container-lowest rounded-[24px] p-6 soft-shadow border border-outline-variant/30 space-y-stack-md max-h-[85vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-headline-md text-headline-md text-primary">{isEdit ? "Edit Lead" : "Add Lead"}</h2>
          <button type="button" aria-label="Close" onClick={onClose} className="text-on-surface-variant">
            <MaterialIcon name="close" />
          </button>
        </div>
        <FloatingInput id="customerName" label="Customer Name" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
        <FloatingInput id="customerPhone" label="Phone" type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
        <FloatingInput id="service" label="Service" value={service} onChange={(e) => setService(e.target.value)} />
        <FloatingSelect id="source" label="Source" value={source} onChange={(e) => setSource(e.target.value)} options={SOURCE_OPTIONS} />
        <FloatingInput id="potentialValue" label="Potential Value ($)" type="number" value={potentialValue} onChange={(e) => setPotentialValue(e.target.value)} />
        <FloatingSelect id="status" label="Status" value={status} onChange={(e) => setStatus(e.target.value)} options={STATUS_OPTIONS} />
        <div>
          <label htmlFor="lastContactAt" className="block text-on-surface-variant font-label-lg text-label-lg mb-1">
            Last Contact
          </label>
          <input
            id="lastContactAt"
            type="datetime-local"
            value={lastContactAt}
            onChange={(e) => setLastContactAt(e.target.value)}
            className="block w-full px-0 py-3 border-0 border-b border-outline-variant bg-transparent focus:ring-0 focus:border-primary text-on-surface font-body-lg"
          />
        </div>
        {error && <p className="font-body-md text-body-md text-error">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary-container text-on-primary-container font-label-lg text-label-lg py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {submitting ? "Saving…" : isEdit ? "Save Changes" : "Save Lead"}
        </button>
      </form>
    </div>
  );
}

function ConfirmDeleteModal({ lead, onCancel, onConfirm, deleting, error }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/40 px-4 pb-4 md:pb-0">
      <div className="w-full max-w-sm bg-surface-container-lowest rounded-[24px] p-6 soft-shadow border border-outline-variant/30 space-y-stack-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center flex-shrink-0">
            <MaterialIcon name="delete" filled className="text-error" />
          </div>
          <h2 className="font-headline-md text-headline-md text-primary">Delete Lead</h2>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Are you sure you want to delete <span className="font-semibold text-on-surface">{lead.customer_name}</span>?
          This can't be undone.
        </p>
        {error && <p className="font-body-md text-body-md text-error">{error}</p>}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border border-surface-variant text-on-surface font-label-lg text-label-lg hover:bg-surface-variant transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 py-3 rounded-xl bg-error text-on-error font-label-lg text-label-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
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
  const [editingLead, setEditingLead] = useState(null);
  const [deletingLead, setDeletingLead] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

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

  const handleConfirmDelete = async () => {
    setDeleting(true);
    setDeleteError("");
    const { error } = await deleteLead(deletingLead.id);
    setDeleting(false);
    if (error) {
      setDeleteError(error.message);
      return;
    }
    setLeads((prev) => prev.filter((l) => l.id !== deletingLead.id));
    setDeletingLead(null);
  };

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
                  <button
                    aria-label={`Edit ${lead.customer_name}`}
                    onClick={() => setEditingLead(lead)}
                    className="w-11 h-11 flex-shrink-0 rounded-lg border border-surface-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-variant transition-colors active:scale-95"
                  >
                    <MaterialIcon name="edit" className="text-[18px]" />
                  </button>
                  <button
                    aria-label={`Delete ${lead.customer_name}`}
                    onClick={() => {
                      setDeleteError("");
                      setDeletingLead(lead);
                    }}
                    className="w-11 h-11 flex-shrink-0 rounded-lg border border-error/30 flex items-center justify-center text-error hover:bg-error-container/30 transition-colors active:scale-95"
                  >
                    <MaterialIcon name="delete" className="text-[18px]" />
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
        <LeadFormModal
          salonId={salon.id}
          onClose={() => setShowAddModal(false)}
          onSaved={(newLead) => {
            setShowAddModal(false);
            setLeads((prev) => [newLead, ...prev]);
          }}
        />
      )}

      {editingLead && (
        <LeadFormModal
          initialLead={editingLead}
          onClose={() => setEditingLead(null)}
          onSaved={(updated) => {
            setEditingLead(null);
            setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
          }}
        />
      )}

      {deletingLead && (
        <ConfirmDeleteModal
          lead={deletingLead}
          deleting={deleting}
          error={deleteError}
          onCancel={() => setDeletingLead(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  );
}
