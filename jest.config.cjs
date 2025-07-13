module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    // Handle module aliases from tsconfig.json
    "~/components/(.*)$": "<rootDir>/src/components/$1",
    "~/constants$": "<rootDir>/src/constants",
    "~/data$": "<rootDir>/src/data",
    "~/game$": "<rootDir>/src/game",
    "~/hooks$": "<rootDir>/src/hooks",
    "~/pages$": "<rootDir>/src/pages",
    '^~/services/(.*)$': '<rootDir>/src/services/$1',
    "~/store$": "<rootDir>/src/store",
    "~/ui$": "<rootDir>/src/ui",
    "~/utils$": "<rootDir>/src/utils",

    // Asset imports
    '^~/assets/(.*?)(?<!\\.svg(?:\\?react)?)$': '<rootDir>/src/assets/$1',
    '\\.css$': 'identity-obj-proxy',
    '.*\\.svg(\\?react)?$': '<rootDir>/__mocks__/svg.js',
    
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
}; 