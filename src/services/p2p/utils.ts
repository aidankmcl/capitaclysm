const CONN_PREFIX = 'capitaclysm-game-unique-id-prefix';
export const getConnectionID = (code: string) => `${CONN_PREFIX}-${code}`;

export const generateCode = (len = 4) => {
  const code = [];

  const charZeroCode = 48;
  const charNineCode = 57;
  const numDiff = charNineCode - charZeroCode;

  const charACode = 97;
  const charZCode = 122;
  const alphaDiff = charZCode - charACode;
  for (let i = 0; i < len; i++) {
    const letterCodeIndex = Math.floor(Math.random() * (numDiff + alphaDiff));
    const charCode = (letterCodeIndex < numDiff) ? charZeroCode + letterCodeIndex : charACode + (letterCodeIndex - numDiff);
    code.push(String.fromCharCode(charCode));
  }

  return code.join('').toUpperCase();
};
