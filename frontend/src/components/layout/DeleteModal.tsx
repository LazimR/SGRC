import { AlertTriangle, X, Trash2 } from "lucide-react"

interface ConfirmDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: string
  itemName?: string
  isLoading?: boolean
}

function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar Exclusão",
  message = "Tem certeza que deseja excluir",
  itemName,
  isLoading = false
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="bg-linear-to-r from-red-600 to-red-500 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-white/80 hover:text-white transition disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <p className="text-gray-700 text-center">
            {message}
            {itemName && (
              <>
                {" "}
                <strong className="text-gray-900">"{itemName}"</strong>
              </>
            )}
            ?
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-3">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <p>Esta ação não pode ser desfeita.</p>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="
              flex-1 px-4 py-3
              bg-gray-100 hover:bg-gray-200
              text-gray-700 font-semibold
              rounded-xl transition
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="
              flex-1 px-4 py-3
              bg-red-600 hover:bg-red-700
              text-white font-semibold
              rounded-xl transition
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-2
            "
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Excluindo...
              </>
            ) : (
              "Sim, Excluir"
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default ConfirmDeleteModal
