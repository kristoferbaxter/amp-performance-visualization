import { promises as fsPromises } from 'fs';
import * as path from 'path';

export interface Package {
  version: string;
}

let CACHED: Package | null = null;

/**
 * Derive Package.json metadata.
 */
export async function getMetadata(): Promise<Package> {
  if (CACHED === null) {
    const contents: string = await fsPromises.readFile(path.resolve(__dirname, '..', '..', 'package.json'), 'utf8');
    CACHED = JSON.parse(contents) as Package;
  }

  return CACHED;
}

//Visible for testing
export function getCached(){
  return CACHED;
}