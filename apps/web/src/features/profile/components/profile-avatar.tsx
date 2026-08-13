'use client';

import { ChangeEvent, useRef } from 'react';
import { Pencil, Trash2, Loader2, User } from 'lucide-react';

import { env } from '@/lib/env';
import type { Profile } from '@/types/profile.types';

import { useProfileImage } from '../hooks/use-profile-image';

interface ProfileAvatarProps {
  profile: Profile;
}

export function ProfileAvatar({ profile }: ProfileAvatarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { upload, remove } = useProfileImage();

  const handleSelectImage = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    upload.mutate(file);
    event.target.value = '';
  };

  const imageUrl = profile.profileImage
    ? `${env.API_URL.replace('/api/v1', '')}/${profile.profileImage}`
    : null;

  const isProcessing = upload.isPending || remove.isPending;

  return (
    <div className="relative group size-20 shrink-0 sm:size-24">
      {/* Avatar Container */}
      <div className="size-full overflow-hidden rounded-full border-2 border-border/60 bg-primary/10 shadow-sm">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={profile.displayName || 'User Avatar'}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-primary sm:text-3xl">
            {profile.displayName ? profile.displayName.charAt(0).toUpperCase() : <User className="size-8" />}
          </div>
        )}
      </div>

      {/* Hover Action Overlay */}
      <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-full bg-black/60 opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover:opacity-100">
        {isProcessing ? (
          <Loader2 className="size-6 animate-spin text-white" />
        ) : (
          <>
            {/* Edit Button */}
            <button
              type="button"
              onClick={handleSelectImage}
              title="Change Profile Picture"
              className="flex size-8 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/40 active:scale-95 sm:size-9"
            >
              <Pencil className="size-4" />
            </button>

            {/* Delete Button */}
            {profile.profileImage && (
              <button
                type="button"
                onClick={() => remove.mutate()}
                title="Remove Profile Picture"
                className="flex size-8 items-center justify-center rounded-full bg-destructive/80 text-white transition-colors hover:bg-destructive active:scale-95 sm:size-9"
              >
                <Trash2 className="size-4" />
              </button>
            )}
          </>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}