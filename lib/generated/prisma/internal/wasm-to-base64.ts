import * as fs from 'fs';

function main() {
  const args = process.argv.slice(2);
  
  if (args.length !== 2) {
    console.error('Usage: node wasm-to-base64.js <input.wasm> <output.ts>');
    process.exit(1);
  }
  
  const [inputPath, outputPath] = args;
  
  if (!fs.existsSync(inputPath)) {
    console.error(`Error: Input file ${inputPath} does not exist`);
    process.exit(1);
  }
  
  try {
    const wasmBuffer = fs.readFileSync(inputPath);
    const base64 = wasmBuffer.toString('base64');
    
    const tsContent = `export const wasm = "data:application/wasm;base64,${base64}";\n`;
    
    fs.writeFileSync(outputPath, tsContent);
    console.log(`Successfully converted ${inputPath} to ${outputPath}`);
  } catch (error) {
    console.error(`Error processing file: ${error}`);
    process.exit(1);
  }
}

export function decodeWasm(base64Data: string): Uint8Array {
  const base64 = base64Data.replace('data:application/wasm;base64,', '');
  return new Uint8Array(Buffer.from(base64, 'base64'));
}

export async function readAsWasm(wasmBase64: string): Promise<WebAssembly.Module> {
  const wasmArray = decodeWasm(wasmBase64);
  return new WebAssembly.Module(wasmArray);
}

export async function instantiateWasm(wasmBase64: string, imports?: WebAssembly.Imports): Promise<WebAssembly.WebAssemblyInstantiatedSource> {
  const wasmArray = decodeWasm(wasmBase64);
  return WebAssembly.instantiate(wasmArray, imports);
}

if (require.main === module) {
  main();
}
