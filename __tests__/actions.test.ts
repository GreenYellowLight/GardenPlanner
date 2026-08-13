/**
 * @jest-environment node
 */

// `postgres` and `@fal-ai/client` are mocked so these tests never touch the real
// database or the (paid) fal.ai image API. Nothing is inserted, so nothing needs
// undoing — the in-memory `generationCount` below stands in for `generation_log`.

// jest.mock('postgres', () => {
//   const sql = jest.fn()
//   return { __esModule: true, default: () => sql }
// })

// jest.mock('@fal-ai/client', () => ({
//   fal: { subscribe: jest.fn() },
// }))

import { fal } from '@fal-ai/client'
import {
  validateCount,
  verifyCaptcha,
  validatePlantNames,
} from '@/app/lib/actions'
import { GET as seedDatabase } from '@/app/garden-planner/seed/route'
import { sql } from '@/app/lib/db'


beforeAll(async () => {
  // next/jest doesn't load .env.local for test runs, so NEXT_PUBLIC_DEVELOPER_MODE
  // (which /seed requires) isn't set from there — set it directly here instead.
  process.env.NEXT_PUBLIC_DEVELOPER_MODE = 'true'

  const res = await seedDatabase()
  if (!res.ok) throw new Error(`Seeding failed: ${res.status} ${await res.text()}`)
})

// actions.ts and this file share this one connection (app/lib/db.ts) — close it
// once everything's done, or the open Postgres socket keeps the process alive.
afterAll(async () => {
  await sql.end()
})

describe('validatePlantNames', () => {

  it('isInvalid', async () => {
    const fakePlants = ['Dog Rose', 'Fake Plant Name', 'Waratah']
    await expect(validatePlantNames(fakePlants)).resolves.toBe(false)
  })

  it('isValid', async () => {
    const fakePlants = ['Dog Rose', 'Waratah']
    await expect(validatePlantNames(fakePlants)).resolves.toBe(true)
  })
})

/*
there should be  a max of 3 generations per hour, log entries are used to limit that 
*/

describe('validateCount', () => {
  afterEach(async () => {
    await sql`DELETE FROM generation_log`
  })

  async function logGeneration(createdAt?: Date) {
    if (createdAt) {
      await sql`INSERT INTO generation_log (created_at) VALUES (${createdAt})`
    } else {
      await sql`INSERT INTO generation_log DEFAULT VALUES`
    }
  }

  it('onePrev', async () => {
    await logGeneration()
    await expect(validateCount()).resolves.toBe(true)
  })

  it('twoPrev', async () => {
    await logGeneration()
    await logGeneration()
    await expect(validateCount()).resolves.toBe(true)
  })

  it('threePrev', async () => {
    await logGeneration()
    await logGeneration()
    await logGeneration()
    await expect(validateCount()).resolves.toBe(false)
  })

  it('threePrevOld', async () => {
    // Outside the 60-minute rate-limit window, so shouldn't count against the limit.
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000)
    await logGeneration(twoHoursAgo)
    await logGeneration(twoHoursAgo)
    await logGeneration(twoHoursAgo)
    await expect(validateCount()).resolves.toBe(true)
  })
})

