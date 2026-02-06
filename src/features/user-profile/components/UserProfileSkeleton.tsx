import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import ErrorToast from '../../../components/toasts/ErrorToast';

type UserProfileSkeletonProps = {
  errorMessages?: string[];
};

export default function UserProfileSkeleton({
  errorMessages
}: UserProfileSkeletonProps) {
  const { t } = useTranslation();
  const [showErrorToast, setShowErrorToast] = useState(
    !!errorMessages && errorMessages.length > 0
  );

  return (
    <div className="from-base-100 to-base-200 flex min-h-screen items-center justify-center bg-gradient-to-br px-4 py-12">
      {showErrorToast && (
        <ErrorToast
          messages={errorMessages!}
          onCloseToast={() => setShowErrorToast(false)}
        />
      )}

      <div className="card bg-base-100 w-full max-w-3xl shadow-xl">
        <div className="card-body">
          {/* Header Section */}
          <div className="mb-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="skeleton h-16 w-16 flex-shrink-0 rounded-full" />
              <div className="space-y-2">
                <div className="skeleton h-6 w-48" />
                <div className="skeleton h-4 w-64" />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="skeleton h-12 w-20 rounded-lg" />
              <div className="skeleton h-12 w-20 rounded-lg" />
            </div>
          </div>

          {/* Profile Form Skeleton */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b pb-4">
              <div className="skeleton h-6 w-24" />
            </div>

            {/* Form Fields */}
            {[...Array(5)].map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="skeleton h-4 w-32" />
                <div className="skeleton h-12 w-full rounded-lg" />
              </div>
            ))}
          </div>

          {/* Action Links */}
          <div className="mt-8 flex flex-col gap-3 border-t pt-6 sm:flex-row sm:justify-between">
            <div className="skeleton h-5 w-40" />
            <div className="skeleton h-5 w-40" />
            <div className="skeleton h-5 w-40" />
          </div>
        </div>
      </div>
    </div>
  );
}
