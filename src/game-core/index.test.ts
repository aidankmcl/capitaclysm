import { describe, expect, it } from "vitest"

import { gameCoreBoundary } from "./index"

describe("game-core boundary", () => {
	it("is available as a pure logic module", () => {
		expect(gameCoreBoundary).toEqual({
			name: "game-core",
			pure: true,
		})
	})
})

