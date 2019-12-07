import {Model, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Qrcspec extends Model {
  @property({
    type: 'string',
    required: true,
  })
  value: string;

  @property({
    type: 'string',
    required: true,
    default: 'H',
  })
  errorCorrectionLevel: string;

  @property({
    type: 'number',
    required: true,
    default: 1,
  })
  margin: number;

  @property({
    type: 'string',
    default: '#ffffff',
  })
  background: string;

  @property({
    type: 'string',
    default: '#000000',
  })
  foreground: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Qrcspec>) {
    super(data);
  }
}

export interface QrcspecRelations {
  // describe navigational properties here
}

export type QrcspecWithRelations = Qrcspec & QrcspecRelations;
