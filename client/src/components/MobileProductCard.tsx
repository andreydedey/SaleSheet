import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { faMessage } from "@fortawesome/free-regular-svg-icons"
import {
  faMessage as faMessageSolid,
  faCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons"
import { faEdit, faTrashCan } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { cn } from "@/lib/utils"
import { formatCents } from "@/components/ui/currency-input"
import type { ProductDTO } from "@/types/api"

interface MobileProductCardProps {
  product: ProductDTO
  onMarkSold: (sold: boolean) => void
  soldDisabled?: boolean
  onSaveObservation?: (observation: string) => void
  observationSaving?: boolean
  onEdit?: () => void
  onDelete?: () => void
}

export function MobileProductCard({
  product,
  onMarkSold,
  soldDisabled,
  onSaveObservation,
  observationSaving,
  onEdit,
  onDelete,
}: MobileProductCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState("")

  const hasObservation = Boolean(product.observation)
  const canEdit = Boolean(onSaveObservation)

  const openObservation = () => {
    setDraft(product.observation ?? "")
    setIsEditing(true)
  }

  const cancelObservation = () => {
    setIsEditing(false)
    setDraft("")
  }

  const saveObservation = () => {
    onSaveObservation?.(draft)
    setIsEditing(false)
  }

  return (
    <Card
      className={cn(
        "transition-colors",
        product.sold && "bg-green-50 ring-green-200",
      )}
    >
      <CardContent className="flex flex-col gap-3">
        <div className="flex justify-between">
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">{product.reference}</p>
            <p className="text-sm text-foreground font-medium">
              {product.definition?.name}
            </p>
            <p
              className={cn(
                "text-sm font-bold",
                product.sold ? "text-green-600" : "text-foreground",
              )}
            >
              {formatCents(product.price)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onEdit}
                className="size-9 bg-blue-50 text-blue-500 hover:bg-blue-100"
              >
                <FontAwesomeIcon icon={faEdit} className="text-sm" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onDelete}
                className="size-9 bg-red-50 text-red-500 hover:bg-red-100"
              >
                <FontAwesomeIcon icon={faTrashCan} className="text-sm" />
              </Button>
            )}
            {canEdit && (
              <Button
                variant="ghost"
                size="icon"
                onClick={openObservation}
                className={cn(
                  "size-9 transition-colors",
                  isEditing
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : hasObservation
                      ? "bg-green-100 text-green-600 hover:bg-green-200"
                      : "bg-transparent border border-border text-muted-foreground hover:bg-muted",
                )}
              >
                <FontAwesomeIcon
                  icon={isEditing ? faMessageSolid : faMessage}
                  className="text-sm"
                />
              </Button>
            )}
            {!canEdit && hasObservation && (
              <div className="size-9 rounded-lg flex items-center justify-center bg-green-100 text-green-600">
                <FontAwesomeIcon icon={faMessage} className="text-sm" />
              </div>
            )}
            <Checkbox
              checked={product.sold}
              disabled={soldDisabled}
              onCheckedChange={(checked) => onMarkSold(checked === true)}
              className="size-8 border-2 data-checked:border-green-600 data-checked:bg-green-600 data-checked:text-white *:data-[slot=checkbox-indicator]:[&>svg]:size-5! disabled:opacity-50"
            />
          </div>
        </div>
        {isEditing && (
          <div className="flex flex-col gap-2">
            <textarea
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ex: Vendida para Maria das Graças..."
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="flex justify-end items-center gap-3">
              <Button
                variant="secondary"
                size="icon"
                onClick={cancelObservation}
                className="size-8 rounded-full"
              >
                <FontAwesomeIcon icon={faXmark} className="text-sm" />
              </Button>
              <Button
                size="icon"
                onClick={saveObservation}
                disabled={observationSaving}
                className="size-8 rounded-full bg-green-500 hover:bg-green-600 text-white"
              >
                <FontAwesomeIcon icon={faCheck} className="text-sm" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
