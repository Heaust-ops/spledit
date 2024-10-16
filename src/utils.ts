export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: number | null = null;

  return (...args: Parameters<T>): void => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

export function cloneArrayBuffer(buffer: ArrayBuffer): ArrayBuffer {
  const clonedBuffer = new ArrayBuffer(buffer.byteLength);
  new Uint8Array(clonedBuffer).set(new Uint8Array(buffer));
  return clonedBuffer;
}

export function uIntArrayVertexCount(uArr: Uint8Array) {
  const rowLength = 3 * 4 + 3 * 4 + 4 + 4;
  return uArr.length / rowLength;
}
