/**
 * Das Modul besteht aus der Klasse {@linkcode AutoReadService}.
 * @packageDocumentation
 */

import { type AutoArt } from './../entity/auto.entity.js';

/**
 * Typdefinition für `AutoReadService.find()`und `QueryBuilder.build()`
 */
export interface Suchkriterien {
    readonly fahrgestellnummer?: string;
    readonly art?: AutoArt;
    readonly preis?: number;
    readonly lieferbar?: boolean;
    readonly datum?: string;
    readonly bezeichnung?: string;
}
