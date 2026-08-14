import { useState } from "react";
import MaterialIcon from "../components/icons/MaterialIcon.jsx";
import Avatar from "../components/Avatar.jsx";

const FILTERS = ["All", "New", "Follow-up", "Booked", "Lost"];

const LEADS = [
  {
    name: "Sarah Johnson",
    service: "Balayage • $150",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDlkIkeMVpCkxt4UGHMzsdST0RxUCkhwLax0SQ5OLwhmhOVMO5T9IYPS5-ooepx0RGNeYFh6G8xWPxbD-1GIenvRPF1wwKWoqNCjPQVprpqpgv33x2YThc2oDcl2noQWsGWEOHlzloi8SgTHPlG1F-0bWGNYJCx0IBBY7O8nlYqNFwAf0MKZs_exe0HAWKbCRNaRktaGfKtZjSzlxpkVo6dYq3FoV6s6A8EetisdP88hwrdmx0P8CJi",
    source: "Instagram",
    sourceStyle: "bg-[#F3E5F5] text-[#7B1FA2]",
    dot: "bg-error",
    label: "High potential",
    time: "2h ago",
    action: "Follow Up",
    actionStyle: "bg-primary-container text-on-primary-container",
  },
  {
    name: "Maya Williams",
    service: "Hair Color • $80",
    initial: "M",
    source: "WhatsApp",
    sourceStyle: "bg-[#E8F5E9] text-[#388E3C]",
    sourceIcon: "chat",
    dot: "bg-tertiary-fixed-dim",
    label: "Follow-up due",
    time: "Yesterday",
    action: "View",
    actionStyle: "bg-transparent border border-surface-variant text-on-surface hover:bg-surface-variant",
    vip: true,
  },
  {
    name: "Emma Davis",
    service: "Facial • $120",
    initial: "E",
    source: "Website",
    sourceStyle: "bg-surface-container text-on-surface-variant",
    sourceIcon: "language",
    dot: "bg-primary",
    label: "Booked",
    action: "View",
    actionStyle: "bg-transparent border border-surface-variant text-on-surface hover:bg-surface-variant",
    faded: true,
  },
];

export default function Leads() {
  const [activeFilter, setActiveFilter] = useState("All");

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
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full font-label-lg text-label-lg whitespace-nowrap transition-transform active:scale-95 ${
                activeFilter === filter
                  ? "bg-primary-container text-on-primary-container"
                  : "bg-surface-container border border-surface-variant text-on-surface-variant hover:bg-surface-variant"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <main className="px-container-padding flex flex-col gap-stack-md pb-40 relative z-10">
        {LEADS.map((lead) => (
          <div
            key={lead.name}
            className={`bg-surface-container-lowest rounded-2xl p-5 soft-shadow border border-surface-variant relative ${
              lead.faded ? "opacity-80" : ""
            }`}
          >
            {lead.vip && (
              <div className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              </div>
            )}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <Avatar src={lead.avatar} alt={lead.name} initial={lead.initial} />
                <div>
                  <h3 className="font-headline-md text-headline-md text-on-surface text-[18px] leading-tight">
                    {lead.name}
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">{lead.service}</p>
                </div>
              </div>
              <div className={`px-2 py-1 rounded font-label-sm text-label-sm flex items-center gap-1 ${lead.sourceStyle}`}>
                {lead.sourceIcon && <MaterialIcon name={lead.sourceIcon} filled className="text-[12px]" />}
                {lead.source}
              </div>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span className={`w-2 h-2 rounded-full ${lead.dot}`} />
              <span
                className={`font-label-lg text-label-lg uppercase tracking-wider text-[10px] ${
                  lead.label === "Booked" ? "text-primary" : "text-on-surface-variant"
                }`}
              >
                {lead.label}
              </span>
              {lead.time && (
                <>
                  <span className="text-secondary mx-1">•</span>
                  <span className="font-label-lg text-label-lg text-secondary uppercase tracking-wider text-[10px]">
                    {lead.time}
                  </span>
                </>
              )}
            </div>
            <div className="flex gap-3">
              <button
                className={`flex-1 py-2.5 rounded-lg font-label-lg text-label-lg active:scale-95 transition-transform ${lead.actionStyle}`}
              >
                {lead.action}
              </button>
            </div>
          </div>
        ))}
      </main>

      <button
        aria-label="Add lead"
        className="fixed bottom-24 right-6 md:bottom-8 md:right-8 w-14 h-14 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center soft-shadow active:scale-90 transition-transform z-40"
      >
        <MaterialIcon name="add" className="text-[28px]" />
      </button>
    </>
  );
}
