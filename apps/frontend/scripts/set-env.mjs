import { writeFileSync } from 'fs';
import { join } from 'path';

const targetPath = join('./src/environments/environment.prod.ts');

const envConfig = `
export const environment = {
  production: true,
  authDomain: '${process.env.NG_APP_AUTH_DOMAIN}',
  authClientId: '${process.env.NG_APP_AUTH_CLIENT_ID}',
  authAudience: '${process.env.NG_APP_AUTH_AUDIENCE}',
};
`;

console.log('Writing environment.prod.ts with Vercel environment variables...');
writeFileSync(targetPath, envConfig);
