import { mkdir, writeFile, copyFile } from 'node:fs/promises';
import { compile } from 'sass';
import { companyInfo } from '../src/config/company.ts';

await mkdir('backend/public', { recursive: true });
await writeFile('backend/public/workspace.css', compile('backend/resources/scss/workspace.scss', { style: 'compressed' }).css);
await writeFile('backend/config/company.json', JSON.stringify({ brandName: companyInfo.brandName }, null, 2) + '\n');
await mkdir('dist', { recursive: true });
await Promise.all(['workspace.css', 'workspace.js'].map(file => copyFile(`backend/public/${file}`, `dist/${file}`)));
