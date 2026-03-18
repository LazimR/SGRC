import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, X } from "lucide-react";
import bus from "../../utils/bus";
import type { AppEvents } from "../../utils/bus";
import type { JSX } from "react/jsx-runtime";

type FlashData = Parameters<AppEvents["flash"]>[0];

function FlashMessage() {
  const [flashMessage, setFlashMessage] = useState<FlashData | null>(null);
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleFlash = (payload: FlashData) => {
      const { message, type } = payload;

      setFlashMessage({ message, type });

      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);

      timeoutIdRef.current = setTimeout(() => {
        setFlashMessage(null);
      }, 3000);
    };

    bus.on("flash", handleFlash);

    return () => {
      bus.off("flash", handleFlash);
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    };
  }, []);

  const closeMessage = () => {
    if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    setFlashMessage(null);
  };

  const typeStyles: Record<
    FlashData["type"],
    {
      bg: string;
      iconBg: string;
      icon: JSX.Element | undefined;
      borderColor: string;
      textColor: string;
    }
  > = {
    success: {
      bg: "bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600",
      iconBg: "bg-emerald-600/20",
      borderColor: "border-emerald-400/30",
      textColor: "text-white",
      icon: <CheckCircle className="w-5 h-5 text-emerald-50" />,
    },
    error: {
      bg: "bg-gradient-to-r from-red-500 via-rose-500 to-red-600",
      iconBg: "bg-red-600/20",
      borderColor: "border-red-400/30",
      textColor: "text-white",
      icon: <XCircle className="w-5 h-5 text-red-50" />,
    },
    warning: {
      bg: "bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600",
      iconBg: "bg-amber-600/20",
      borderColor: "border-amber-400/30",
      textColor: "text-white",
      icon: <AlertTriangle className="w-5 h-5 text-amber-50" />,
    },
  };

  return (
    <div className="fixed top-5 right-5 z-50">
      <AnimatePresence>
        {flashMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={`
              relative flex items-center gap-4 px-6 py-4 
              rounded-2xl shadow-2xl border backdrop-blur-sm
              ${typeStyles[flashMessage.type].bg}
              ${typeStyles[flashMessage.type].borderColor}
              ${typeStyles[flashMessage.type].textColor}
              min-w-[320px] max-w-[420px]
              overflow-hidden
            `}
          >
            <div
              aria-hidden
              className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            />

            {/* Ícone com fundo */}
            <div
              className={`
              flex items-center justify-center 
              rounded-xl p-2.5
              ${typeStyles[flashMessage.type].iconBg}
              backdrop-blur-sm
              shadow-inner
            `}
            >
              {typeStyles[flashMessage.type].icon}
            </div>

            <span className="flex-1 font-medium text-sm leading-relaxed">
              {flashMessage.message}
            </span>

            <button
              onClick={closeMessage}
              className="
                ml-2 p-1.5 rounded-lg
                text-white/90 hover:text-white
                hover:bg-white/20 active:bg-white/30
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-white/50
              "
              aria-label="Fechar mensagem"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Barra de progresso animada */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1 bg-white/30"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 3, ease: "linear" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FlashMessage;
