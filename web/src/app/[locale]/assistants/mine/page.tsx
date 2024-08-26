<<<<<<< HEAD:web/src/app/[locale]/assistants/mine/page.tsx
import { HistorySidebar } from "@/app/[locale]/chat/sessionSidebar/HistorySidebar";
=======
>>>>>>> c0e1a02e8edf16c4c4874a9c2eb739cccbdc20d1:web/src/app/assistants/mine/page.tsx
import { InstantSSRAutoRefresh } from "@/components/SSRAutoRefresh";
import { WelcomeModal } from "@/components/initialSetup/welcome/WelcomeModalWrapper";
import { fetchChatData } from "@/lib/chat/fetchChatData";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
<<<<<<< HEAD:web/src/app/[locale]/assistants/mine/page.tsx
import { AssistantsList } from "./AssistantsList";
import { Logo } from "@/components/Logo";
import FixedLogo from "@/app/[locale]/chat/shared_chat_search/FixedLogo";
import SidebarWrapper from "../SidebarWrapper";
=======
>>>>>>> c0e1a02e8edf16c4c4874a9c2eb739cccbdc20d1:web/src/app/assistants/mine/page.tsx
import WrappedAssistantsMine from "./WrappedAssistantsMine";

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  noStore();

  const data = await fetchChatData(searchParams);

  if ("redirect" in data) {
    redirect(data.redirect);
  }

  const {
    user,
    chatSessions,
    assistants,
    folders,
    openedFolders,
    shouldShowWelcomeModal,
    toggleSidebar,
  } = data;

  return (
    <>
      {shouldShowWelcomeModal && <WelcomeModal user={user} />}

      <InstantSSRAutoRefresh />

      <WrappedAssistantsMine
        initiallyToggled={toggleSidebar}
        chatSessions={chatSessions}
        folders={folders}
        openedFolders={openedFolders}
        user={user}
        assistants={assistants}
      />
    </>
  );
}
