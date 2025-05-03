import { MathUtils } from '../../../src/math/mathUtils';
import { Point } from '../../../src/math/point';

describe('MathUtils', () => {
  it('should correctly lerp between two values', () => {
    assert.is_true(MathUtils.lerp(0, 10, 0.5) === 5);
    assert.is_true(MathUtils.lerp(10, 20, 0.25) === 12.5);
  });

  it('should clamp a value between a minimum and maximum', () => {
    assert.is_true(MathUtils.clamp(5, 0, 10) === 5);
    assert.is_true(MathUtils.clamp(-5, 0, 10) === 0);
    assert.is_true(MathUtils.clamp(15, 0, 10) === 10);
  });

  it('should calculate the distance between two points', () => {
    assert.is_true(MathUtils.distance(0, 0, 3, 4) === 5);
    assert.is_true(MathUtils.distance(1, 1, 4, 5) === 5);
  });

  it('should compare two numbers that are almost equal', () => {
    assert.is_true(MathUtils.fuzzyEqual(0.1 + 0.2, 0.3, 0.0001));
    assert.is_false(MathUtils.fuzzyEqual(0.1 + 0.2, 0.31, 0.0001));
  });

  it('should check if two lines intersect', () => {
    const out = Point.get(0, 0);
    const result = MathUtils.linesIntersect(0, 0, 10, 10, 0, 10, 10, 0, out);
    assert.is_true(result);
    assert.is_true(out.x === 5 && out.y === 5);

    const noIntersection = MathUtils.linesIntersect(0, 0, 10, 10, 20, 20, 30, 30);
    assert.is_false(noIntersection);
  });

  it('should rotate a point around another point', () => {
    let [rotatedX, rotatedY] = MathUtils.rotateAround(0, 100, 100, 100, 90);
    assert.is_true(MathUtils.fuzzyEqual(rotatedX, 100, 0.0001));
    assert.is_true(MathUtils.fuzzyEqual(rotatedY, 0, 0.0001));

    [rotatedX, rotatedY] = MathUtils.rotateAround(0, 100, 100, 100, 270);
    assert.is_true(MathUtils.fuzzyEqual(rotatedX, 100, 0.0001));
    assert.is_true(MathUtils.fuzzyEqual(rotatedY, 200, 0.0001));
  });
});
