import { Badge } from '@/components/ui/badge'
import { RequestStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

const STATUS_CONFIG: Record<RequestStatus, { label: string; className: string }> = {
  pending: {
    label: 'Pending',
    className: 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100',
  },
  approved: {
    label: 'Approved',
    className: 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100',
  },
  declined: {
    label: 'Declined',
    className: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100',
  },
  processed: {
    label: 'Processed',
    className: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100',
  },
}

export function StatusBadge({ status }: { status: RequestStatus }) {
  const config = STATUS_CONFIG[status]
  return (
    <Badge variant="outline" className={cn('font-medium text-xs', config.className)}>
      {config.label}
    </Badge>
  )
}
