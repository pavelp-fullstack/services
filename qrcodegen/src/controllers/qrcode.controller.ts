// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/context';
import {get, post, param} from '@loopback/rest';
import {intercept, Interceptor} from '@loopback/context';
const QRCode = require('qrcode');

const svgMime: Interceptor = async (ctx, next) => {
  //wait for method to invoke
  const result = await next();
  // (ctx.parent as RequestContext).response.setHeader(
  //   'Content-Type',
  //   'image/svg+xml',
  // );
  // (ctx.parent as RequestContext).response.end(
  //   (ctx.parent as RequestContext).result,
  // );
  return result;
};

/*
const opts = {
  errorCorrectionLevel: 'H',
  type: 'image/jpeg',
  quality: 0.3,
  margin: 1,
  color: {
    dark: '#010599FF',
    light: '#FFBF60FF',
  },
};
*/

export class QrcodeController {
  constructor() {}

  @get('/qrcode')
  @intercept(svgMime)
  async qrcode(): Promise<string> {
    return QRCode.toString('www.google.com', {type: 'svg'});
  }

  @post('/qrcode/:options')
  async qrcodeEx() {
    return QRCode.toString('www.google.com', {type: 'svg'});
  }
}
