module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    // Handle module aliases from tsconfig.json
    '^~/assets/(.*)$': '<rootDir>/src/assets/$1',
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