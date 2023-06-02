/* istanbul ignore file */

export function countByteLength(str: string) {
  let r = 0;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    // Shift_JIS: 0x0 ～ 0x80, 0xa0 , 0xa1 ～ 0xdf , 0xfd ～ 0xff
    // Unicode : 0x0 ～ 0x80, 0xf8f0, 0xff61 ～ 0xff9f, 0xf8f1 ～ 0xf8f3
    if (
      (c >= 0x0 && c < 0x81) ||
      c == 0xf8f0 ||
      (c >= 0xff61 && c < 0xffa0) ||
      (c >= 0xf8f1 && c < 0xf8f4)
    ) {
      r += 1;
    } else {
      r += 2;
    }
  }
  return r;
}
