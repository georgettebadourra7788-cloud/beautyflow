import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MaterialIcon from "../components/icons/MaterialIcon.jsx";
import { useSalon } from "../lib/SalonContext.jsx";
import { getLead, touchLastContact } from "../lib/api/leads.js";
import { listMessages, sendMessage, createFollowUp } from "../lib/api/conversations.js";
import { useLanguage } from "../i18n/LanguageContext.jsx";

const SOURCE_ICON = { instagram: "photo_camera", whatsapp: "chat", website: "language", manual: "edit" };

export default function Conversations() {
  const { leadId } = useParams();
  const { salon } = useSalon();
  const { t, language } = useLanguage();
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

  const suggestedFollowUp = (name) =>
    language === "ar"
      ? `مرحبًا ${name.split(" ")[0]} 👋 نتواصل معك للاطمئنان! لدينا بعض المواعيد المتاحة هذا الأسبوع. هل تودين أن أساعدك في إيجاد موعد؟`
      : `Hi ${name.split(" ")[0]} 👋 Just checking in! We have a few appointments available this week. Would you like me to help you find a time?`;

  const loadThread = async () => {
    setLoading(true);
    const [{ data: leadData }, { data: messageData }] = await Promise.all([getLead(leadId), listMessages(leadId)]);
    setLead(leadData ?? null);
    setMessages(messageData ?? []);
    if (leadData) setSuggestion(suggestedFollowUp(leadData.customer_name));
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
    return <div className="px-container-padding py-stack-lg font-body-md text-body-md text-on-surface-variant">{t("common.loading")}</div>;
  }

  if (!lead) {
    return (
      <div className="px-container-padding py-stack-lg text-center">
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-stack-md">{t("conversations.notFound")}</p>
        <button onClick={() => navigate("/conversations")} className="text-primary font-label-lg text-label-lg">
          {t("conversations.backToConversations")}
        </button>
      </div>
    );
  }

  const sourceLabel = t(`sources.${lead.source in SOURCE_ICON ? lead.source : "manual"}`);
  const statusLabel = t(`statuses.${lead.status}`) !== `statuses.${lead.status}` ? t(`statuses.${lead.status}`) : lead.status;

  return (
    <>
      <header className="bg-surface w-full top-0 sticky flex justify-between items-center px-container-padding h-16 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/conversations")}
            aria-label={t("conversations.backAria")}
            className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:opacity-80 transition-opacity active:scale-95 transition-transform"
          >
            <MaterialIcon name="arrow_back" className="text-primary" />
          </button>
          <div className="flex flex-col">
            <h1 className="font-headline-md text-headline-md text-primary">{lead.customer_name}</h1>
            <div className="flex items-center gap-2">
              <span className="font-label-lg text-label-lg text-secondary">{lead.service || t("conversations.newInquiry")}</span>
              <span className="w-1 h-1 rounded-full bg-outline-variant" />
              <span className="font-label-sm text-label-sm text-secondary px-2 py-0.5 bg-surface-container-high rounded-full flex items-center gap-1">
                <MaterialIcon name={SOURCE_ICON[lead.source] ?? "edit"} className="text-[10px]" />
                {sourceLabel}
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
                {t("conversations.noMessages", { name: lead.customer_name })}
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex w-full ${msg.sender_type === "salon" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`rounded-2xl px-4 py-3 shadow-[0px_4px_12px_rgba(45,45,45,0.02)] max-w-[85%] ${
                    msg.sender_type === "salon"
                      ? "bg-primary-container text-on-primary-container rounded-tr-sm rtl:rounded-tr-2xl rtl:rounded-tl-sm"
                      : "bg-surface-container-lowest border border-surface-container-high text-on-surface rounded-tl-sm rtl:rounded-tl-2xl rtl:rounded-tr-sm"
                  }`}
                >
                  <p className="font-body-md text-body-md">{msg.message}</p>
                  <span
                    className={`font-label-sm text-label-sm mt-1 block ${
                      msg.sender_type === "salon" ? "text-on-primary-container opacity-80 text-end" : "text-secondary"
                    }`}
                  >
                    {new Date(msg.created_at).toLocaleString(language === "ar" ? "ar" : undefined, {
                      hour: "numeric",
                      minute: "2-digit",
                      month: "short",
                      day: "numeric",
                    })}
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
                  {t("conversations.suggestedTitle")}
                </h3>
                <span className="font-label-sm text-label-sm text-primary px-2 py-1 bg-primary-container/30 rounded-full border border-primary-container/50">
                  {t("conversations.suggestedBadge")}
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
                  {t("conversations.sendFollowUp")}
                </button>
                <div className="flex gap-3 flex-1">
                  <button
                    onClick={() => setEditingSuggestion((v) => !v)}
                    className="flex-1 border border-on-surface text-on-surface font-label-lg text-label-lg py-3 px-4 rounded-xl hover:bg-surface-container-lowest transition-colors active:scale-[0.98] flex justify-center items-center"
                  >
                    {editingSuggestion ? t("conversations.done") : t("conversations.edit")}
                  </button>
                  <button
                    onClick={() => setSuggestionSent(true)}
                    className="flex-1 text-secondary font-label-lg text-label-lg py-3 px-4 rounded-xl hover:bg-surface-container transition-colors active:scale-[0.98] flex justify-center items-center"
                  >
                    {t("conversations.dontSend")}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="bg-surface-container-lowest rounded-[24px] p-5 shadow-[0px_10px_30px_rgba(45,45,45,0.05)] border border-surface-container-high/50">
          <h3 className="font-headline-md text-[18px] text-on-surface mb-4">{t("conversations.leadDetails")}</h3>
          <div className="flex flex-col gap-0">
            <div className="flex justify-between py-3 border-b border-on-surface/5 px-1">
              <span className="font-body-md text-body-md text-secondary">{t("conversations.service")}</span>
              <span className="font-label-lg text-label-lg text-on-surface">{lead.service || t("common.dash")}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-on-surface/5 px-1">
              <span className="font-body-md text-body-md text-secondary">{t("conversations.potentialValue")}</span>
              <span className="font-label-lg text-label-lg text-[#A68832]">
                {lead.potential_value ? `~$${lead.potential_value}` : t("common.dash")}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-on-surface/5 px-1">
              <span className="font-body-md text-body-md text-secondary">{t("conversations.source")}</span>
              <span className="font-label-lg text-label-lg text-on-surface flex items-center gap-1">
                <MaterialIcon name={SOURCE_ICON[lead.source] ?? "edit"} className="text-[14px]" />
                {sourceLabel}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-on-surface/5 px-1">
              <span className="font-body-md text-body-md text-secondary">{t("conversations.status")}</span>
              <span className="font-label-lg text-label-lg text-primary bg-primary-container/20 px-2 py-0.5 rounded-full capitalize">
                {statusLabel}
              </span>
            </div>
            <div className="flex justify-between py-3 px-1">
              <span className="font-body-md text-body-md text-secondary">{t("conversations.lastContact")}</span>
              <span className="font-label-lg text-label-lg text-on-surface">
                {lead.last_contact_at
                  ? new Date(lead.last_contact_at).toLocaleDateString(language === "ar" ? "ar" : undefined)
                  : t("common.dash")}
              </span>
            </div>
          </div>
        </section>
      </main>

      <form
        onSubmit={handleSend}
        className="fixed bottom-16 md:bottom-0 start-0 w-full md:ps-20 z-40 bg-surface/95 backdrop-blur-md border-t border-outline-variant/20 md:pb-safe"
      >
        <div className="w-full max-w-md md:max-w-3xl mx-auto px-container-padding py-3 flex items-center gap-3">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={t("conversations.composerPlaceholder")}
            className="flex-1 bg-surface-container rounded-full px-4 py-2.5 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
          />
          <button
            type="submit"
            disabled={sending || !draft.trim()}
            aria-label={t("conversations.sendAria")}
            className="w-11 h-11 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center disabled:opacity-50"
          >
            <MaterialIcon name="send" className="text-[18px]" />
          </button>
        </div>
      </form>
    </>
  );
}
