import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MaterialIcon from "../components/icons/MaterialIcon.jsx";
import { useSalon } from "../lib/SalonContext.jsx";
import { getLead, touchLastContact } from "../lib/api/leads.js";
import { listMessages, sendMessage, createFollowUp } from "../lib/api/conversations.js";

const SOURCE_ICON = { instagram: "photo_camera", whatsapp: "chat", website: "language", manual: "edit" };

const SUGGESTED_FOLLOW_UP = (name) =>
  `Hi ${name.split(" ")[0]} 👋 Just checking in! We have a few appointments available this week. Would you like me to help you find a time?`;

export default function Conversations() {
  const { leadId } = useParams();
  const { salon } = useSalon();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [editingSuggestion, setEditingSuggestion] = useState(false);
  const [suggestionSent, setSuggestionSent] = useState(false);
  const bottomRef = useRef(null);

  const loadThread = async () => {
    setLoading(true);
    const [{ data: leadData }, { data: messageData }] = await Promise.all([getLead(leadId), listMessages(leadId)]);
    setLead(leadData ?? null);
    setMessages(messageData ?? []);
    if (leadData) setSuggestion(SUGGESTED_FOLLOW_UP(leadData.customer_name));
    setLoading(false);
  };

  useEffect(() => {
    loadThread();
    setSuggestionSent(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leadId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!draft.trim() || !salon) return;
    setSending(true);
    const { data } = await sendMessage({ salonId: salon.id, leadId, message: draft.trim(), senderType: "salon" });
    if (data) {
      setMessages((prev) => [...prev, data]);
      const { data: updatedLead } = await touchLastContact(leadId);
      if (updatedLead) setLead(updatedLead);
    }
    setDraft("");
    setSending(false);
  };

  const handleSendSuggestion = async () => {
    if (!salon || !suggestion.trim()) return;
    setSending(true);
    const { data } = await sendMessage({ salonId: salon.id, leadId, message: suggestion.trim(), senderType: "salon" });
    if (data) setMessages((prev) => [...prev, data]);
    await createFollowUp({ salonId: salon.id, leadId, message: suggestion.trim() });
    const { data: updatedLead } = await touchLastContact(leadId);
    if (updatedLead) setLead(updatedLead);
    setSending(false);
    setSuggestionSent(true);
  };

  if (loading) {
    return <div className="px-container-padding py-stack-lg font-body-md text-body-md text-on-surface-variant">Loading…</div>;
  }

  if (!lead) {
    return (
      <div className="px-container-padding py-stack-lg text-center">
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-stack-md">Lead not found.</p>
        <button onClick={() => navigate("/conversations")} className="text-primary font-label-lg text-label-lg">
          Back to Conversations
        </button>
      </div>
    );
  }

  return (
    <>
      <header className="bg-surface w-full top-0 sticky flex justify-between items-center px-container-padding h-16 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/conversations")}
            aria-label="Go back"
            className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:opacity-80 transition-opacity active:scale-95 transition-transform"
          >
            <MaterialIcon name="arrow_back" className="text-primary" />
          </button>
          <div className="flex flex-col">
            <h1 className="font-headline-md text-headline-md text-primary">{lead.customer_name}</h1>
            <div className="flex items-center gap-2">
              <span className="font-label-lg text-label-lg text-secondary">{lead.service || "New inquiry"}</span>
              <span className="w-1 h-1 rounded-full bg-outline-variant" />
              <span className="font-label-sm text-label-sm text-secondary px-2 py-0.5 bg-surface-container-high rounded-full flex items-center gap-1">
                <MaterialIcon name={SOURCE_ICON[lead.source] ?? "edit"} className="text-[10px]" />
                {lead.source ?? "manual"}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow px-container-padding pt-stack-lg pb-40 flex flex-col gap-stack-lg w-full">
        <section className="flex flex-col gap-stack-md relative z-10">
          {messages.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-2xl p-6 soft-shadow border border-surface-variant/50 text-center">
              <p className="font-body-md text-body-md text-on-surface-variant">
                No messages yet with {lead.customer_name}.
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex w-full ${msg.sender_type === "salon" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`rounded-2xl px-4 py-3 shadow-[0px_4px_12px_rgba(45,45,45,0.02)] max-w-[85%] ${
                    msg.sender_type === "salon"
                      ? "bg-primary-container text-on-primary-container rounded-tr-sm"
                      : "bg-surface-container-lowest border border-surface-container-high text-on-surface rounded-tl-sm"
                  }`}
                >
                  <p className="font-body-md text-body-md">{msg.message}</p>
                  <span
                    className={`font-label-sm text-label-sm mt-1 block ${
                      msg.sender_type === "salon" ? "text-on-primary-container opacity-80 text-right" : "text-secondary"
                    }`}
                  >
                    {new Date(msg.created_at).toLocaleString([], { hour: "numeric", minute: "2-digit", month: "short", day: "numeric" })}
                  </span>
                </div>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </section>

        {!suggestionSent && (
          <section className="mt-stack-sm relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-tertiary-container via-primary-container to-tertiary-container rounded-[26px] blur opacity-20" />
            <div className="bg-surface-container-lowest border border-primary-container/50 rounded-[24px] p-5 shadow-[0px_10px_30px_rgba(45,45,45,0.05)] relative overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-headline-md text-[18px] text-on-surface flex items-center gap-2">
                  ✨ BeautyFlow Suggested Follow-up
                </h3>
                <span className="font-label-sm text-label-sm text-primary px-2 py-1 bg-primary-container/30 rounded-full border border-primary-container/50">
                  Suggested
                </span>
              </div>
              {editingSuggestion ? (
                <textarea
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  rows={3}
                  className="w-full bg-surface-container-low rounded-xl p-4 mb-5 border border-surface-container-high font-body-md text-body-md text-on-surface-variant focus:outline-none focus:border-primary"
                />
              ) : (
                <div className="bg-surface-container-low rounded-xl p-4 mb-5 border border-surface-container-high">
                  <p className="font-body-md text-body-md text-on-surface-variant italic">"{suggestion}"</p>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSendSuggestion}
                  disabled={sending}
                  className="flex-1 bg-primary-container text-on-primary-container font-label-lg text-label-lg py-3 px-4 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all flex justify-center items-center gap-2 shadow-[0px_4px_12px_rgba(234,199,199,0.3)] disabled:opacity-50"
                >
                  <MaterialIcon name="send" className="text-[18px]" />
                  Send Follow-up
                </button>
                <div className="flex gap-3 flex-1">
                  <button
                    onClick={() => setEditingSuggestion((v) => !v)}
                    className="flex-1 border border-on-surface text-on-surface font-label-lg text-label-lg py-3 px-4 rounded-xl hover:bg-surface-container-lowest transition-colors active:scale-[0.98] flex justify-center items-center"
                  >
                    {editingSuggestion ? "Done" : "Edit"}
                  </button>
                  <button
                    onClick={() => setSuggestionSent(true)}
                    className="flex-1 text-secondary font-label-lg text-label-lg py-3 px-4 rounded-xl hover:bg-surface-container transition-colors active:scale-[0.98] flex justify-center items-center"
                  >
                    Don't Send
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="bg-surface-container-lowest rounded-[24px] p-5 shadow-[0px_10px_30px_rgba(45,45,45,0.05)] border border-surface-container-high/50">
          <h3 className="font-headline-md text-[18px] text-on-surface mb-4">Lead Details</h3>
          <div className="flex flex-col gap-0">
            <div className="flex justify-between py-3 border-b border-on-surface/5 px-1">
              <span className="font-body-md text-body-md text-secondary">Service</span>
              <span className="font-label-lg text-label-lg text-on-surface">{lead.service || "—"}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-on-surface/5 px-1">
              <span className="font-body-md text-body-md text-secondary">Potential value</span>
              <span className="font-label-lg text-label-lg text-[#A68832]">
                {lead.potential_value ? `~$${lead.potential_value}` : "—"}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-on-surface/5 px-1">
              <span className="font-body-md text-body-md text-secondary">Source</span>
              <span className="font-label-lg text-label-lg text-on-surface flex items-center gap-1">
                <MaterialIcon name={SOURCE_ICON[lead.source] ?? "edit"} className="text-[14px]" />
                {lead.source ?? "manual"}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-on-surface/5 px-1">
              <span className="font-body-md text-body-md text-secondary">Status</span>
              <span className="font-label-lg text-label-lg text-primary bg-primary-container/20 px-2 py-0.5 rounded-full capitalize">
                {lead.status.replace("_", " ")}
              </span>
            </div>
            <div className="flex justify-between py-3 px-1">
              <span className="font-body-md text-body-md text-secondary">Last contact</span>
              <span className="font-label-lg text-label-lg text-on-surface">
                {lead.last_contact_at ? new Date(lead.last_contact_at).toLocaleDateString() : "—"}
              </span>
            </div>
          </div>
        </section>
      </main>

      <form
        onSubmit={handleSend}
        className="fixed bottom-16 md:bottom-0 left-0 w-full md:pl-20 z-40 bg-surface/95 backdrop-blur-md border-t border-outline-variant/20 md:pb-safe"
      >
        <div className="w-full max-w-md md:max-w-3xl mx-auto px-container-padding py-3 flex items-center gap-3">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Write a message…"
            className="flex-1 bg-surface-container rounded-full px-4 py-2.5 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
          />
          <button
            type="submit"
            disabled={sending || !draft.trim()}
            aria-label="Send message"
            className="w-11 h-11 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center disabled:opacity-50"
          >
            <MaterialIcon name="send" className="text-[18px]" />
          </button>
        </div>
      </form>
    </>
  );
}
