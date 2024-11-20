import { TestBed } from '@automock/jest'
import { faker } from '@faker-js/faker/.'
import { HttpStatus } from '@nestjs/common'
import { User } from 'src/application/entities/user'
import { UserProfile } from 'src/application/entities/user-profile'
import { UserRepository } from 'src/application/repositories/user.repository'
import { SupabaseService } from 'src/shared/services/supabase.service'
import { USER_REPOSITORY } from 'src/shared/tokens'
import { SignupRequest, SignupUseCase } from './signup'

jest.mock('@nestjs/common/services/logger.service')

describe('Signin use case', () => {
	let useCase: SignupUseCase
	let supabase: jest.Mocked<SupabaseService>
	let userRepository: jest.Mocked<UserRepository>

	beforeEach(() => {
		const { unit, unitRef } = TestBed.create(SignupUseCase).compile()

		useCase = unit
		supabase = unitRef.get<SupabaseService>(SupabaseService)
		userRepository = unitRef.get<UserRepository>(USER_REPOSITORY)
	})

	it('should be defined', () => {
		expect(useCase).toBeDefined()
	})

	it('should signup user', async () => {
		const dto: SignupRequest = {
			email: faker.internet.email(),
			password: faker.internet.password(),
			name: faker.person.firstName(),
			surname: faker.person.lastName(),
			birthDate: faker.date.past().toISOString(),
		}

		userRepository.findByEmail.mockResolvedValue(null)

		userRepository.saveProfile.mockResolvedValue(
			UserProfile.create({
				name: dto.name,
				surname: dto.surname,
				userId: faker.string.uuid(),
				birthDate: new Date(dto.birthDate),
			}),
		)

		supabase.auth.signUp = jest.fn().mockResolvedValue({
			data: {
				user: {
					id: faker.string.uuid(),
					email: dto.email,
				},
			},
		})

		const { status, data } = await useCase.execute(dto)

		expect(status).toBe(HttpStatus.CREATED)
		expect(data.message).toBe('User created successfully')
		if ('data' in data) {
			expect(data.data).toBeInstanceOf(User)
			expect(data.data.email).toBe(dto.email)
			expect(data.data.isSuperAdmin).toBe(false)
			expect(data.data.emailConfirmedAt).toBe(null)
			expect(data.data.profile).toBeInstanceOf(UserProfile)
			expect(data.data.profile.name).toBe(dto.name)
			expect(data.data.profile.surname).toBe(dto.surname)
			expect(data.data.profile.birthDate).toBeInstanceOf(Date)
		}
		expect(supabase.auth.signUp).toHaveBeenCalledWith({ email: dto.email, password: dto.password })
		expect(userRepository.findByEmail).toHaveBeenCalledWith(dto.email)
		expect(userRepository.saveProfile).toHaveBeenCalledTimes(1)
	})

	it('should create a profile if user already exists', async () => {
		const dto: SignupRequest = {
			email: faker.internet.email(),
			password: faker.internet.password(),
			name: faker.person.firstName(),
			surname: faker.person.lastName(),
			birthDate: faker.date.past().toISOString(),
		}

		const user = {
			id: faker.string.uuid(),
			email: dto.email,
			emailConfirmedAt: faker.date.past(),
			isSuperAdmin: faker.datatype.boolean(),
		}

		userRepository.findByEmail.mockResolvedValue(User.create(user))

		userRepository.saveProfile.mockResolvedValue(
			UserProfile.create({
				name: dto.name,
				surname: dto.surname,
				userId: faker.string.uuid(),
				birthDate: new Date(dto.birthDate),
			}),
		)

		const { status, data } = await useCase.execute(dto)

		expect(status).toBe(HttpStatus.CREATED)
		expect(data.message).toBe('User created successfully')
		if ('data' in data) {
			expect(data.data).toBeInstanceOf(User)
			expect(data.data.email).toBe(dto.email)
			expect(data.data.isSuperAdmin).toBe(user.isSuperAdmin)
			expect(data.data.emailConfirmedAt).toBeInstanceOf(Date)
			expect(data.data.profile).toBeInstanceOf(UserProfile)
			expect(data.data.profile.name).toBe(dto.name)
			expect(data.data.profile.surname).toBe(dto.surname)
			expect(data.data.profile.birthDate).toBeInstanceOf(Date)
		}
	})

	it('should fail if user already exists and has a profile', async () => {
		const dto: SignupRequest = {
			email: faker.internet.email(),
			password: faker.internet.password(),
			name: faker.person.firstName(),
			surname: faker.person.lastName(),
			birthDate: faker.date.past().toISOString(),
		}

		const user = {
			id: faker.string.uuid(),
			email: dto.email,
			emailConfirmedAt: faker.date.past(),
			isSuperAdmin: faker.datatype.boolean(),
		}

		const userProfile = {
			id: faker.number.int(),
			serial: faker.string.ulid(),
			name: dto.name,
			surname: dto.surname,
			userId: user.id,
			birthDate: faker.date.past(),
		}

		userRepository.findByEmail.mockResolvedValue(User.create(user))
		userRepository.findProfileByUserId.mockResolvedValue(UserProfile.create(userProfile))

		const { status, data } = await useCase.execute(dto)

		expect(status).toBe(HttpStatus.BAD_REQUEST)
		expect(data.message).toBe('It was not possible to create the user')
		if ('details' in data) {
			expect(data.details.code).toBe('BILL-201')
		}
	})
})
