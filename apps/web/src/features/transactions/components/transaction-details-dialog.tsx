"use client";

import {
  CalendarDays,
  CreditCard,
  FileText,
  Repeat,
  X,
  Paperclip,
  ExternalLink,
  Upload,
  Trash2,
  Loader2,
} from "lucide-react";
import { useState } from "react";

import type { Transaction } from "@/types/transaction.types";
import { CategoryIcon } from "@/features/categories/components/category-icon";
import { Button } from "@/components/ui/button";

import { env } from "@/lib/env";
import { useUploadAttachment } from "../hooks/use-upload-attachment";
import { useDeleteAttachment } from "../hooks/use-delete-attachment";

interface TransactionDetailsDialogProps {
  transaction: Transaction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransactionDetailsDialog({
  transaction,
  open,
  onOpenChange,
}: TransactionDetailsDialogProps) {
  const [attachmentError, setAttachmentError] = useState("");

  const uploadAttachment = useUploadAttachment();

  const deleteAttachment = useDeleteAttachment();

  if (!open) {
    return null;
  }

  const category =
    typeof transaction.categoryId === "string" ? null : transaction.categoryId;

  const subcategory =
    typeof transaction.subcategoryId === "string" ||
    transaction.subcategoryId === null
      ? null
      : transaction.subcategoryId;

  const isExpense = transaction.type === "EXPENSE";

  const formattedAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: transaction.currency,
    maximumFractionDigits: 2,
  }).format(transaction.amount);

  const formattedDate = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(transaction.transactionDate));

  const handleAttachmentUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setAttachmentError("");

    try {
      await uploadAttachment.mutateAsync({
        transactionId: transaction._id,
        file,
      });
    } catch {
      setAttachmentError("Unable to upload receipt. Please try again.");
    } finally {
      event.target.value = "";
    }
  };

  const handleAttachmentDelete = async () => {
    setAttachmentError("");

    try {
      await deleteAttachment.mutateAsync(transaction._id);
    } catch {
      setAttachmentError("Unable to delete receipt. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in-0">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-border/60 bg-card shadow-2xl transition-all animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 p-5 sm:p-6">
          <div className="flex min-w-0 items-center gap-3.5">
            <div
              className="flex size-11 shrink-0 items-center justify-center rounded-xl transition-all"
              style={{
                backgroundColor: `${category?.color ?? "#64748B"}18`,
                color: category?.color ?? "#64748B",
              }}
            >
              <CategoryIcon
                name={category?.icon ?? "receipt"}
                className="size-5"
              />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-base font-bold tracking-tight text-foreground sm:text-lg">
                {transaction.title}
              </h2>

              <p className="text-xs text-muted-foreground">
                {category?.name ?? "Unknown category"}

                {subcategory && (
                  <span className="text-muted-foreground/80">
                    {" "}
                    / {subcategory.name}
                  </span>
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Amount Hero */}
        <div className="border-b border-border/60 bg-muted/10 px-5 py-6 text-center sm:px-6">
          <span className="inline-block rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-secondary-foreground">
            {transaction.type}
          </span>

          <p
            className={`mt-2 text-3xl font-extrabold sm:text-4xl ${
              isExpense
                ? "text-destructive"
                : "text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {isExpense ? "-" : "+"}
            {formattedAmount}
          </p>
        </div>

        {/* Primary Details */}
        <div className="space-y-1 p-5 sm:p-6">
          <DetailRow
            icon={<CalendarDays className="size-4" />}
            label="Transaction Date"
            value={formattedDate}
          />

          {transaction.paymentMethod && (
            <DetailRow
              icon={<CreditCard className="size-4" />}
              label="Payment Method"
              value={formatPaymentMethod(transaction.paymentMethod)}
            />
          )}

          {transaction.description && (
            <DetailRow
              icon={<FileText className="size-4" />}
              label="Description"
              value={transaction.description}
            />
          )}

          {transaction.transactionSource === "RECURRING" && (
            <DetailRow
              icon={<Repeat className="size-4" />}
              label="Transaction Source"
              value="Recurring"
            />
          )}
        </div>

        {/* Recurring Breakdown */}
        {transaction.transactionSource === "RECURRING" && (
          <div className="mx-5 mb-5 rounded-xl border border-border/60 bg-muted/20 p-4 sm:mx-6">
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <Repeat className="size-3.5" />
              <span>Recurrence Schedule</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[11px] text-muted-foreground">Frequency</p>

                <p className="mt-0.5 font-semibold text-foreground">
                  {formatRecurrence(transaction.recurrenceFrequency)}
                </p>
              </div>

              <div>
                <p className="text-[11px] text-muted-foreground">Status</p>

                <p className="mt-0.5 font-semibold text-foreground">
                  {formatRecurrence(transaction.recurrenceStatus)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Receipt / Attachments */}
        <div className="border-t border-border/60 p-5 sm:p-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Paperclip className="size-3.5" />
                <span>
                  Receipt
                  {transaction.attachments.length > 0 &&
                    ` (${transaction.attachments.length})`}
                </span>
              </div>

              <p className="mt-1 text-[11px] text-muted-foreground">
                Attach a receipt to this transaction.
              </p>
            </div>

            {/* Upload button only when there is no receipt */}
            {transaction.attachments.length === 0 && (
              <>
                <label
                  htmlFor={`receipt-upload-${transaction._id}`}
                  className={`inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-border/60 bg-card px-3 py-2 text-xs font-semibold transition-colors hover:bg-muted ${
                    uploadAttachment.isPending
                      ? "pointer-events-none opacity-50"
                      : ""
                  }`}
                >
                  {uploadAttachment.isPending ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Upload className="size-3.5" />
                  )}

                  <span>
                    {uploadAttachment.isPending ? "Uploading..." : "Upload"}
                  </span>
                </label>

                <input
                  id={`receipt-upload-${transaction._id}`}
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  disabled={uploadAttachment.isPending}
                  onChange={handleAttachmentUpload}
                />
              </>
            )}
          </div>

          {transaction.attachments.length > 0 ? (
            <div className="space-y-2">
              {transaction.attachments.map((attachment) => (
                <div
                  key={attachment.fileName}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/20 p-3 transition-colors hover:bg-muted/40"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-card">
                      <FileText className="size-4 text-muted-foreground" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-foreground sm:text-sm">
                        {attachment.fileName}
                      </p>

                      <p className="text-[10px] text-muted-foreground">
                        {formatFileSize(attachment.fileSize)}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    {/* View */}
                    <a
                      href={`${env.API_URL.replace("/api/v1", "")}${attachment.fileUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                      aria-label="View receipt"
                    >
                      <ExternalLink className="size-4" />
                    </a>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={handleAttachmentDelete}
                      disabled={deleteAttachment.isPending}
                      className="inline-flex size-8 items-center justify-center rounded-lg text-destructive transition-colors hover:bg-destructive/10 disabled:pointer-events-none disabled:opacity-50"
                      aria-label="Delete receipt"
                    >
                      {deleteAttachment.isPending ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Trash2 className="size-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border/60 p-5 text-center">
              <FileText className="mx-auto size-7 text-muted-foreground/50" />

              <p className="mt-2 text-sm font-medium text-foreground">
                No receipt attached
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Upload an image or PDF receipt.
              </p>
            </div>
          )}

          {attachmentError && (
            <p className="mt-2 text-xs text-destructive">{attachmentError}</p>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border/60 p-4 sm:p-5">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-10 w-full text-xs font-semibold sm:text-sm"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function DetailRow({ icon, label, value }: DetailRowProps) {
  return (
    <div className="flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-muted/30">
      <div className="mt-0.5 shrink-0 text-muted-foreground">{icon}</div>

      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium text-muted-foreground">{label}</p>

        <p className="mt-0.5 wrap-break-words text-xs font-semibold text-foreground sm:text-sm">
          {value}
        </p>
      </div>
    </div>
  );
}

function formatPaymentMethod(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatRecurrence(value: string | null) {
  if (!value) {
    return "—";
  }

  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
