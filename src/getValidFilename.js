export default (url, type = 'file') => {
  const hostAndPathName = `${url.hostname}${url.pathname}`;
  switch (type) {
    case 'dir': {
      return `${hostAndPathName.replace(/[^a-zA-Z0-9]/gm, '-')}_files`;
    }
    case 'image': {
      const extension = url.toString().endsWith('.png') ? '.png' : 'jpg';
      const [name] = url.toString().split(extension);
      return `${name.replace(/[^a-zA-Z0-9]/gm, '-')}${extension}`;
    }
    default: {
      return `${hostAndPathName.replace(/[^a-zA-Z0-9]/gm, '-')}.html`;
    }
  }
};
