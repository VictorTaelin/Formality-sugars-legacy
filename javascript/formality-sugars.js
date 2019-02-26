const F = require("formality-lang");

// Converts a JavaScript bitstring to a Formality Chr
function bitstring_to_term(bits) {
  var term = F.Ref("Chr.E");
  for (var i = 0; i < bits.length; ++i) {
    var term = F.App(F.Ref(bits[i] === "0" ? "Chr.O" : "Chr.I"), term);
  }
  return term;
}

// Converts a JavaScript string to a Formality Str
function string_to_term(string) {
  var term = F.Ref("Str.nil");
  for (var i = string.length - 1; i >= 0; --i) {
    var bits = bitstring_to_term(string.charCodeAt(i).toString(2));
    var term = F.App(F.App(F.Ref("Str.cons"), bits), term);
  }
  return term;
}

// Converts a Formality Chr to a JavaScript bitstring
function term_to_bitstring(term, bits = "") {
  var body = term[1].body[1].body[1].body;
  if (body[0] === "App") {
    var bit = body[1].func[1].index === 2 ? "0" : "1";
    return term_to_bitstring(body[1].argm, bit + bits);
  } else {
    return bits;
  }
}

// Converts a Formality Str to a JavaScript string
function term_to_string(term) {
  var body = term[1].body[1].body;
  if (body[0] === "App") {
    var bits = term_to_bitstring(body[1].func[1].argm);
    var tail = body[1].argm;
    var chrr = String.fromCharCode(parseInt(bits, 2));
    return chrr + term_to_string(tail);
  } else {
    return "";
  }
}

// Expands string literals in a Formality source code
function desugar(code) {
  var new_code = "";
  var last_str = null;
  for (var i = 0; i < code.length; ++i) {
    if (code[i] === "\"") {
      if (last_str !== null) {
        new_code += F.show(string_to_term(last_str));
        last_str = null;
      } else {
        last_str = "";
      }
    } else {
      if (last_str !== null) {
        last_str += code[i];
      } else {
        new_code += code[i];
      }
    }
  }
  return new_code;
}

module.exports = {
  bitstring_to_term,
  string_to_term,
  term_to_bitstring,
  term_to_string,
  desugar
};
