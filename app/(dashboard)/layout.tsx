import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-utils";
import { getUserSubscription } from "@/lib/db-helpers";
import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const subscription = await getUserSubscription(session.user.id);

  return (
    <div className="flex h-screen overflow-hidden">
      <a
        href="#dashboard-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <Sidebar userPlan={subscription.plan} userRole={session.user.role} />

      <main className="flex flex-1 flex-col overflow-hidden" role="main">
        <DashboardHeader user={session.user} />
        <div id="dashboard-content" className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
