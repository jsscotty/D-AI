import {
  AuthTypeMetadata,
  getAuthTypeMetadataSS,
  getCurrentUserSS,
} from "@/lib/userSS";
import { redirect } from "next/navigation";
import { HealthCheckBanner } from "@/components/health/healthcheck";
import { User } from "@/lib/types";
import { Text } from "@tremor/react";
import { RequestNewVerificationEmail } from "./RequestNewVerificationEmail";
import { Logo } from "@/components/Logo";
import { getTranslations } from "next-intl/server";

export default async function Page() {
  // catch cases where the backend is completely unreachable here
  // without try / catch, will just raise an exception and the page
  // will not render
  let authTypeMetadata: AuthTypeMetadata | null = null;
  let currentUser: User | null = null;
  const transAuth = await getTranslations("auth");
  try {
    [authTypeMetadata, currentUser] = await Promise.all([
      getAuthTypeMetadataSS(),
      getCurrentUserSS(),
    ]);
  } catch (e) {
    console.log(`Some fetch failed for the login page - ${e}`);
  }

  if (!currentUser) {
    if (authTypeMetadata?.authType === "disabled") {
      return redirect("/");
    }
    return redirect("/auth/login");
  }

  if (!authTypeMetadata?.requiresVerification || currentUser.is_verified) {
    return redirect("/");
  }

  return (
    <main>
      <div className="absolute top-10x w-full">
        <HealthCheckBanner />
      </div>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div>
          <Logo height={64} width={64} className="mx-auto w-fit" />

          <div className="flex">
            <Text className="text-center font-medium text-lg mt-6 w-108">
              {transAuth("verification-email", {
                currentUserEmail: currentUser.email,
              })}
              <br />
              {transAuth("check-inbox")}
              <br />
              <br />
              {transAuth("dont-see")}{" "}
              <RequestNewVerificationEmail email={currentUser.email}>
                {transAuth("here")}
              </RequestNewVerificationEmail>{" "}
              {transAuth("request-new-email")}
            </Text>
          </div>
        </div>
      </div>
    </main>
  );
}
