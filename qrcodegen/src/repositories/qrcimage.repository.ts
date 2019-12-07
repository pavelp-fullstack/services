import {DefaultCrudRepository} from '@loopback/repository';
import {Qrcimage, QrcimageRelations} from '../models';
import {QrcgenDsDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class QrcimageRepository extends DefaultCrudRepository<
  Qrcimage,
  typeof Qrcimage.prototype.id,
  QrcimageRelations
> {
  constructor(
    @inject('datasources.qrcgenDS') dataSource: QrcgenDsDataSource,
  ) {
    super(Qrcimage, dataSource);
  }
}
