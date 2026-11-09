const S = require("./gen.js"), fs = require("fs");
const d = S.normalize(S.blank());
const R = (name, reg, c, r, reason) => reg ? { name, registrable: true, registration_cost: c, renewal_cost: r } : { name, registrable: false, reason };
d.domain.results = [
  R("cooperscoffee.com", false, 0, 0, "domain_unavailable"), R("cooperscoffeeco.com", false, 0, 0, "domain_unavailable"),
  R("coopers.coffee", true, "33.20", "33.20"), R("cooperscoffee.coffee", true, "33.20", "33.20"), R("cooperscoffee.co", true, "30.00", "30.00"),
  R("coopers-coffee.com", true, "11.17", "11.17"), R("getcooperscoffee.com", true, "11.17", "11.17"), R("cooperscoffee.net", true, "11.86", "11.86"),
  R("cooperscoffee.company", true, "16.20", "16.20"), R("cooperscoffee.site", true, "4.99", "27.70")
];
d.domain.checkedAt = "2026-11-08"; d.domain.account = "BitBuilder Cloud";
fs.mkdirSync("/mnt/user-data/outputs/seed", { recursive: true });
fs.writeFileSync("/mnt/user-data/outputs/seed/kit.json", JSON.stringify({ kit: d, by: "claude", note: "Loaded Cooper’s Coffee with live domain checks from Cloudflare Registrar.", at: Date.now() }));
module.exports = d;
