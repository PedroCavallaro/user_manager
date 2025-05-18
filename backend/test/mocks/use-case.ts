import { InjectionToken } from '@nestjs/common'

export function mockUseCase(useCase: InjectionToken) {
  return {
    provide: useCase,
    useValue: {
      execute: jest.fn()
    }
  }
}
