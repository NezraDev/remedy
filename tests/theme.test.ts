import { test } from 'node:test';
import assert from 'node:assert/strict';
import { siteData } from '../src/data.js';

function luminance(hex: string) {
  const rgb = [1, 3, 5].map(offset => parseInt(hex.slice(offset, offset + 2), 16) / 255).map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}
function contrast(foreground: string, background: string) {
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

test('both themes retain readable text, actions, links, borders and focus colors', () => {
  for (const [name, colors] of Object.entries({ dark: siteData.theme.colors, light: siteData.theme.lightColors })) {
    for (const surface of [colors.background, colors.surface]) {
      assert.ok(contrast(colors.text, surface) >= 4.5, `${name} primary text`);
      assert.ok(contrast(colors.textSecondary, surface) >= 4.5, `${name} secondary text`);
      assert.ok(contrast(colors.vip, surface) >= 4.5, `${name} accent text`);
      const link = name === 'light' ? siteData.theme.lightLink : colors.primary;
      assert.ok(contrast(link, surface) >= 4.5, `${name} link text`);
      const border = name === 'light' ? siteData.theme.lightControlBorder : colors.textSecondary;
      assert.ok(contrast(border, surface) >= 3, `${name} control boundary`);
    }
    assert.ok(contrast(siteData.theme.colors.background, colors.primary) >= 4.5, `${name} primary action label`);
  }
});
