export async function detectEncoding(file) {
  const sample = await file.slice(0, 2000).text();
  
  // UTF-8 quebrado (Ã, Â, §, etc.)
  if (/[ÃÂ§Ã£Ã©Ã§Ãº]/g.test(sample)) {
    return 'latin1';
  }
  
  // ISO-8859-1
  if (/[\x80-\xFF]/.test(sample)) {
    return 'iso-8859-1';
  }
  
  return 'utf-8';
}

export async function readFileWithEncoding(file, encoding = 'utf-8') {
  const buffer = await file.arrayBuffer();
  
  if (encoding === 'utf-8') {
    return new TextDecoder('utf-8').decode(buffer);
  }
  
  if (encoding === 'latin1' || encoding === 'iso-8859-1') {
    const uint8 = new Uint8Array(buffer);
    let text = '';
    for (let i = 0; i < uint8.length; i++) {
      text += String.fromCharCode(uint8[i]);
    }
    return text;
  }
  
  return new TextDecoder('utf-8').decode(buffer);
}