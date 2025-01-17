
export const isVideo = (url: string): boolean => {
    const videoExtensions = ['mp4', 'webm', 'ogg', 'avi', 'mov', 'mkv', 'flv', 'wmv'];
    const extension = url.split('.').pop()?.toLowerCase();
    return videoExtensions.includes(extension || '');
};

export const httpsHost = 'https://xn--2-stbc.xn----7sbecl2dbcfoo.xn--p1ai';
export const makeUrl = (url: string) => url.indexOf('https:') !== -1 ? url : url.indexOf('http:') !== -1 ? url.replace('http:', 'https:') : `${httpsHost}${url}`;