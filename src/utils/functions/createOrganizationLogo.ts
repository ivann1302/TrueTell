import logo from '../../images/logo/organization-logo.svg';

export function createOrganizationLogo(siteUrl: string) {
  return {
    '@type': 'ImageObject',
    url: new URL(logo.src, siteUrl).toString(),
    width: logo.width,
    height: logo.height,
  };
}
