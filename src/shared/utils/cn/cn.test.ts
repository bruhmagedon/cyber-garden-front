import { describe, expect, it } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
  it('объединяет классы в строку', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('обрабатывает условные классы', () => {
    expect(cn('class1', false && 'class2', 'class3')).toBe('class1 class3');
  });

  it('объединяет Tailwind классы без конфликтов', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  it('работает с пустыми значениями', () => {
    expect(cn('', null, undefined, 'class1')).toBe('class1');
  });
});
