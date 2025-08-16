"use client";

import { useState } from "react";
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
    <div className="flex h-[calc(100vh-3.5rem)] bg-sidebar-background text-sidebar-foreground">
      {/* Left Sidebar */}
      <div className="w-[220px] border-r border-sidebar-border flex flex-col overflow-y-auto no-scrollbar">
        <h2 className="text-lg font-semibold p-4">Settings</h2>
        <div className="flex-1">
          <nav className="flex flex-col gap-1 p-2">
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
                data-slot="sidebar-menu-button"
                data-sidebar="menu-button"
                data-size="default"
                data-active={activeTab === tab.name ? "true" : "false"}
                className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:font-medium data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-8 text-sm data-[active=true]:bg-gradient-to-r data-[active=true]:from-indigo-500 data-[active=true]:to-purple-600 data-[active=true]:text-white data-[active=true]:shadow-lg"
              >
                <tab.icon className="lucide lucide-server mr-2" aria-hidden="true" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Right Content View */}
      <div className="flex-1 p-6 overflow-y-auto bg-background text-foreground">
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