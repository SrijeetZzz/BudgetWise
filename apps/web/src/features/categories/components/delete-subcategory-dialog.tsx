'use client';

import { useState } from 'react';
import { Loader2, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

import type { Category } from '@/types/category.types';
import { useDeleteSubcategory } from '../hooks/use-delete-subcategory';

interface DeleteSubcategoryDialogProps {
  subcategory: Category;
}

export function DeleteSubcategoryDialog({
  subcategory,
}: DeleteSubcategoryDialogProps) {
  const [open, setOpen] = useState(false);

  const deleteSubcategory =
    useDeleteSubcategory();

  if (subcategory.isSystem) {
    return null;
  }

  const handleDelete = async () => {
    await deleteSubcategory.mutateAsync(
      subcategory._id,
    );

    setOpen(false);
  };

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="h-8 gap-1.5 px-2 text-xs text-destructive hover:text-destructive"
      >
        <Trash2 className="size-3.5" />
        Delete
      </Button>

      {open && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-xl">
            <div className="mb-5">
              <h2 className="text-lg font-semibold">
                Delete Subcategory
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Are you sure you want to delete{' '}
                <span className="font-medium text-foreground">
                  {subcategory.name}
                </span>
                ?
              </p>
            </div>

            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
              <p className="text-xs text-destructive">
                This action cannot be undone from the
                current interface.
              </p>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={
                  deleteSubcategory.isPending
                }
              >
                Cancel
              </Button>

              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={
                  deleteSubcategory.isPending
                }
              >
                {deleteSubcategory.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="size-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}