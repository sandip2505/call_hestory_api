import fs from 'fs';
const filePath = 'D:/Personal App/CallHistoryApp/src/services/ApiService.ts';
let content = fs.readFileSync(filePath, 'utf8');

const newFunc = `export const getDeviceId = async (): Promise<string> => {
  const constants = Platform.constants as any;
  const brand = constants.Brand || constants.Manufacturer || 'Unknown';
  const model = constants.Model || 'Android Phone';
  return \`device_\${brand}_\${model}\`.replace(/\\s+/g, '_').toLowerCase();
};`;

content = content.replace(/export const getDeviceId = async \(\): Promise<string> => \{[\s\S]*?\n\};/, newFunc);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed ApiService.ts');
