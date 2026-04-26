export function formatDateTime(value: string | null) {
  if (!value) {
    return "Sin fecha definida";
  }

  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
