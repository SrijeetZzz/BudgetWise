
'use client';

import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Pencil, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useCategories } from '@/features/categories/hooks/use-categories';
import { CategoryIcon } from '@/features/categories/components/category-icon';

import { useUpdateTransaction } from '../hooks/use-update-transaction';

import type { Category } from '@/types/category.types';
import type {
  PaymentMethod,
  Transaction,
  TransactionType,
  UpdateTransactionInput,
} from '@/types/transaction.types';

interface EditTransactionDialogProps {
  transaction: Transaction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function getId(value: string | Category | null | undefined): string {
  if (!value) return '';
  return typeof value === 'string' ? value : value._id;
}

function toDateInputValue(date: string) {
  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return '';

  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  'CASH',
  'CARD',
  'UPI',
  'BANK_TRANSFER',
  'WALLET',
  'CHEQUE',
  'OTHER',
];

export function EditTransactionDialog({
  transaction,
  open,
  onOpenChange,
}: EditTransactionDialogProps) {
  const updateTransaction = useUpdateTransaction();
  const { data: categoryResponse, isLoading: categoriesLoading } = useCategories();

  const categories = categoryResponse?.data ?? [];

  const parentCategories = useMemo(
    () => categories.filter((category) => category.level === 0),
    [categories],
  );

  const [type, setType] = useState<TransactionType>(transaction.type);
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [title, setTitle] = useState(transaction.title);
  const [amount, setAmount] = useState(String(transaction.amount));
  const [currency, setCurrency] = useState(transaction.currency);
  const [description, setDescription] = useState(transaction.description ?? '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>(
    transaction.paymentMethod ?? '',
  );
  const [transactionDate, setTransactionDate] = useState(
    toDateInputValue(transaction.transactionDate),
  );
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;

    setType(transaction.type);
    setCategoryId(getId(transaction.categoryId));
    setSubcategoryId(getId(transaction.subcategoryId));
    setTitle(transaction.title);
    setAmount(String(transaction.amount));
    setCurrency(transaction.currency);
    setDescription(transaction.description ?? '');
    setPaymentMethod(transaction.paymentMethod ?? '');
    setTransactionDate(toDateInputValue(transaction.transactionDate));
    setError('');
  }, [open, transaction]);

  const availableCategories = parentCategories.filter(
    (category) => category.type === type,
  );

  const subcategories = useMemo(
    () =>
      categories.filter(
        (category) =>
          category.level === 1 &&
          category.parentCategoryId === categoryId &&
          category.type === type,
      ),
    [categories, categoryId, type],
  );

  const selectedCategory = categories.find((category) => category._id === categoryId);
  const selectedSubcategory = categories.find((category) => category._id === subcategoryId);

  const isDirty = useMemo(() => {
    const initialCategoryId = getId(transaction.categoryId);
    const initialSubcategoryId = getId(transaction.subcategoryId);
    const initialDate = toDateInputValue(transaction.transactionDate);

    return (
      type !== transaction.type ||
      categoryId !== initialCategoryId ||
      subcategoryId !== initialSubcategoryId ||
      title.trim() !== transaction.title ||
      Number(amount) !== transaction.amount ||
      currency.trim().toUpperCase() !== transaction.currency ||
      description.trim() !== (transaction.description ?? '') ||
      paymentMethod !== (transaction.paymentMethod ?? '') ||
      transactionDate !== initialDate
    );
  }, [
    type,
    categoryId,
    subcategoryId,
    title,
    amount,
    currency,
    description,
    paymentMethod,
    transactionDate,
    transaction,
  ]);

  const handleTypeChange = (nextType: TransactionType) => {
    setType(nextType);
    const currentCategory = categories.find((c) => c._id === categoryId);

    if (currentCategory && currentCategory.type !== nextType) {
      setCategoryId('');
      setSubcategoryId('');
    }
  };

  const handleCategoryChange = (nextCategoryId: string) => {
    setCategoryId(nextCategoryId);
    setSubcategoryId('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!categoryId) {
      setError('Please select a category.');
      return;
    }

    if (!title.trim()) {
      setError('Transaction title is required.');
      return;
    }

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError('Amount must be greater than 0.');
      return;
    }

    if (!currency.trim()) {
      setError('Currency is required.');
      return;
    }

    if (!transactionDate) {
      setError('Transaction date is required.');
      return;
    }

    const payload: UpdateTransactionInput = {
      categoryId,
      type,
      amount: numericAmount,
      currency: currency.trim().toUpperCase(),
      title: title.trim(),
      description: description.trim() || undefined,
      paymentMethod: paymentMethod || undefined,
      transactionDate: new Date(`${transactionDate}T00:00:00`).toISOString(),
    };

    if (subcategoryId) {
      payload.subcategoryId = subcategoryId;
    }

    try {
      await updateTransaction.mutateAsync({
        transactionId: transaction._id,
        payload,
      });

      onOpenChange(false);
    } catch {
      setError('Unable to update transaction. Please try again.');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in-0">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-border/60 bg-card shadow-2xl transition-all animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Pencil className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
                Edit Transaction
              </h2>
              <p className="text-xs text-muted-foreground">
                Update transaction details and category assignments
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

        <form onSubmit={handleSubmit} className="space-y-4 p-5 sm:p-6">
          {/* Type Toggle */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground sm:text-sm">
              Transaction Type
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleTypeChange('EXPENSE')}
                className={`h-10 rounded-xl border text-xs font-semibold sm:text-sm transition-all active:scale-95 ${
                  type === 'EXPENSE'
                    ? 'border-destructive bg-destructive/10 text-destructive shadow-xs'
                    : 'border-border/60 hover:bg-muted/50 text-muted-foreground'
                }`}
              >
                Expense
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('INCOME')}
                className={`h-10 rounded-xl border text-xs font-semibold sm:text-sm transition-all active:scale-95 ${
                  type === 'INCOME'
                    ? 'border-emerald-500/80 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'border-border/60 hover:bg-muted/50 text-muted-foreground'
                }`}
              >
                Income
              </button>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground sm:text-sm">
              Category
            </Label>
            <Select
              value={categoryId || ''}
              onValueChange={(val) => handleCategoryChange(val ?? '')}
              disabled={categoriesLoading}
            >
              <SelectTrigger className="h-11 px-3.5 text-sm sm:h-10">
                <SelectValue placeholder="Select category">
                  {selectedCategory ? (
                    <div className="flex items-center gap-2">
                      <CategoryIcon name={selectedCategory.icon} className="size-4" />
                      <span>{selectedCategory.name}</span>
                    </div>
                  ) : (
                    'Select category'
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {availableCategories.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    <div className="flex items-center gap-2">
                      <CategoryIcon name={cat.icon} className="size-4" />
                      <span>{cat.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subcategory */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground sm:text-sm">
              Subcategory <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Select
              value={subcategoryId || ''}
              onValueChange={(val) => setSubcategoryId(val ?? '')}
              disabled={!categoryId || subcategories.length === 0}
            >
              <SelectTrigger className="h-11 px-3.5 text-sm sm:h-10">
                <SelectValue
                  placeholder={
                    !categoryId
                      ? 'Select category first'
                      : subcategories.length === 0
                        ? 'No subcategories'
                        : 'Select subcategory'
                  }
                >
                  {selectedSubcategory ? (
                    <div className="flex items-center gap-2">
                      <CategoryIcon name={selectedSubcategory.icon} className="size-4" />
                      <span>{selectedSubcategory.name}</span>
                    </div>
                  ) : !categoryId ? (
                    'Select category first'
                  ) : subcategories.length === 0 ? (
                    'No subcategories'
                  ) : (
                    'Select subcategory'
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {subcategories.map((sub) => (
                  <SelectItem key={sub._id} value={sub._id}>
                    <div className="flex items-center gap-2">
                      <CategoryIcon name={sub.icon} className="size-4" />
                      <span>{sub.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-title" className="text-xs font-medium text-foreground sm:text-sm">
              Title
            </Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={100}
              placeholder="e.g. Grocery shopping"
              className="h-11 px-3.5 text-sm sm:h-10 placeholder:text-muted-foreground/60"
            />
          </div>

          {/* Amount + Currency */}
          <div className="grid grid-cols-[1fr_120px] gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="edit-amount" className="text-xs font-medium text-foreground sm:text-sm">
                Amount
              </Label>
              <Input
                id="edit-amount"
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                className="h-11 px-3.5 text-sm sm:h-10 placeholder:text-muted-foreground/60"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-currency" className="text-xs font-medium text-foreground sm:text-sm">
                Currency
              </Label>
              <Input
                id="edit-currency"
                value={currency}
                maxLength={3}
                onChange={(event) => setCurrency(event.target.value.toUpperCase())}
                className="h-11 px-3.5 text-sm uppercase font-mono sm:h-10"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground sm:text-sm">
              Payment Method
            </Label>
            <Select
              value={paymentMethod || ''}
              onValueChange={(val) => setPaymentMethod(val as PaymentMethod)}
            >
              <SelectTrigger className="h-11 px-3.5 text-sm sm:h-10">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method
                      .toLowerCase()
                      .split('_')
                      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
                      .join(' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Transaction Date */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-date" className="text-xs font-medium text-foreground sm:text-sm">
              Transaction Date
            </Label>
            <div className="relative flex items-center">
              <CalendarDays className="pointer-events-none absolute left-3.5 size-4 text-muted-foreground" />
              <Input
                id="edit-date"
                type="date"
                value={transactionDate}
                onChange={(event) => setTransactionDate(event.target.value)}
                className="h-11 pl-10 pr-3.5 text-sm sm:h-10"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-description" className="text-xs font-medium text-foreground sm:text-sm">
              Description
            </Label>
            <textarea
              id="edit-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={500}
              rows={3}
              placeholder="Optional notes or merchant details..."
              className="min-h-80px w-full rounded-xl border border-border/60 bg-background p-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/60 resize-none"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-xs font-medium text-destructive">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse justify-end gap-2 border-t border-border/60 pt-4 sm:flex-row sm:gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={updateTransaction.isPending}
              onClick={() => onOpenChange(false)}
              className="h-11 text-xs font-medium sm:h-10 sm:text-sm"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                !isDirty ||
                updateTransaction.isPending ||
                !categoryId ||
                !title.trim() ||
                !amount ||
                !transactionDate
              }
              className="h-11 text-xs font-semibold sm:h-10 sm:text-sm"
            >
              {updateTransaction.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}