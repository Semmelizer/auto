/* eslint-disable @typescript-eslint/no-magic-numbers */
/*

/**
 * Das Modul besteht aus der Entity-Klasse.
 * @packageDocumentation
 */

import { IsOptional, Matches, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Entity-Klasse für Titel ohne TypeORM.
 */
export class BezeichnungDTO {
    @Matches('^\\w.*')
    @MaxLength(40)
    @ApiProperty({ example: 'Die Bezeichnung', type: String })
    readonly bezeichnung!: string;

    @IsOptional()
    @MaxLength(40)
    @ApiProperty({ example: 'Der Zusatz', type: String })
    readonly zusatz: string | undefined;
}
/* eslint-enable @typescript-eslint/no-magic-numbers */
