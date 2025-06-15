

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

    const bgColor = isSuccess ? 'from-green-100 to-green-50' : 'from-red-100 to-red-50';
    const borderColor = isSuccess ? 'border-green-300' : 'border-red-300';
    const textColor = isSuccess ? 'text-green-800' : 'text-red-800';
    const Icon = isSuccess ? FaCheckCircle : FaTimesCircle;

    return (
        <div className={`absolute top-4 left-1/2 -translate-x-1/2 w-[90%] bg-gradient-to-br ${bgColor} ${borderColor} ${textColor} border rounded-xl p-5 shadow-lg z-20`}>
            <div className="flex items-start justify-between gap-3">
                <div className="flex gap-2 items-start">
                    <Icon className="mt-1 text-xl flex-shrink-0" />
                    <div>
                        <h2 className="font-semibold text-base">{message}</h2>
                        {subMessage && <p className="text-sm mt-1 text-gray-700">{subMessage}</p>}
                    </div>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className={`text-sm font-semibold ${textColor} hover:underline transition duration-200`}
                    >
                        Close
                    </button>
                )}
            </div>
        </div>
    );
}