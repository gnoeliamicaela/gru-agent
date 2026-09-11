import type { ChecklistItem } from "@/lib/participant-checklist";

interface DocumentChecklistProps {
  items: ChecklistItem[];
}

export default function DocumentChecklist({ items }: DocumentChecklistProps) {
  const getStateIcon = (estado: string) => {
    switch (estado) {
      case "completo":
        return "✅";
      case "pendiente":
        return "⏳";
      case "falta":
        return "❌";
      default:
        return "•";
    }
  };

  const getStateLabel = (estado: string) => {
    switch (estado) {
      case "completo":
        return "Completo";
      case "pendiente":
        return "Pendiente";
      case "falta":
        return "Falta / Rechazado";
      default:
        return "Desconocido";
    }
  };

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.nombre} className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-base">{getStateIcon(item.estado)}</span>
            <span className="text-xs font-medium text-gray-600">
              {getStateLabel(item.estado)}
            </span>
          </div>
          <p className="text-sm text-gray-900 ml-8">{item.nombre}</p>
          {item.estado === "falta" && item.motivo_rechazo && (
            <p className="text-xs text-red-600 ml-8 italic">
              {item.motivo_rechazo}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
