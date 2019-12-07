import {Entity, model, property} from '@loopback/repository';

@model()
export class Qrcimage extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  svg: string;


  constructor(data?: Partial<Qrcimage>) {
    super(data);
  }
}

export interface QrcimageRelations {
  // describe navigational properties here
}

export type QrcimageWithRelations = Qrcimage & QrcimageRelations;
