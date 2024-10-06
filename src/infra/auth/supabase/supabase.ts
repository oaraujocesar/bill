import { Inject, Injectable, Logger, Scope } from '@nestjs/common'
import { Request } from 'express'
import { REQUEST } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'

import { createClient, SupabaseClient } from '@supabase/supabase-js'

@Injectable({ scope: Scope.REQUEST })
export class Supabase {
	private readonly logger = new Logger(Supabase.name)
	private clientInstance: SupabaseClient

	constructor(
		@Inject(REQUEST) private readonly request: Request,
		private readonly configService: ConfigService,
	) {
		this.logger.log('initialising new supabase client...')

		this.clientInstance = createClient(
			this.configService.get('SUPABASE_URL') ?? '',
			this.configService.get('SUPABASE_KEY') ?? '',
			{
				auth: {
					autoRefreshToken: true,
					detectSessionInUrl: false,
				},
			},
		)
	}

	getClient() {
		this.logger.log('getting supabase client...')
		if (this.clientInstance) {
			this.logger.log('client exists - returning for current Scope.REQUEST')
			return this.clientInstance
		}

		this.logger.log('initializing new supabase client for new Scope.REQUEST')
		this.clientInstance = createClient(
			this.configService.get('SUPABASE_URL') ?? '',
			this.configService.get('SUPABASE_KEY') ?? '',
			{
				auth: {
					autoRefreshToken: true,
					detectSessionInUrl: false,
				},
			},
		)

		return this.clientInstance
	}
}
