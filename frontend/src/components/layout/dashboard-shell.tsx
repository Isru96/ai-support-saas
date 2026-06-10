"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bot, LayoutDashboard, Settings } from "lucide-react"

import { AppHeader } from "@/components/layout/app-header"
import { WorkspaceSwitcher } from "@/components/workspace/workspace-switcher"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <AppHeader />
      <div className="mx-auto flex w-full max-w-6xl flex-1 gap-6 px-4 py-6 sm:px-6">
        <aside className="hidden w-64 shrink-0 md:block">
          <div className="sticky top-6 space-y-6">
            <div className="flex items-center gap-2 px-1 text-sm font-semibold">
              <Bot className="size-4" />
              Workspace
            </div>
            <WorkspaceSwitcher />
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}
