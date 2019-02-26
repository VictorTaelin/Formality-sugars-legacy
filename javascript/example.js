const F = require("formality-lang");
const S = require(".");

console.log(F.show(F.parse(S.desugar(`main = (IO.print "Hello, world!" IO.stop)`)).main.term));
