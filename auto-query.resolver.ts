/*
 * Copyright (C) 2021 - present Juergen Zimmermann, Hochschule Karlsruhe
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UseFilters, UseInterceptors } from '@nestjs/common';
import { Auto } from '../entity/auto.entity.js';
import { AutoReadService } from '../service/auto-read.service.js';
import { HttpExceptionFilter } from './http-exception.filter.js';
import { Public } from 'nest-keycloak-connect';
import { ResponseTimeInterceptor } from '../../logger/response-time.interceptor.js';
import { type Suchkriterien } from '../service/suchkriterien.js';
import { getLogger } from '../../logger/logger.js';

export interface IdInput {
    readonly id: number;
}

export interface SuchkriterienInput {
    readonly suchkriterien: Suchkriterien;
}

@Resolver((_: any) => Auto)
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseTimeInterceptor)
export class AutoQueryResolver {
    readonly #service: AutoReadService;

    readonly #logger = getLogger(AutoQueryResolver.name);

    constructor(service: AutoReadService) {
        this.#service = service;
    }

    @Query('auto')
    @Public()
    async findById(@Args() { id }: IdInput) {
        this.#logger.debug('findById: id=%d', id);

        const auto = await this.#service.findById({ id });

        if (this.#logger.isLevelEnabled('debug')) {
            this.#logger.debug(
                'findById: auto=%s, bezeichnung=%o',
                auto.toString(),
                auto.bezeichnung,
            );
        }
        return auto;
    }

    @Query('buecher')
    @Public()
    async find(@Args() input: SuchkriterienInput | undefined) {
        this.#logger.debug('find: input=%o', input);
        const buecher = await this.#service.find(input?.suchkriterien);
        this.#logger.debug('find: buecher=%o', buecher);
        return buecher;
    }

    // @ResolveField('rabatt')
    // rabatt(@Parent() auto: Auto, short: boolean | undefined) {
    //     if (this.#logger.isLevelEnabled('debug')) {
    //         this.#logger.debug(
    //             'rabatt: auto=%s, short=%s',
    //             auto.toString(),
    //             short,
    //         );
    //     }
    //     const rabatt = auto.rabatt ?? 0;
    //     const shortStr = short === undefined || short ? '%' : 'Prozent';
    //     // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    //     return `${(rabatt * 100).toFixed(2)} ${shortStr}`;
    // }
}
