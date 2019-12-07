import {repository} from '@loopback/repository';
import {post, getModelSchemaRef, requestBody} from '@loopback/rest';
import {Qrcimage, Qrcspec} from '../models';
import {QrcimageRepository} from '../repositories';
const QRCode = require('qrcode');

export class QrcgenController {
  constructor(
    @repository(QrcimageRepository)
    public qrcimageRepository: QrcimageRepository,
  ) {}

  @post('/qrcode', {
    responses: {
      '200': {
        description: 'Create QRCode image',
        content: {'application/json': {schema: getModelSchemaRef(Qrcimage)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {schema: getModelSchemaRef(Qrcspec)},
      },
    })
    qrcspec: Qrcspec,
  ): Promise<Qrcimage> {
    if (!qrcspec.value) throw new Error('QRC Spec value field must be defined');
    const id = this.getTag(qrcspec);
    let image: Qrcimage = new Qrcimage();
    await this.qrcimageRepository
      .findById(id, {})
      .then(qrc => (image = qrc))
      .catch(async err => {
        image = new Qrcimage();
        image.id = id;
        image.svg = await this.createQRCodeImage(qrcspec);
        await this.qrcimageRepository.create(image);
      });
    return image;
  }

  createQRCodeImage(spec: Qrcspec): Promise<string> {
    return QRCode.toString(spec.value, {
      errorCorrectionLevel: spec.errorCorrectionLevel,
      type: 'svg',
      margin: spec.margin,
      color: {
        dark: spec.foreground ? spec.foreground : '#000000',
        light: spec.background ? spec.background : '#ffffff',
      },
    });
  }

  getTag(spec: Qrcspec): string {
    return `v:${spec.value}:erl:${spec.errorCorrectionLevel}:q:${spec.quality}:m:${spec.margin}:b:${spec.background}:f:${spec.foreground}`;
  }
}
