import { SITE_NAME } from './../../constant/index';

export function pageTitleGenerator(pageName: string) {
  return `${pageName} - ${SITE_NAME}`;
}
