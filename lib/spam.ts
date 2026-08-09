const URL_PATTERN = /https?:\/\/\S+/gi;

/**
 * Cheap heuristics on top of the honeypot field. Not meant to catch
 * sophisticated spam — just the high-volume automated submissions that hit
 * every public contact form.
 */
export function looksLikeSpam(fields: { subject: string; message: string }): boolean {
  const urlMatches = fields.message.match(URL_PATTERN) ?? [];
  if (urlMatches.length > 3) return true;

  const isShouting = fields.subject.length > 10 && fields.subject === fields.subject.toUpperCase();
  if (isShouting) return true;

  return false;
}
