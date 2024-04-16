/**
 * Das Modul besteht aus der Klasse {@linkcode QueryBuilder}.
 * @packageDocumentation
 */

import { Auto } from '../entity/auto.entity.js';
import { Bezeichnung } from '../entity/bezeichnung.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { type Suchkriterien } from './suchkriterien.js';
import { Zubehoer } from '../entity/zubehoer.entity.js';
import { getLogger } from '../../logger/logger.js';
import { typeOrmModuleOptions } from '../../config/typeormOptions.js';

/** Typdefinitionen für die Suche mit der Auto-ID. */
export interface BuildIdParams {
    /** ID des gesuchten Autos. */
    readonly id: number;
    /** Sollen die Zubehoere mitgeladen werden? */
    readonly mitZubehoeren?: boolean;
}
/**
 * Die Klasse `QueryBuilder` implementiert das Lesen für Autos und greift
 * mit _TypeORM_ auf eine relationale DB zu.
 */
@Injectable()
export class QueryBuilder {
    readonly #autoAlias = `${Auto.name
        .charAt(0)
        .toLowerCase()}${Auto.name.slice(1)}`;

    readonly #bezeichnungAlias = `${Bezeichnung.name
        .charAt(0)
        .toLowerCase()}${Bezeichnung.name.slice(1)}`;

    readonly #zubehoerAlias = `${Zubehoer.name
        .charAt(0)
        .toLowerCase()}${Zubehoer.name.slice(1)}`;

    readonly #repo: Repository<Auto>;

    readonly #logger = getLogger(QueryBuilder.name);

    constructor(@InjectRepository(Auto) repo: Repository<Auto>) {
        this.#repo = repo;
    }

    /**
     * Ein Auto mit der ID suchen.
     * @param id ID des gesuchten Autos
     * @returns QueryBuilder
     */
    buildId({ id, mitZubehoeren = false }: BuildIdParams) {
        const queryBuilder = this.#repo.createQueryBuilder(this.#autoAlias);

        queryBuilder.innerJoinAndSelect(
            `${this.#autoAlias}.bezeichnung`,
            this.#bezeichnungAlias,
        );

        if (mitZubehoeren) {
            queryBuilder.leftJoinAndSelect(
                `${this.#autoAlias}.zubehoere`,
                this.#zubehoerAlias,
            );
        }

        queryBuilder.where(`${this.#autoAlias}.id = :id`, { id: id }); // eslint-disable-line object-shorthand
        return queryBuilder;
    }

    /**
     * Autos asynchron suchen.
     * @param suchkriterien JSON-Objekt mit Suchkriterien
     * @returns QueryBuilder
     */
    build({ bezeichnung, ...props }: Suchkriterien) {
        this.#logger.debug(
            'build: bezeichnung=%s, props=%o',
            bezeichnung,
            props,
        );

        let queryBuilder = this.#repo.createQueryBuilder(this.#autoAlias);
        queryBuilder.innerJoinAndSelect(
            `${this.#autoAlias}.bezeichnung`,
            'bezeichnung',
        );

        let useWhere = true;

        if (bezeichnung !== undefined && typeof bezeichnung === 'string') {
            const ilike =
                typeOrmModuleOptions.type === 'postgres' ? 'ilike' : 'like';
            queryBuilder = queryBuilder.where(
                `${this.#bezeichnungAlias}.bezeichnung ${ilike} :bezeichnung`,
                { bezeichnung: `%${bezeichnung}%` },
            );
            useWhere = false;
        }

        Object.keys(props).forEach((key) => {
            const param: Record<string, any> = {};
            param[key] = (props as Record<string, any>)[key]; // eslint-disable-line @typescript-eslint/no-unsafe-assignment, security/detect-object-injection
            queryBuilder = useWhere
                ? queryBuilder.where(
                      `${this.#autoAlias}.${key} = :${key}`,
                      param,
                  )
                : queryBuilder.andWhere(
                      `${this.#autoAlias}.${key} = :${key}`,
                      param,
                  );
            useWhere = false;
        });

        this.#logger.debug('build: sql=%s', queryBuilder.getSql());
        return queryBuilder;
    }
}
