// components/ui/table.tsx

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronUp, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu"

export interface Column<T> {
  header: string
  key: keyof T
  enableFilter?: boolean
  sortable?: boolean
  render?: (row: T) => React.ReactNode
  filterType?: "text" | "dropdown"
  filterOptions?: { label: string; value: string }[],
  headerClassName?: string,
  width?: number,
  filterClassName?: string
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  sortKey?: keyof T
  sortDirection?: "asc" | "desc"
  onSort?: (key: keyof T, direction: "asc" | "desc") => void

  filters?: Record<string, string>
  onFilterChange?: (key: keyof T, value: string) => void

  page?: number
  totalPages?: number
  perPage?: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (size: number) => void
}

export function Table<T extends Record<string, any>>({
  columns,
  data,
  sortKey,
  sortDirection,
  onSort,
  filters,
  onFilterChange,
  page = 1,
  totalPages = 1,
  onPageChange,
  perPage = 5,
  onPageSizeChange,

}: TableProps<T>) {

  /* =========================================================
     LOADING STATE (NEW)
  ========================================================= */
  const [isLoading, setIsLoading] = React.useState(false)

  // When data changes → loading done
  React.useEffect(() => {
    setIsLoading(false)
  }, [data])

  const triggerPagination = (cb: () => void) => {
    if (isLoading) return
    setIsLoading(true)
    cb()
  }

  const handleSort = (col: Column<T>) => {
    const sortable = col.sortable ?? true
    if (!sortable || !onSort || isLoading) return

    const key = col.key
    const newDirection =
      sortKey === key && sortDirection === "asc" ? "desc" : "asc"

    setIsLoading(true)
    onSort(key, newDirection)
  }

  return (
    <div className="border rounded-[4px] overflow-hidden">

      <div className="overflow-auto">
        <table className="w-full table-fixed border-collapse text-sm">

          {/* ================= HEADER ================= */}
          <thead className="bg-muted/40 sticky top-0 z-20 backdrop-blur-sm">
            <tr>
              {columns.map((col, i) => {
                const sortable = col.sortable ?? true
                return (
                  <th
                    key={i}
                    className={cn("px-4 py-6 font-medium text-left relative select-none w-[150px]", col.headerClassName)}
                    style={{ width: col.width ?? 150 }}
                  >
                    <div className="flex flex-col items-start gap-4">
                      <button
                        className={cn(
                          "flex items-center gap-1 text-left pl-1",
                          sortable && !isLoading
                            ? "hover:opacity-80 cursor-pointer"
                            : "cursor-default"
                        )}
                        onClick={() => handleSort(col)}
                        disabled={isLoading}
                      >
                        {col.header}

                        {sortable && (
                          sortKey === col.key ? (
                            sortDirection === "asc"
                              ? <ChevronUp className="w-4 h-4" />
                              : <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronUp className="w-3 h-3 opacity-60" />
                          )
                        )}
                      </button>

                      {col.enableFilter && onFilterChange && (
                        col.filterType === "dropdown" && col.filterOptions ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              disabled={isLoading}
                              className={cn(
                                "h-9 w-full rounded border px-3 text-xs bg-background text-left flex items-center justify-between",
                                isLoading && "opacity-50 cursor-not-allowed",col.filterClassName
                              )}
                            >
                              <span>
                                {filters?.[col.key as string]
                                  ? col.filterOptions.find(
                                      o => o.value === filters[col.key as string]
                                    )?.label
                                  : <div className="text-foreground/50">Filter…</div>}
                              </span>
                              <ChevronDown className="h-3 w-3 opacity-60" />
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className={cn("w-full min-w-[var(--radix-dropdown-menu-trigger-width)]", col.filterClassName)}>
                              <DropdownMenuItem
                                onClick={() => onFilterChange(col.key, "")}
                              >
                                All
                              </DropdownMenuItem>

                              {col.filterOptions.map(option => (
                                <DropdownMenuItem
                                  key={option.value}
                                  onClick={() =>
                                    onFilterChange(col.key, option.value)
                                  }
                                >
                                  {option.label}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          /* DEFAULT TEXT FILTER */
                          <input
                            disabled={isLoading}
                            type="text"
                            className={cn("h-9 w-full rounded border px-4 text-xs bg-background disabled:opacity-50", col.filterClassName)}
                            placeholder="Filter…"
                            value={filters?.[col.key as string] ?? ""}
                            onChange={(e) =>
                              onFilterChange(col.key, e.target.value)
                            }
                          />
                        )
                      )}
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>

          {/* ================= BODY ================= */}
          <tbody>
            {isLoading ? (
              /* ===== SKELETON LOADING ===== */
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-t">
                  {columns.map((_, j) => (
                    <td key={j} className="px-4 py-6">
                      <div className="h-4 w-full animate-pulse rounded bg-muted" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length !== 0 ? (
              data.map((row, rIndex) => (
                <tr key={rIndex} className={`border-t hover:bg-muted/30 transition ${rIndex % 2 === 0 && "bg-foreground/2"}`}>
                  {columns.map((col, i) => (
                    <td key={i} className="px-4 py-3">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-6 text-muted-foreground"
                >
                  No Data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
      {onPageChange && (
        <div className="flex flex-col lg:flex-row justify-between items-center p-4 bg-muted/30 gap-6 lg:gap-4">
          <div className="flex gap-x-12">
            {/* PREV */}
            <button
              disabled={page <= 1 || isLoading}
              className="px-3 py-1 rounded bg-background border disabled:opacity-50"
              onClick={() =>
                triggerPagination(() => onPageChange(page - 1))
              }
            >
              Prev
            </button>

            {/* PAGE INPUT */}
            <div className="flex items-center gap-2 text-sm">
              <span>Page</span>
              <input
                disabled={isLoading}
                type="number"
                min={1}
                max={totalPages}
                value={page}
                onChange={(e) =>
                  triggerPagination(() =>
                    onPageChange(
                      Math.min(
                        Math.max(Number(e.target.value), 1),
                        totalPages
                      )
                    )
                  )
                }
                className="w-16 px-2 py-1 border rounded bg-background disabled:opacity-50"
              />
              <span>of</span>
              <span>{totalPages}</span>
            </div>

            {/* NEXT */}
            <button
              disabled={page >= totalPages || isLoading}
              className="px-3 py-1 rounded bg-background border disabled:opacity-50"
              onClick={() =>
                triggerPagination(() => onPageChange(page + 1))
              }
            >
              Next
            </button>
          </div>

          {/* PAGE SIZE */}
          <div className="flex items-center gap-2 text-sm">
            <span>Rows:</span>
            <select
              disabled={isLoading}
              className="px-2 py-1 border-1 rounded bg-background disabled:opacity-50"
              value={perPage}
              onChange={(e) =>
                triggerPagination(() =>
                  onPageSizeChange?.(Number(e.target.value))
                )
              }
            >
              {[5,10, 25, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  )
}
