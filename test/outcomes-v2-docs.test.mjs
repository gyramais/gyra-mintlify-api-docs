import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const pagePath = 'api-reference/report-v2/post-v2-outcomes-bulk.mdx';
const page = readFileSync(pagePath, 'utf8');
const docs = JSON.parse(readFileSync('docs.json', 'utf8'));
const reportCreate = readFileSync('api-reference/report-v2/post-v2report.mdx', 'utf8');
const changelog = readFileSync('reference/changelog.mdx', 'utf8');

const pages = docs.navigation.groups.flatMap((group) => group.pages ?? []);

test('outcomes page is in the API navigation once', () => {
  const hits = pages.filter((entry) => entry === 'api-reference/report-v2/post-v2-outcomes-bulk');
  assert.equal(hits.length, 1);
});

test('page describes the bulk contract, the ambiguous case, and correction', () => {
  assert.match(page, /POST \/v2\/outcomes\/bulk/);
  assert.match(page, /AMBIGUOUS/);
  assert.match(page, /candidatos/);
  assert.match(page, /não grava/i);
  assert.match(page, /não escolhe um candidato/i);
  assert.match(page, /MATCHED/);
  assert.match(page, /NO_DECISION/);
  assert.match(page, /INVALID/);
  assert.match(page, /ON_TIME/);
  assert.match(page, /LATE/);
  assert.match(page, /NOT_OPERATED/);
  assert.match(page, /evento novo|uma linha nova/i);
  assert.match(page, /não existe rota para editar um evento/i);
  assert.match(page, /não existe operação para marcar todas/i);
});

test('report create documents externalId as the stable anchor', () => {
  assert.match(reportCreate, /`externalId`/);
  assert.match(reportCreate, /post-v2-outcomes-bulk/);
});

test('changelog points at the outcomes route', () => {
  assert.match(changelog, /POST \/v2\/outcomes\/bulk/);
});

test('customer text has no dash punctuation, secret, or data-provider name', () => {
  const files = [page, reportCreate, changelog];
  for (const file of files) {
    assert.equal(file.includes('\u2014'), false);
    assert.equal(file.includes('\u2013'), false);
    assert.equal(/eyJ[A-Za-z0-9_-]{8,}/.test(file), false);
    assert.equal(/mongodb(\+srv)?:\/\//i.test(file), false);
    assert.equal(/postgres(ql)?:\/\//i.test(file), false);
    assert.equal(/\b(BDC|Lemit|Predictus|Eposi|SCloud|Asaas|Iugu)\b/i.test(file), false);
    assert.equal(file.includes('console.log'), false);
  }
});
