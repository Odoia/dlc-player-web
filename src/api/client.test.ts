import { describe, it, expect } from 'vitest'
import { steamLoginUrl } from './client'
import { env } from '../config/env'

describe('steamLoginUrl', () => {
  it('aponta pro request-phase do OmniAuth-Steam na API (fora do /api/v1)', () => {
    expect(steamLoginUrl()).toBe(`${env.apiUrl}/auth/steam`)
    expect(steamLoginUrl()).not.toContain('/api/v1')
  })
})
