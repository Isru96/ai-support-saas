import {
  BarChart3,
  Bell,
  Check,
  CircleHelp,
  Copy,
  FileSpreadsheet,
  FileText,
  Home,
  MessageSquare,
  Paperclip,
  Plus,
  Send,
  Settings,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  Upload,
  Users,
} from "lucide-react"

import { cn } from "@/lib/utils"

function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground",
        className
      )}
    >
      <Sparkles className="size-4" />
    </span>
  )
}

const files = [
  { name: "Product-Guide.pdf", size: "2.4 MB", icon: FileText, color: "text-red-500" },
  { name: "FAQ-Document.docx", size: "1.1 MB", icon: FileText, color: "text-blue-500" },
  { name: "Pricing-Sheet.xlsx", size: "856 KB", icon: FileSpreadsheet, color: "text-green-600" },
  { name: "Onboarding-Deck.pptx", size: "3.2 MB", icon: FileText, color: "text-orange-500" },
]

export function DashboardPreview() {
  return (
    <div className="relative w-full max-w-[640px] justify-self-end lg:max-w-none">
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl shadow-primary/10">
        <div className="flex min-h-[420px] sm:min-h-[480px]">
          {/* Sidebar */}
          <aside className="flex w-12 shrink-0 flex-col items-center gap-4 border-r border-border/60 bg-muted/30 py-4 sm:w-14">
            <LogoMark className="size-7 sm:size-8" />
            <nav className="flex flex-col items-center gap-3">
              <span className="relative flex size-8 items-center justify-center rounded-lg text-primary">
                <span className="absolute -left-3 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary" />
                <Home className="size-4" />
              </span>
              {[MessageSquare, FileText, BarChart3, Users, Settings].map((Icon, i) => (
                <span
                  key={i}
                  className="flex size-8 items-center justify-center rounded-lg text-muted-foreground"
                >
                  <Icon className="size-4" />
                </span>
              ))}
            </nav>
          </aside>

          <div className="min-w-0 flex-1">
            {/* Top bar */}
            <div className="flex items-center justify-end gap-2 border-b border-border/60 px-3 py-2.5 sm:gap-3 sm:px-4">
              <button
                type="button"
                aria-label="Notifications"
                className="relative text-muted-foreground"
              >
                <Bell className="size-4" />
                <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-primary" />
              </button>
              <button type="button" aria-label="Help" className="text-muted-foreground">
                <CircleHelp className="size-4" />
              </button>
              <div className="flex items-center gap-1.5 rounded-lg border border-border/60 px-2 py-1 text-xs font-medium sm:text-sm">
                <span className="flex size-6 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                  AC
                </span>
                <span className="hidden sm:inline">Acme Co.</span>
              </div>
            </div>

            <div className="grid gap-3 p-3 sm:grid-cols-2 sm:gap-4 sm:p-4">
              {/* Knowledge Base */}
              <div className="space-y-3 rounded-xl border border-border/60 bg-background p-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold">Knowledge Base</h3>
                  <span className="inline-flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-[10px] font-medium text-primary-foreground sm:text-xs">
                    <Plus className="size-3" />
                    Upload
                  </span>
                </div>
                <p className="text-[10px] leading-relaxed text-muted-foreground sm:text-xs">
                  Add documents, FAQs, and resources to train your AI agent.
                </p>
                <div className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-primary/40 bg-secondary/50 px-3 py-5 text-center">
                  <Upload className="size-5 text-primary" />
                  <p className="text-[10px] leading-snug text-muted-foreground sm:text-xs">
                    Drag and drop files here
                    <br />
                    or click to browse
                  </p>
                </div>
                <ul className="space-y-1.5">
                  {files.map((file) => (
                    <li
                      key={file.name}
                      className="flex items-center gap-2 rounded-md border border-border/50 px-2 py-1.5"
                    >
                      <file.icon className={cn("size-3.5 shrink-0", file.color)} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[10px] font-medium sm:text-xs">{file.name}</p>
                        <p className="text-[9px] text-muted-foreground sm:text-[10px]">{file.size}</p>
                      </div>
                      <Check className="size-3.5 shrink-0 text-green-600" />
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2 rounded-lg bg-success-soft px-2.5 py-2">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-green-600" />
                  <div>
                    <p className="text-[10px] font-semibold text-success-soft-foreground sm:text-xs">
                      Upload Complete
                    </p>
                    <p className="text-[9px] leading-relaxed text-success-soft-foreground/80 sm:text-[10px]">
                      All files uploaded successfully and ready to train your AI agent.
                    </p>
                  </div>
                </div>
              </div>

              {/* AI Assistant */}
              <div className="flex flex-col rounded-xl border border-border/60 bg-background p-3">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="size-3.5 text-primary" />
                    <h3 className="text-sm font-semibold">AI Assistant</h3>
                  </div>
                  <span className="rounded-md border border-primary/30 px-2 py-0.5 text-[10px] font-medium text-primary sm:text-xs">
                    New Conversation
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-3 overflow-hidden">
                  <div className="flex justify-end gap-1.5">
                    <div className="max-w-[85%] rounded-xl rounded-tr-sm bg-peach px-2.5 py-2">
                      <p className="text-[10px] leading-relaxed sm:text-xs">
                        What&apos;s your refund policy for annual plans?
                      </p>
                      <p className="mt-1 text-[9px] text-muted-foreground">10:32 AM</p>
                    </div>
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-[9px] font-medium">
                      U
                    </span>
                  </div>

                  <div className="flex gap-1.5">
                    <LogoMark className="size-6 rounded-md" />
                    <div className="max-w-[90%]">
                      <div className="rounded-xl rounded-tl-sm border border-border/60 bg-card px-2.5 py-2">
                        <p className="text-[10px] leading-relaxed sm:text-xs">
                          Annual plans include a 30-day money-back guarantee. After that, refunds are
                          prorated based on unused months.
                        </p>
                        <p className="mt-1 text-[9px] text-muted-foreground">10:32 AM</p>
                      </div>
                      <div className="mt-1 flex gap-2 text-muted-foreground">
                        <ThumbsUp className="size-3" />
                        <ThumbsDown className="size-3" />
                        <Copy className="size-3" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-2 py-1.5">
                  <Paperclip className="size-3.5 shrink-0 text-muted-foreground" />
                  <span className="flex-1 text-[10px] text-muted-foreground sm:text-xs">
                    Ask a question...
                  </span>
                  <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <Send className="size-3.5" />
                  </span>
                </div>
                <p className="mt-2 text-center text-[9px] text-muted-foreground">
                  AI responses may be inaccurate. Please verify important information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
