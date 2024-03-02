module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  resetMocks: true,
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$',
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/src/test/jest.setup.js'],
};
