import { format } from "date-fns";
export function dateFormatter(dateStr: any) {
  if (dateStr) {
    const dateObj = new Date(dateStr);
    return format(dateObj, "yyyy-MM-dd");
  }
  return "";
}
