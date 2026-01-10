export function formatBytes(bytes?: number, decimals: number = 2): string {
  if (bytes === undefined || bytes === 0) return 'N/A';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const formattedValue = parseFloat((bytes / Math.pow(k, i)).toFixed(decimals));
  
  return `${formattedValue} ${sizes[i]}`;
}