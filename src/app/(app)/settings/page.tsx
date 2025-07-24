"use client";

import { useState } from "react";
import clsx from "clsx";
import {
  MessageSquareText,
  CircleUserRound,
  Hand,
  Eye,
  Clock,
  List,
  BotMessageSquare,
  Tag,
  Webhook,
  Globe,
  Plug,
  FileText,
  Bell,
  Mail,
  Network,
  ShieldCheck,
  BookOpenText,
} from "lucide-react";
import DefaultAvatarView from "@/components/settings/defaultAvatar/DefaultAvatarView";
import AnnouncementsView from "@/components/settings/announcements/AnnouncementsView";
import GreetingsView from "@/components/settings/greetings/GreetingsView";
import EyeCatchersView from "@/components/settings/eyeCatchers/EyeCatchersView";
import InactivityTimeoutsView from "@/components/settings/inactivityTimeouts/InactivityTimeoutsView";
import QueuedMessagesView from "@/components/settings/queuedMessages/QueuedMessagesView";
import SmartResponsesView from "@/components/settings/smartResponses/SmartResponsesView";
import TagsView from "@/components/settings/tags/TagsView";
import WebhooksView from "@/components/settings/webhooks/WebhooksView";
import GlobalWebhooksView from "@/components/settings/globalWebhooks/GlobalWebhooksView";
import IntegrationsView from "@/components/settings/integrations/IntegrationsView";
import TemplatesView from "@/components/settings/templates/TemplatesView";
import GlobalNotificationsView from "@/components/settings/globalNotifications/GlobalNotificationsView ";
import MailTemplatesView from "@/components/settings/mailTemplates/MailTemplatesView";
import IPAddressesView from "@/components/settings/ipAddresses/IPAddressesView";
import RolePermissionsView from "@/components/settings/rolePermissions/RolePermissionsView";
import KnowledgeBaseView from "@/components/settings/knowledgeBase/KnowledgeBaseView";

export default function EngagePage() {
  const [activeTab, setActiveTab] = useState<
    | "announcements"
    | "defaultAvatar"
    | "greetings"
    | "eyeCatchers"
    | "inactivityTimeouts"
    | "queuedMessages"
    | "smartResponses"
    | "tags"
    | "webhooks"
    | "globalWebhooks"
    | "integrations"
    | "templates"
    | "globalNotifications"
    | "mailTemplates"
    | "ipAddresses"
    | "rolePermissions"
    | "knowledgeBase"
  >("defaultAvatar");

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Left Sidebar */}
      <div className="w-[220px] border-r bg-gray-100 dark:bg-zinc-900 flex flex-col overflow-y-auto no-scrollbar">
        <h2 className="text-xl font-semibold p-4 dark:text-white">Settings</h2>
        <div className="flex-1">
          <nav className="flex flex-col gap-2 p-4 pt-0">
            {[
              { name: "announcements", label: "Announcements", icon: MessageSquareText },
              { name: "defaultAvatar", label: "Default Avatar", icon: CircleUserRound },
              { name: "greetings", label: "Greetings", icon: Hand },
              { name: "eyeCatchers", label: "EyeCatchers", icon: Eye },
              { name: "inactivityTimeouts", label: "Inactivity Timeouts", icon: Clock },
              { name: "queuedMessages", label: "Queued Messages", icon: List },
              { name: "smartResponses", label: "Smart Responses", icon: BotMessageSquare },
              { name: "tags", label: "Tags", icon: Tag },
              { name: "webhooks", label: "Webhooks", icon: Webhook },
              { name: "globalWebhooks", label: "Global Webhooks", icon: Globe },
              { name: "integrations", label: "Integrations", icon: Plug },
              { name: "templates", label: "Templates", icon: FileText },
              { name: "globalNotifications", label: "Global Notifications", icon: Bell },
              { name: "mailTemplates", label: "Mail Templates", icon: Mail },
              { name: "ipAddresses", label: "IP Addresses", icon: Network },
              { name: "rolePermissions", label: "Role Permissions", icon: ShieldCheck },
              { name: "knowledgeBase", label: "Knowledge Base", icon: BookOpenText },
            ].map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name as typeof activeTab)}
                className={clsx(
                  "flex items-center gap-2 text-left px-3 py-2 rounded-md text-sm font-medium capitalize",
                  {
                    "bg-blue-100 text-blue-900 dark:bg-blue-800 dark:text-white":
                      activeTab === tab.name,
                    "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800":
                      activeTab !== tab.name,
                  }
                )}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Right Content View */}
      <div className="flex-1 p-4 bg-gray-100 overflow-y-auto">
        {activeTab === "announcements" && <AnnouncementsView />}
        {activeTab === "defaultAvatar" && <DefaultAvatarView />}
        {activeTab === "greetings" && <GreetingsView />}
        {activeTab === "eyeCatchers" && <EyeCatchersView />}
        {activeTab === "inactivityTimeouts" && <InactivityTimeoutsView />}
        {activeTab === "queuedMessages" && <QueuedMessagesView />}
        {activeTab === "smartResponses" && <SmartResponsesView />}
        {activeTab === "tags" && <TagsView />}
        {activeTab === "webhooks" && <WebhooksView />}
        {activeTab === "globalWebhooks" && <GlobalWebhooksView />}
        {activeTab === "integrations" && <IntegrationsView />}
        {activeTab === "templates" && <TemplatesView />}
        {activeTab === "globalNotifications" && <GlobalNotificationsView />}
        {activeTab === "mailTemplates" && <MailTemplatesView />}
        {activeTab === "ipAddresses" && <IPAddressesView />}
        {activeTab === "rolePermissions" && <RolePermissionsView />}
        {activeTab === "knowledgeBase" && <KnowledgeBaseView />}
      </div>
    </div>
  );
}