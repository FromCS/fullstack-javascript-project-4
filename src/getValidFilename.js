export default (hostname) => `${hostname.replace(/[^a-zA-Z0-9]/gm, '-')}.html`;
