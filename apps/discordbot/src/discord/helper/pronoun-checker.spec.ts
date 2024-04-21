import { PronounChecker } from './pronoun-checker';

describe('PronounChecker', () => {
  it('should be defined', () => {
    expect(new PronounChecker()).toBeDefined();
  });

  it('Merijn - hij/hem', () => {
    expect(PronounChecker.checkString('Merijn - hij/hem')).toBe(true);
  });

  it('Merijn - hji/hem', () => {
    expect(PronounChecker.checkString('Merijn - hji/hem')).toBe(false);
  });

  it('Merijn - die/diezens', () => {
    expect(PronounChecker.checkString('Merijn - die/diezens')).toBe(false);
  });

  it('Merijn', () => {
    expect(PronounChecker.checkString('Merijn')).toBe(false);
  });

  it('Merijn - E', () => {
    expect(PronounChecker.checkString('Merijn - E')).toBe(false);
  });

  it('E', () => {
    expect(PronounChecker.checkString('E')).toBe(false);
  });

  it('', () => {
    expect(PronounChecker.checkString('')).toBe(false);
  });
});
