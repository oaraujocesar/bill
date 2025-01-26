import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common'
import { Account } from 'src/application/entities/account.entity'
import { AccountRepository } from 'src/application/repositories/account.repository'
import { ACCOUNT_REPOSITORY } from 'src/shared/tokens'
import { ResponseBody, buildResponse } from 'src/shared/utils/build-response'

type CreateAccountRequest = {
	name: string
	initialBalance: number
}

@Injectable()
export class CreateAccountUseCase {
	private readonly logger = new Logger(CreateAccountUseCase.name)

	constructor(@Inject(ACCOUNT_REPOSITORY) private readonly accountRepository: AccountRepository) {}

	async execute({ name, initialBalance }: CreateAccountRequest, userId: string): Promise<ResponseBody<Account>> {
		this.logger.debug('execution started')

		let account = Account.create({ name, userId, balance: initialBalance })

		account = await this.accountRepository.saveAccount(account)

		this.logger.debug(`account created ${JSON.stringify(account)}`)

		return buildResponse({
			data: account,
			statusCode: HttpStatus.CREATED,
			message: 'Account created successfully!',
		})
	}
}
