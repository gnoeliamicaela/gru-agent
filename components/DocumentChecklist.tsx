import type { ChecklistItem, ChecklistState } from "@/lib/participant-checklist";

interface DocumentChecklistProps {
  items: ChecklistItem[];
}

export default function DocumentChecklist({ items }: DocumentChecklistProps) {
  const getStateIcon = (estado: ChecklistState) => {
    switch (estado) {
      case "completo":
        return "✅";
      case "pendiente":
        return "⏳";
      case "rechazado":
      case "falta":
        return "❌";
      default:
        return "•";
    }
  };

  const getStateLabel = (estado: ChecklistState) => {
    switch (estado) {
      case "completo":
        return "Completo";
      case "pendiente":
        return "Pendiente";
      case "rechazado":
        return "Rechazado";
      case "falta":
        return "Falta";
      default:
        return "Desconocido";
    }
  };

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.nombre} className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-base">{getStateIcon(item.estado)}</span>
            <p className="text-sm text-gray-900">{item.nombre}</p>
          </div>
          <span className="text-xs text-gray-500 ml-8">
            {getStateLabel(item.estado)}
          </span>
          {item.comentario && (
            <p className="text-xs text-gray-600 ml-8 italic">
              {item.comentario}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
