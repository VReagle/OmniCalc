import { all, create } from 'mathjs';

const config = {
  number: 'BigNumber' as const,
  precision: 64,
};

const math = create(all, config);

export const evaluateExpression = (expression: string) => {
  try {
    const result = math.evaluate(expression);
    return math.format(result, { precision: 14, notation: 'auto' });
  } catch (error) {
    console.error('Math evaluation error:', error);
    return 'Error';
  }
};

export const getPoint = (f: string, x: number) => {
  try {
    const scope = { x };
    const result = math.evaluate(f, scope);
    return typeof result === 'number' ? result : NaN;
  } catch {
    return NaN;
  }
};

export default math;
