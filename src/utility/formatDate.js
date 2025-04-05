export const formatDate = (isoDate) => {
    return new Date(isoDate).toLocaleString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
      // hour: "2-digit", minute: "2-digit", second: "2-digit",
      timeZone: "Asia/Kolkata"
    });
  };