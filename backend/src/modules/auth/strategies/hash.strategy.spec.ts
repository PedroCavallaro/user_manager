import { HashStrategy } from 'src/modules/auth/strategies'

describe('HashStrategy', () => {
  let hashStrategy: HashStrategy

  beforeAll(() => {
    hashStrategy = new HashStrategy()
  })

  it('Should hash a password ', async () => {
    const password = 'password'
    const hashed = await hashStrategy.hash(password)

    expect(typeof hashed).toBe('string')
    expect(hashed).not.toBe(password)
    expect(hashed.length).toBeGreaterThan(0)
  })

  it('Should return true for matching password and hash', async () => {
    const password = 'password'
    const hashed = await hashStrategy.hash(password)

    const result = await hashStrategy.verify(password, hashed)

    expect(result).toBe(true)
  })

  it('Should return false for non-matching password and hash', async () => {
    const password = 'password1'
    const wrongPassword = 'password2'
    const hashed = await hashStrategy.hash(password)

    const result = await hashStrategy.verify(wrongPassword, hashed)

    expect(result).toBe(false)
  })
})
