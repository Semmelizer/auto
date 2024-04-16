/* eslint-disable @typescript-eslint/no-magic-numbers */
/*

/**
 * Das Modul besteht aus der Entity-Klasse.
 * @packageDocumentation
 */

import { ApiProperty } from '@nestjs/swagger';
import { MaxLength } from 'class-validator';

/**
 * Entity-Klasse für Zubehör ohne TypeORM.
 */
export class ZubehoerDTO {
    @MaxLength(32)
    @ApiProperty({ example: 'Ein Name', type: String })
    readonly name!: string;

    @MaxLength(16)
    @ApiProperty({ example: 'Eine Beschreibung', type: String })
    readonly beschreibung!: string;
}
/* eslint-enable @typescript-eslint/no-magic-numbers */
