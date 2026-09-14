import type { StaffEmailData } from "@/lib/email/mail-builder";

interface StaffEmailPreviewProps {
  email: StaffEmailData;
}

export default function StaffEmailPreview({ email }: StaffEmailPreviewProps) {
  return (
    <div className="flex justify-center mb-4">
      <div className="w-full max-w-md border border-gray-300 rounded-xl overflow-hidden bg-white shadow-sm">
        {/* Header - simulated Gmail header */}
        <div className="bg-gray-100 border-b border-gray-300 px-4 py-3">
          <p className="text-xs text-gray-600 font-medium">
            ✉️ Mail simulado — no enviado
          </p>
        </div>

        {/* Subject */}
        <div className="px-4 pt-4 pb-2">
          <h3 className="text-lg font-bold text-gray-900">{email.asunto}</h3>
        </div>

        {/* From and To */}
        <div className="px-4 pb-4 space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
              MG
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {email.remitente}
              </p>
              <p className="text-xs text-gray-500">&lt;{email.remitente_email}&gt;</p>
            </div>
          </div>
          <p className="text-sm text-gray-700">
            <span className="text-gray-600 font-medium">Para:</span>{" "}
            {email.para}
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Body */}
        <div className="px-4 py-4 space-y-4">
          <div>
            <p className="text-sm text-gray-900">
              <strong>Participante:</strong> {email.nombre_participante}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-900">
              <strong>Etapa actual:</strong> {email.etapa_actual}
            </p>
          </div>

          {/* Motivo block */}
          <div className="bg-gray-50 border-l-4 border-indigo-600 p-3 rounded">
            <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
              Motivo
            </p>
            <p className="text-sm text-gray-800">{email.motivo}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
