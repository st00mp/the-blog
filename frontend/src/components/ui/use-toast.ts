import { useCallback } from "react"

export type ToastOptions = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

export function useToast() {
  // À adapter selon votre système réel de notifications
  const toast = useCallback((opts: ToastOptions) => {
    window.alert(
      (opts.variant === "destructive" ? "[Erreur] " : "") +
      (opts.title ? opts.title + "\n" : "") +
      (opts.description || "")
    )
  }, [])

  return { toast }
}
