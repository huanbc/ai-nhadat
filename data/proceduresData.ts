import { Procedure } from '../types';
import { TTHC_TINH_DATA } from './tthc-tinh';
import { TTHC_XA_DATA } from './tthc-xa';

export const PROCEDURES_DATA: Procedure[] = [
  ...TTHC_TINH_DATA,
  ...TTHC_XA_DATA,
];
