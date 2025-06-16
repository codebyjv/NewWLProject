export const createPageUrl = (
  pathname: string,
  params?: Record<string, string | number>
): string => {
  // Remove barras duplicadas e normaliza a URL
  let url = pathname.replace(/\/+/g, '/').replace(/\/$/, '');

  // Adiciona parâmetros de query (opcional)
  if (params && Object.keys(params).length > 0) {
    const queryString = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    url += `?${queryString}`;
  }

  return url;
};