import React from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

type ModalAlertProps = {
  type: 'success' | 'error';
  message: string;
  subMessage?: string;
  onClose?: () => void;
};

export default function ModalAlert({ type, message, subMessage, onClose }: ModalAlertProps) {
  const isSuccess = type === 'success';

  const bgColor = isSuccess
    ? 'bg-green-100 dark:bg-green-900/20'
    : 'bg-red-100 dark:bg-red-900/20';
  const borderColor = isSuccess
    ? 'border-green-300 dark:border-green-600'
    : 'border-red-300 dark:border-red-600';
  const textColor = isSuccess
    ? 'text-green-800 dark:text-green-300'
    : 'text-red-800 dark:text-red-300';
  const Icon = isSuccess ? FaCheckCircle : FaTimesCircle;

  return (
    <div
      className={`w-full ${bgColor} ${borderColor} ${textColor} border rounded-md p-4 shadow-sm`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-2 items-start">
          <Icon className="mt-0.5 text-lg flex-shrink-0" />
          <div>
            <h2 className="font-semibold text-sm">{message}</h2>
            {subMessage && <p className="text-xs mt-1 text-gray-700 dark:text-gray-300">{subMessage}</p>}
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`text-xs font-semibold ${textColor} hover:underline transition duration-200`}
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
}
