import * as fs from 'fs';

function main() {
  const args = process.argv.slice(2);
  
  if (args.length !== 2) {
    console.error('Usage: node wasm-to-uint8array.js <input.wasm> <output.ts>');
    process.exit(1);
  }
  
  const [inputPath, outputPath] = args;
  
  if (!fs.existsSync(inputPath)) {
    console.error(`Error: Input file ${inputPath} does not exist`);
    process.exit(1);
  }
  
  try {
    const wasmBuffer = fs.readFileSync(inputPath);
    const uint8Array = new Uint8Array(wasmBuffer);
    
    const arrayData = Array.from(uint8Array).join(', ');
    const tsContent = `export const wasm = new Uint8Array([${arrayData}]);\n`;
    
    fs.writeFileSync(outputPath, tsContent);
    console.log(`Successfully converted ${inputPath} to ${outputPath}`);
  } catch (error) {
    console.error(`Error processing file: ${error}`);
    process.exit(1);
  }
}

export async function readAsWasm(wasmArray: Uint8Array): Promise<WebAssembly.Module> {
  return new WebAssembly.Module(wasmArray);
}

export async function instantiateWasm(wasmArray: Uint8Array, imports?: WebAssembly.Imports): Promise<WebAssembly.WebAssemblyInstantiatedSource> {
  return WebAssembly.instantiate(wasmArray, imports);
}

if (require.main === module) {
  main();
}
