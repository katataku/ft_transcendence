import * as fs from 'fs';
import { promisify } from 'util';

export async function readDefaultAvatar(): Promise<string> {
    const readFile = promisify(fs.readFile);
    const buffer = await readFile(`${process.cwd()}/image/defaultAvatar.png`);
    const base64 = buffer.toString('base64');
    return base64;
  }