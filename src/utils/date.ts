export function formatDate(dateString?: string | null, options?: Intl.DateTimeFormatOptions): string {
  if (!dateString) return 'N/A';

  try {
    const date = new Date(dateString);
    
    // Default options if not provided
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };

    return date.toLocaleString('en-US', options || defaultOptions);
  } catch (error) {
    console.warn(`Invalid date string: ${dateString}`, error);
    return 'Invalid Date';
  }
}

export function parseDate(dateString?: string | null): Date | null {
  if (!dateString) return null;

  try {
    return new Date(dateString);
  } catch (error) {
    console.warn(`Invalid date string: ${dateString}`, error);
    return null;
  }
}

export function getTimeSince(dateString?: string | null): string {
  if (!dateString) return 'N/A';

  const date = parseDate(dateString);
  
  if (!date) return 'N/A';

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
}

export function findMostRecentItem<T extends { created?: string | null }>(
  items: T[], 
  dateField: keyof T = 'created' as keyof T
): T | null {
  if (items.length === 0) return null;

  return items.reduce((mostRecent, current) => {
    const mostRecentTime = mostRecent[dateField] 
      ? new Date(mostRecent[dateField] as string).getTime() 
      : 0;
    const currentTime = current[dateField] 
      ? new Date(current[dateField] as string).getTime() 
      : 0;

    return currentTime > mostRecentTime ? current : mostRecent;
  });
}

export function findOldestItem<T extends { created?: string | null }>(
  items: T[], 
  dateField: keyof T = 'created' as keyof T
): T | null {
  if (items.length === 0) return null;

  return items.reduce((oldest, current) => {
    const oldestTime = oldest[dateField] 
      ? new Date(oldest[dateField] as string).getTime() 
      : Date.now();
    const currentTime = current[dateField] 
      ? new Date(current[dateField] as string).getTime() 
      : Date.now();

    return currentTime < oldestTime ? current : oldest;
  });
}