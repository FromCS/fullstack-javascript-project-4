export default (url, type = 'file') => {
  const hostAndPathName = `${url.hostname}${url.pathname}`;
  switch (type) {
    case 'dir': {
      return `${hostAndPathName.replace(/[^a-zA-Z0-9]/gm, '-')}_files`;
    }
    case 'image': {
      const { host, pathname } = url;
      const extension = pathname.endsWith('.png') ? '.png' : '.jpg';
      const [path] = pathname.split(extension);
      const name = `${host}${path}`;
      return `${name.replace(/[^a-zA-Z0-9]/gm, '-')}${extension}`;
    }
    default: {
      return `${hostAndPathName.replace(/[^a-zA-Z0-9]/gm, '-')}.html`;
    }
  }
};
