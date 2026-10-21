import { test } from 'node:test';
import assert from 'node:assert/strict';
import { siteData } from '../src/data.js';
import { additionalQuestions, answerQuestion } from '../src/utils/chatbot';
import { formatDuration, formatPrice, isVisible } from '../src/utils/catalog';

test('answers every published FAQ and internal common question exactly', () => {
  for (const item of [...siteData.faqs, ...additionalQuestions]) {
    const reply = answerQuestion(item.question);
    assert.equal(reply.text, item.answer, item.question);
    if (/contact remedy|call|confirm|ask remedy/i.test(item.answer)) {
      assert.ok(reply.actions?.some(action => action.label === 'Contact Remedy' && action.href === siteData.business.phoneHref), item.question);
    }
  }
});

test('looks up every visible service with its published price and duration', () => {
  for (const service of siteData.services.filter(service => isVisible(service))) {
    const reply = answerQuestion(`Tell me about ${service.displayName}`);
    assert.ok(reply.text.includes(service.displayName), service.displayName);
    assert.ok(reply.text.includes(formatPrice(service)), service.displayName);
    assert.ok(reply.text.includes(formatDuration(service.listedDurationMinutes)), service.displayName);
    assert.ok(reply.actions?.some(action => action.href === siteData.business.phoneHref));
  }
});

test('recognizes shortened service names and preserves ambiguous catalog variants', () => {
  for (const name of ['remface', 'microdax', 'emsella', 'flexsculpt', 'plasma pen', 'vshape', 'infrared sauna']) {
    assert.notEqual(answerQuestion(`Tell me about ${name}`).text, siteData.chatbot.unknownAnswer, name);
  }
  const plasma = answerQuestion('How much is plasma pen?').text;
  assert.ok(plasma.includes('30 Minutes') && plasma.includes('45 Minutes'));
  assert.ok(plasma.includes('Price varies') && plasma.includes('$100'));
  assert.match(answerQuestion('How much is emsella?').text, /\$925/);
  assert.match(answerQuestion('What is 911?').text, /911 cavilipo[\s\S]*911 Session/);
});

test('prioritizes suitability and policies over a mentioned service and handles follow-ups', () => {
  assert.match(answerQuestion('Can I get Jade Laser while pregnant?').text, /cannot assess medical eligibility/);
  assert.match(answerQuestion('Does remface hurt?').text, /comfort, recovery time/);
  assert.match(answerQuestion('Can I cancel my consultation?').text, /change or cancel/);
  assert.match(answerQuestion('How much?', 'Tell me about Jade Laser Single Session').text, /\$150/);
  assert.match(answerQuestion('Do you accept insurance for pelvic floor treatments?').text, /confirm accepted payment methods/);
});

test('every unsupported question has a contact action and does not invent details', () => {
  for (const question of ['Can you arrange a helicopter?', 'What is your rollercoaster?', 'How much does a rollercoaster cost?']) {
    const reply = answerQuestion(question);
    assert.ok(!reply.text.includes('Roller —'));
    assert.ok(reply.actions?.some(action => action.href === siteData.business.phoneHref));
  }
  assert.equal(answerQuestion('Can you arrange a helicopter?').text, siteData.chatbot.unknownAnswer);
  assert.match(answerQuestion('Do you provide childcare?').text, /Childcare availability has not been provided/);
  assert.match(answerQuestion('Do you take cash?').text, /confirm accepted payment methods/);
  assert.match(answerQuestion('Can I get a gift card?').text, /contact Remedy/);
});
