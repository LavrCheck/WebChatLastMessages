export const isVideo = (url: string): boolean => {
    const videoExtensions = ['mp4', 'webm', 'ogg', 'avi', 'mov', 'mkv', 'flv', 'wmv'];
    const extension = url.split('.').pop()?.toLowerCase();
    return videoExtensions.includes(extension || '');
};