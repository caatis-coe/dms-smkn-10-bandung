// components/ui/table.tsx

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronUp, ChevronDown } from "lucide-react"

export interface Column<T> {
  header: string
  key: keyof T
  enableFilter?: boolean
  sortable?: boolean 
  width?: number
  render?: (row: T) => React.ReactNode
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
  perPage = 10,
  onPageSizeChange
}: TableProps<T>) {
  
  const handleSort = (col: Column<T>) => {
    const sortable = col.sortable ?? true
    if (!sortable) return
  
    if (!onSort) return
  
    const key = col.key
    const newDirection =
      sortKey === key && sortDirection === "asc" ? "desc" : "asc"
  
    onSort(key, newDirection)
  }

  // const startResizing = (e: React.MouseEvent, colIndex: number) => {
  //   const startX = e.clientX
  //   const startWidth = columns[colIndex].width ?? 150

  //   const handleMouseMove = (ev: MouseEvent) => {
  //     const diff = ev.clientX - startX
  //     columns[colIndex].width = Math.max(80, startWidth + diff)
  //     document.body.style.cursor = "col-resize"
  //     window.dispatchEvent(new Event("resize"))
  //   }

  //   const handleMouseUp = () => {
  //     document.body.style.cursor = "default"
  //     document.removeEventListener("mousemove", handleMouseMove)
  //     document.removeEventListener("mouseup", handleMouseUp)
  //   }

  //   document.addEventListener("mousemove", handleMouseMove)
  //   document.addEventListener("mouseup", handleMouseUp)
  // }

  return (
    <div className="border rounded-xl overflow-hidden">

      <div className="overflow-auto">
        <table className="w-full table-fixed border-collapse text-sm">

          {/* STICKY HEADER */}
          <thead className="bg-muted/40 sticky top-0 z-20 backdrop-blur-sm">
            <tr>
              {columns.map((col, i) => {
                const sortable = col.sortable ?? true
                return (
                <th
                  key={i}
                  className="px-4 py-6 font-medium text-left relative select-none"
                  style={{ width: col.width ?? 150 }}
                >
                <div className="flex flex-col items-start gap-4">
                  {/* HEADER + SORT BUTTON */}
                  <button
                    className={cn(
                      "flex items-center gap-1",
                      sortable ? "hover:opacity-80 cursor-pointer" : "cursor-default"
                    )}
                    onClick={() => sortable && handleSort(col)}
                    disabled={!sortable}
                  >
                    <div className="text-start ">
                      {col.header}
                    </div>
                    

                    {/* Show icon only if sortable */}
                    {sortable && (
                      sortKey === col.key ? (
                        sortDirection === "asc" ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )
                      ) : (
                        <ChevronUp className="w-3 h-3 opacity-20" />
                      )
                    )}
                  </button>

                  {/* FILTER ABOVE HEADER */}
                  {col.enableFilter && onFilterChange && (
                    <input
                      type="text"
                      className="h-9 w-full rounded border px-4 text-xs bg-background"
                      placeholder="Filter…"
                      value={filters?.[col.key as string] ?? ""}
                      onChange={(e) => onFilterChange(col.key, e.target.value)}
                    />
                  )}
                </div>

                  {/* COLUMN RESIZER */}
                  {/* <div
                    onMouseDown={(e) => startResizing(e, i)}
                    className="absolute top-0 right-0 h-full w-1 cursor-col-resize bg-transparent hover:bg-primary/20"
                  /> */}
                </th>
              )})}
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {data.length != 0 ? data.map((row, rIndex) => (
              <tr
                key={rIndex}
                className="border-t hover:bg-muted/30 transition"
              >
                {columns.map((col, i) => (
                  <td key={i} className="px-4 py-3">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            )) : (
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

      {/* PAGINATION */}
      {onPageChange && (
  <div className="flex justify-between items-center p-4 bg-muted/30 gap-4">
    <div className="flex gap-x-12">
      {/* LEFT: Prev button */}
      <button
        disabled={page <= 1}
        className="px-3 py-1 rounded bg-background border disabled:opacity-50 disabled:cursor-default cursor-pointer"
        onClick={() => onPageChange(page - 1)}
      >
        Prev
      </button>

      {/* CENTER: Page input + "of X" */}
      <div className="flex items-center gap-2 text-sm">
        <span>Page</span>

        {/* MANUAL PAGE INPUT */}
        <input
          type="number"
          min={1}
          max={totalPages}
          value={page}
          onChange={(e) => {
            let newPage = Number(e.target.value)
            if (newPage < 1) newPage = 1
            if (newPage > totalPages) newPage = totalPages
            onPageChange(newPage)
          }}
          className="w-16 px-2 py-1 border rounded bg-background ml"
        />

        <span>of</span>
        <span>{totalPages}</span>
      </div>

      {/* RIGHT: Next button */}
      <button
        disabled={page >= totalPages}
        className="px-3 py-1 rounded bg-background border disabled:opacity-50 disabled:cursor-default cursor-pointer"
        onClick={() => onPageChange(parseInt(String(page)) + 1)}
      >
        Next
      </button>
    </div>

    {/* PAGE SIZE SELECTOR */}
    <div className="flex items-center gap-2 text-sm">
      <span>Rows:</span>
      <select
        className="px-2 py-1 border rounded bg-background"
        value={perPage}
        onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
      >
        {[10, 25, 50, 100].map((size) => (
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
