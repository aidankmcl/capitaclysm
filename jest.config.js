module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    // Handle module aliases from tsconfig.json
    '^~/ui$': '<rootDir>/src/ui',
    '^~/game$': '<rootDir>/src/game',
    '^~/pages$': '<rootDir>/src/pages',
    '^~/store$': '<rootDir>/src/game/store',
    '^~/constants$': '<rootDir>/src/constants',
    '^~/utils$': '<rootDir>/src/utils',
    '^~/hooks$': '<rootDir>/src/hooks',
    '^~/data/map$': '<rootDir>/src/game/components/map/data',
    '^~/assets/(.*)$': '<rootDir>/src/assets/$1',
    '^~/services/(.*)$': '<rootDir>/src/services/$1',

    // Mock CSS imports
    '\\.css$': 'identity-obj-proxy',
    '\\.svg$': '<rootDir>/__mocks__/svg.js',
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
}; 