import fs from 'node:fs';
import path from 'node:path';

const publicDir = process.argv[2];
const cases = [
  { file: 'index.html', breadcrumb: false, types: ['WebSite', 'LocalBusiness', 'Person', 'WebPage'] },
  { file: 'about/index.html', breadcrumb: true, types: ['WebSite', 'LocalBusiness', 'Restaurant', 'Person', 'WebPage', 'BreadcrumbList'] },
];

for (const testCase of cases) {
  const html = fs.readFileSync(path.join(publicDir, testCase.file), 'utf8');
  const scripts = [...html.matchAll(/<script\s+type=(?:"application\/ld\+json"|application\/ld\+json)>([\s\S]*?)<\/script>/g)];
  if (scripts.length !== 1) throw new Error(`${testCase.file}: expected one JSON-LD script, got ${scripts.length}`);

  const schema = JSON.parse(scripts[0][1]);
  const graph = schema['@graph'];
  const types = graph.map((entity) => entity['@type']);
  const ids = graph.map((entity) => entity['@id']).filter(Boolean);
  if (schema['@context'] !== 'https://schema.org') throw new Error(`${testCase.file}: invalid context`);
  if (JSON.stringify(types) !== JSON.stringify(testCase.types)) throw new Error(`${testCase.file}: unexpected types ${types}`);
  if (new Set(ids).size !== ids.length) throw new Error(`${testCase.file}: duplicate entity IDs`);
  if (graph.filter((entity) => entity['@type'] === 'WebPage').length !== 1) throw new Error(`${testCase.file}: expected one WebPage`);
  if (types.includes('BreadcrumbList') !== testCase.breadcrumb) throw new Error(`${testCase.file}: invalid breadcrumb presence`);

  const business = graph.find((entity) => entity['@type'] === 'LocalBusiness');
  if (business.telephone.length !== 2) throw new Error(`${testCase.file}: phone compatibility failed`);
  if (business.openingHoursSpecification.length !== 2) throw new Error(`${testCase.file}: weekend hours missing`);
  if (business.priceRange !== '65 €') throw new Error(`${testCase.file}: optional priceRange missing`);

  const webpage = graph.find((entity) => entity['@type'] === 'WebPage');
  if (!webpage.datePublished.startsWith('2024-')) throw new Error(`${testCase.file}: content publication date not used`);
}

console.log('Schema.org graph tests passed');
