import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MaterialIcon from "../components/icons/MaterialIcon.jsx";
import Avatar from "../components/Avatar.jsx";
import { useSalon } from "../lib/SalonContext.jsx";
import { listLeads } from "../lib/api/leads.js";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import LanguageToggle from "../components/LanguageToggle.jsx";

export default function ConversationsList() {
  const { salon } = useSalon();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!salon) return;
    setLoading(true);
    listLeads(salon.id).then(({ data }) => {
      setLeads(data ?? []);
      setLoading(false);
    });
  }, [salon]);

  return (
    <>
      <header className="px-container-padding pt-stack-lg pb-stack-md bg-surface sticky top-0 z-30 flex items-center justify-between">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">{t("conversationsList.title")}</h1>
        <LanguageToggle />
      </header>

      <main className="px-container-padding flex flex-col gap-stack-md pb-40">
        {loading ? (
          <p className="font-body-md text-body-md text-on-surface-variant">{t("common.loading")}</p>
        ) : leads.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-2xl p-8 soft-shadow border border-surface-variant text-center">
            <MaterialIcon name="chat_bubble" className="text-on-surface-variant text-4xl mb-3" />
            <p className="font-body-lg text-body-lg text-on-surface font-semibold mb-1">{t("conversationsList.emptyTitle")}</p>
            <p className="font-body-md text-body-md text-on-surface-variant">{t("conversationsList.emptyBody")}</p>
          </div>
        ) : (
          leads.map((lead) => (
            <button
              key={lead.id}
              onClick={() => navigate(`/conversations/${lead.id}`)}
              className="text-start bg-surface-container-lowest rounded-2xl p-4 soft-shadow border border-surface-variant/50 flex items-center gap-4 hover:bg-surface-container transition-colors"
            >
              <Avatar initial={lead.customer_name.charAt(0).toUpperCase()} alt={lead.customer_name} />
              <div className="flex-1 min-w-0">
                <div className="font-body-lg font-semibold text-on-surface leading-tight">{lead.customer_name}</div>
                <p className="font-body-md text-body-md text-on-surface-variant truncate">
                  {lead.service || t("conversationsList.newInquiry")}
                </p>
              </div>
              <MaterialIcon name="chevron_right" className="text-on-surface-variant flex-shrink-0" />
            </button>
          ))
        )}
      </main>
    </>
  );
}
