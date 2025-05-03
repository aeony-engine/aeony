import { Color } from '../../../src/graphics/color';

describe('graphics/Color:', () => {
  it('should create a new color with default alpha.', () => {
    const color = new Color(0.5, 0.5, 0.5);

    assert.equal(0.5, color.red);
    assert.equal(0.5, color.green);
    assert.equal(0.5, color.blue);
    assert.equal(1, color.alpha);
  });

  it('should create a new color with specified alpha.', () => {
    const color = new Color(0.1, 0.2, 0.3, 0.4);
    assert.equal(0.1, color.red);
    assert.equal(0.2, color.green);
    assert.equal(0.3, color.blue);
    assert.equal(0.4, color.alpha);
  });

  it('should set new color values.', () => {
    const color = new Color(0, 0, 0);
    color.set(0.2, 0.4, 0.6, 0.8);

    assert.equal(0.2, color.red);
    assert.equal(0.4, color.green);
    assert.equal(0.6, color.blue);
    assert.equal(0.8, color.alpha);
  });

  it('should clone a color into a new instance.', () => {
    const color = new Color(0.1, 0.2, 0.3, 0.4);
    const clonedColor = color.clone();

    assert.not_equal(color, clonedColor);
    assert.equal(0.1, clonedColor.red);
    assert.equal(0.2, clonedColor.green);
    assert.equal(0.3, clonedColor.blue);
    assert.equal(0.4, clonedColor.alpha);
  });

  it('should clone a color into an existing instance.', () => {
    const color = new Color(0.1, 0.2, 0.3, 0.4);
    const outColor = new Color(0, 0, 0, 0);
    const clonedColor = color.clone(outColor);

    assert.equal(outColor, clonedColor); // Ensure it's the same instance
    assert.equal(0.1, clonedColor.red);
    assert.equal(0.2, clonedColor.green);
    assert.equal(0.3, clonedColor.blue);
    assert.equal(0.4, clonedColor.alpha);
  });

  it('should copy values from another color.', () => {
    const sourceColor = new Color(0.5, 0.6, 0.7, 0.8);
    const targetColor = new Color(0, 0, 0, 0);
    targetColor.copyFrom(sourceColor);

    assert.equal(0.5, targetColor.red);
    assert.equal(0.6, targetColor.green);
    assert.equal(0.7, targetColor.blue);
    assert.equal(0.8, targetColor.alpha);
  });

  it('should interpolate between two colors.', () => {
    const color1 = new Color(0, 0, 0, 0);
    const color2 = new Color(1, 1, 1, 1);
    const interpolatedColor = Color.interpolate(color1, color2, 0.5);

    assert.equal(0.5, interpolatedColor.red);
    assert.equal(0.5, interpolatedColor.green);
    assert.equal(0.5, interpolatedColor.blue);
    assert.equal(0.5, interpolatedColor.alpha);
  });

  it('should interpolate into an existing color.', () => {
    const color1 = new Color(0, 0, 0, 0);
    const color2 = new Color(1, 1, 1, 1);
    const outColor = new Color(0, 0, 0, 0);
    const interpolatedColor = Color.interpolate(color1, color2, 0.25, outColor);

    assert.equal(outColor, interpolatedColor); // Ensure it's the same instance
    assert.equal(0.25, interpolatedColor.red);
    assert.equal(0.25, interpolatedColor.green);
    assert.equal(0.25, interpolatedColor.blue);
    assert.equal(0.25, interpolatedColor.alpha);
  });

  it('should create a color from byte values.', () => {
    const color = Color.fromBytes(128, 64, 32, 255);

    assert.near(128 / 255, color.red, 0.0001);
    assert.near(64 / 255, color.green, 0.0001);
    assert.near(32 / 255, color.blue, 0.0001);
    assert.near(1.0, color.alpha, 0.0001);
  });

  it('should return color parts as a tuple.', () => {
    const color = new Color(0.1, 0.2, 0.3, 0.4);
    const [red, green, blue, alpha] = color.parts();

    assert.equal(0.1, red);
    assert.equal(0.2, green);
    assert.equal(0.3, blue);
    assert.equal(0.4, alpha);
  });
});
