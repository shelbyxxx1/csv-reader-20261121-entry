export function run(input) {
  const text = String(input.text);
  const header = input.header === true;
  const length = text.length;
  const rows = [];
  const errors = [];
  let columns = null;
  let width = -1;
  let pos = text.charCodeAt(0) === 0xfeff ? 1 : 0;
  let line = 1;
  let comma = -1;
  let newline = -1;
  let carriage = -1;

  while (pos < length) {
    if (text.charCodeAt(pos) === 10) {
      pos++;
      line++;
      continue;
    }
    if (text.charCodeAt(pos) === 13 && text.charCodeAt(pos + 1) === 10) {
      pos += 2;
      line++;
      continue;
    }
    const recordLine = line;
    const recordRow = header && columns === null ? null : rows.length;
    const fields = [];
    let quoted = false;
    let more = true;
    while (more) {
      quoted = text.charCodeAt(pos) === 34;
      let value = '';
      let junk = false;
      if (quoted) {
        const open = pos;
        let end = text.indexOf('"', open + 1);
        let doubled = false;
        while (end !== -1 && text.charCodeAt(end + 1) === 34) {
          doubled = true;
          end = text.indexOf('"', end + 2);
        }
        if (end === -1) {
          errors.push({ code: 'unterminated_quote', line: recordLine, row: recordRow });
        } else {
          value = text.slice(open + 1, end);
          if (doubled) value = value.replaceAll('""', '"');
          if (newline < open + 1) {
            newline = text.indexOf('\n', open + 1);
            if (newline === -1) newline = length;
          }
          while (newline < end) {
            line++;
            newline = text.indexOf('\n', newline + 1);
            if (newline === -1) newline = length;
          }
          if (carriage < open + 1) {
            carriage = text.indexOf('\r', open + 1);
            if (carriage === -1) carriage = length;
          }
          if (carriage < end) {
            do {
              if (text.charCodeAt(carriage + 1) !== 10) line++;
              carriage = text.indexOf('\r', carriage + 1);
              if (carriage === -1) carriage = length;
            } while (carriage < end);
            value = value.replaceAll('\r\n', '\n').replaceAll('\r', '\n');
          }
          pos = end + 1;
          junk = true;
        }
      }
      let start = pos;
      let added = 0;
      while (true) {
        if (comma < pos) {
          comma = text.indexOf(',', pos);
          if (comma === -1) comma = length;
        }
        if (newline < pos) {
          newline = text.indexOf('\n', pos);
          if (newline === -1) newline = length;
        }
        if (carriage < pos) {
          carriage = text.indexOf('\r', pos);
          if (carriage === -1) carriage = length;
        }
        const end = Math.min(comma, newline, carriage);
        added += end - start;
        if (end === carriage && end < length && text.charCodeAt(end + 1) !== 10) {
          value += text.slice(start, end);
          errors.push({ code: 'stray_cr', line: recordLine, row: recordRow });
          pos = end + 1;
          start = pos;
          continue;
        }
        value += text.slice(start, end);
        more = end === comma && end < length;
        if (end === length) pos = length;
        else if (more) pos = end + 1;
        else {
          pos = end + (end === carriage ? 2 : 1);
          line++;
        }
        break;
      }
      if (junk && added > 0) errors.push({ code: 'quote_junk', line: recordLine, row: recordRow });
      fields.push(value);
    }
    if (fields.length === 1 && fields[0] === '' && !quoted) continue;
    if (width < 0) width = fields.length;
    if (header && columns === null) {
      columns = fields;
      continue;
    }
    if (fields.length < width) {
      errors.push({ code: 'short_row', line: recordLine, row: recordRow, fields: fields.length });
      while (fields.length < width) fields.push('');
    } else if (fields.length > width) {
      errors.push({ code: 'long_row', line: recordLine, row: recordRow, extra: fields.splice(width) });
    }
    rows.push(fields);
  }
  return { columns: header ? (columns ?? []) : null, rows, errors };
}
