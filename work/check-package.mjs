import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';

const root=new URL('../',import.meta.url);
const manifest=JSON.parse(readFileSync(new URL('FILE_MANIFEST.json',root),'utf8'));
for(const file of manifest.files){
 const bytes=readFileSync(new URL(file.path,root));
 assert.equal(bytes.length,file.bytes,'Size mismatch: '+file.path);
 assert.equal(createHash('sha256').update(bytes).digest('hex'),file.sha256,'Checksum mismatch: '+file.path);
}
console.log(`Verified ${manifest.files.length} packaged files. All sizes and SHA-256 checksums match.`);
