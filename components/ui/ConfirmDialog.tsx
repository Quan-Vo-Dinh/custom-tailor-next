"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "./Button";
import { GlassCard } from "./GlassCard";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  variant = "warning",
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <GlassCard className="p-6 max-w-md w-full">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                      variant === "danger"
                        ? "bg-red-500/10"
                        : variant === "warning"
                        ? "bg-yellow-500/10"
                        : "bg-blue-500/10"
                    }`}
                  >
                    <AlertTriangle
                      className={`w-6 h-6 ${
                        variant === "danger"
                          ? "text-red-400"
                          : variant === "warning"
                          ? "text-yellow-400"
                          : "text-blue-400"
                      }`}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-medium text-white">{title}</h3>
                      <button
                        onClick={onClose}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                      >
                        <X className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                    <p className="text-gray-400 mb-6">{message}</p>

                    {/* Actions */}
                    <div className="flex gap-3 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onClose}
                      >
                        {cancelText}
                      </Button>
                      <Button
                        variant={variant === "danger" ? "luxury" : "luxury"}
                        size="sm"
                        onClick={handleConfirm}
                        className={
                          variant === "danger"
                            ? "bg-red-500 hover:bg-red-600"
                            : ""
                        }
                      >
                        {confirmText}
                      </Button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

