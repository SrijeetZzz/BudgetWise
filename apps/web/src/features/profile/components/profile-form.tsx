'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  User,
  Mail,
  Phone,
  DollarSign,
  Briefcase,
  Globe,
  Clock,
  Pencil,
  X,
  Check,
  Loader2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useProfile } from '../hooks/use-profile';
import { useUpdateProfile } from '../hooks/use-update-profile';
import { ProfileAvatar } from './profile-avatar';

import {
  updateProfileSchema,
  type UpdateProfileSchema,
} from '../schemas/update-profile.schema';

export function ProfileForm() {
  const [isEditing, setIsEditing] = useState(false);

  const { data, isLoading } = useProfile();

  const updateProfile = useUpdateProfile();

  const profile = data?.data;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),

    defaultValues: {
      displayName: '',
      monthlyIncome: undefined,
      occupation: '',
      country: '',
      timezone: '',
    },
  });

  useEffect(() => {
    if (!profile) {
      return;
    }

    reset({
      displayName: profile.displayName ?? '',
      monthlyIncome:
        profile.monthlyIncome ?? undefined,
      occupation: profile.occupation ?? '',
      country: profile.country ?? '',
      timezone: profile.timezone ?? '',
    });
  }, [profile, reset]);

  const handleCancel = () => {
    if (profile) {
      reset({
        displayName: profile.displayName ?? '',
        monthlyIncome:
          profile.monthlyIncome ?? undefined,
        occupation: profile.occupation ?? '',
        country: profile.country ?? '',
        timezone: profile.timezone ?? '',
      });
    }

    setIsEditing(false);
  };

  const onSubmit = async (
    values: UpdateProfileSchema,
  ) => {
    await updateProfile.mutateAsync(values);

    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-75 w-full items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />

          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-center text-sm text-destructive">
        Unable to load profile data.
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-6 sm:px-0">
      <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:p-8">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-5 border-b border-border/60 pb-5 sm:flex-row sm:items-center sm:justify-between">
          
          <div className="flex items-center gap-4">
            
            {/* Avatar */}
            <ProfileAvatar profile={profile} />

            {/* Profile heading */}
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {profile.displayName || 'Profile Settings'}
              </h1>

              <p className="text-xs text-muted-foreground sm:text-sm">
                Manage your account info and preferences
              </p>
            </div>
          </div>

          {!isEditing && (
            <Button
              type="button"
              onClick={() => setIsEditing(true)}
              className="h-10 w-full gap-2 text-xs font-semibold sm:w-auto sm:text-sm"
            >
              <Pencil className="size-3.5 sm:size-4" />
            </Button>
          )}
        </div>

        {/* Profile Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">

            {/* Display Name */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label
                htmlFor="displayName"
                className="text-xs font-medium text-foreground sm:text-sm"
              >
                Display Name
              </Label>

              <Input
                id="displayName"
                disabled={!isEditing}
                placeholder="Enter your name"
                leftIcon={
                  <User className="size-4 text-muted-foreground" />
                }
                invalid={!!errors.displayName}
                className="h-11 text-sm sm:h-10"
                {...register('displayName')}
              />

              {errors.displayName && (
                <p className="text-xs font-medium text-destructive">
                  {errors.displayName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-foreground sm:text-sm">
                Email Address
              </Label>

              <Input
                value={profile.email}
                disabled
                leftIcon={
                  <Mail className="size-4 text-muted-foreground" />
                }
                className="h-11 bg-muted/40 text-sm opacity-80 sm:h-10"
              />

              <p className="text-[11px] text-muted-foreground">
                Email cannot be changed directly
              </p>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-foreground sm:text-sm">
                Phone Number
              </Label>

              <Input
                value={
                  profile.phone || 'Not provided'
                }
                disabled
                leftIcon={
                  <Phone className="size-4 text-muted-foreground" />
                }
                className="h-11 bg-muted/40 text-sm opacity-80 sm:h-10"
              />

              <p className="text-[11px] text-muted-foreground">
                Requires OTP verification to modify
              </p>
            </div>

            {/* Monthly Income */}
            <div className="space-y-1.5">
              <Label
                htmlFor="monthlyIncome"
                className="text-xs font-medium text-foreground sm:text-sm"
              >
                Monthly Income
              </Label>

              <Input
                id="monthlyIncome"
                type="number"
                min={0}
                disabled={!isEditing}
                placeholder="0.00"
                leftIcon={
                  <DollarSign className="size-4 text-muted-foreground" />
                }
                invalid={!!errors.monthlyIncome}
                className="h-11 text-sm sm:h-10"
                {...register('monthlyIncome', {
                  valueAsNumber: true,
                })}
              />

              {errors.monthlyIncome && (
                <p className="text-xs font-medium text-destructive">
                  {errors.monthlyIncome.message}
                </p>
              )}
            </div>

            {/* Occupation */}
            <div className="space-y-1.5">
              <Label
                htmlFor="occupation"
                className="text-xs font-medium text-foreground sm:text-sm"
              >
                Occupation
              </Label>

              <Input
                id="occupation"
                disabled={!isEditing}
                placeholder="Software Engineer"
                leftIcon={
                  <Briefcase className="size-4 text-muted-foreground" />
                }
                invalid={!!errors.occupation}
                className="h-11 text-sm sm:h-10"
                {...register('occupation')}
              />

              {errors.occupation && (
                <p className="text-xs font-medium text-destructive">
                  {errors.occupation.message}
                </p>
              )}
            </div>

            {/* Country */}
            <div className="space-y-1.5">
              <Label
                htmlFor="country"
                className="text-xs font-medium text-foreground sm:text-sm"
              >
                Country
              </Label>

              <Input
                id="country"
                disabled={!isEditing}
                placeholder="India"
                leftIcon={
                  <Globe className="size-4 text-muted-foreground" />
                }
                invalid={!!errors.country}
                className="h-11 text-sm sm:h-10"
                {...register('country')}
              />

              {errors.country && (
                <p className="text-xs font-medium text-destructive">
                  {errors.country.message}
                </p>
              )}
            </div>

            {/* Timezone */}
            <div className="space-y-1.5">
              <Label
                htmlFor="timezone"
                className="text-xs font-medium text-foreground sm:text-sm"
              >
                Timezone
              </Label>

              <Input
                id="timezone"
                disabled={!isEditing}
                placeholder="Asia/Kolkata"
                leftIcon={
                  <Clock className="size-4 text-muted-foreground" />
                }
                invalid={!!errors.timezone}
                className="h-11 text-sm sm:h-10"
                {...register('timezone')}
              />

              {errors.timezone && (
                <p className="text-xs font-medium text-destructive">
                  {errors.timezone.message}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          {isEditing && (
            <div className="flex flex-col-reverse items-center justify-end gap-2.5 border-t border-border/60 pt-4 sm:flex-row sm:gap-3">
              
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={updateProfile.isPending}
                className="h-11 w-full gap-2 text-xs font-medium sm:h-10 sm:w-auto sm:text-sm"
              >
                <X className="size-4" />
              </Button>

              <Button
                type="submit"
                loading={updateProfile.isPending}
                disabled={!isDirty}
                className="h-11 w-full gap-2 text-xs font-semibold sm:h-10 sm:w-auto sm:text-sm"
              >
                <Check className="size-4" />
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}