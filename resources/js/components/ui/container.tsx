// src/components/ui/container.tsx

import * as React from "react"

import { cn } from "@/lib/utils"


function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="container"
      className={cn(
        "relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border p-4 md:p-6",
        className
      )}
      {...props}
    />
  )
}

export { Container }
