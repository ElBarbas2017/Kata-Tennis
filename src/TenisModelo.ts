/// <reference path="TenisModelo.ts" />
/// <reference path="TenisControlador.ts" />

module Tenis.Modelo {

    export class DatosPartido {
        jugadores: string[];
        numeroSets: number;
        tieBreak5: bool;
        servicioInicial: number;
    }

    export class Partido {
        datos: DatosPartido;
        sets: Set[] = [];
        contador: number[] = [0, 0];
        ganador: number;

        incrementa(jugador: number): void {
            this.contador[jugador]++;

            if (this.esPartidoFinalizado(jugador))
                this.ganador = jugador;
        }

        private esPartidoFinalizado(jugador: number): bool {
            // Si se ha llegado al total de sets del partido o bien un jugador ha ganado un número superior de sets superior a la mitad del total (2/3, 3/5)
            return (this.sets.length == this.datos.numeroSets) || (this.contador[jugador] > this.datos.numeroSets / 2);
        }
    }

    export class Juego {
        puntos: number[] = [0, 0];
        ventaja: number;
        tieBreak: bool;
        ganador: number;
        servicio: number;

        incrementa(jugador: number): void {
            var adversario = (jugador + 1) % 2;
            if (this.tieBreak) {
                this.puntos[jugador]++;

                if ((this.puntos[0]+this.puntos[1])%2 == 1)
                    this.servicio = (this.servicio + 1) % 2;

                if (this.esTieBreakFinalizado(jugador, adversario))
                    this.ganador = jugador;
            }
            else {
                switch (this.puntos[jugador]) {
                    case 0: this.puntos[jugador] = 15; break;
                    case 15: this.puntos[jugador] = 30; break;
                    case 30: this.puntos[jugador] = 40; break;
                    case 40:
                        if (this.puntos[adversario] == 40)
                            if (this.ventaja == jugador)
                                this.ganador = jugador;
                            else if (this.ventaja == adversario)
                                this.ventaja = undefined;
                            else
                                this.ventaja = jugador;
                        else
                            this.ganador = jugador;
                        break;
                }
            }
        }

        esTieBreakFinalizado(jugador: number, adversario: number): bool {
            return this.puntos[jugador] > 6 && (this.puntos[jugador] - this.puntos[adversario]) >= 2;
        }
    }

    export class Set {
        puntos: number[] = [0, 0];
        ganador: number;
        tieBreak: bool;

        public incrementa(jugador: number): void {
            var adversario = (jugador + 1) % 2;

            this.puntos[jugador]++;

            if (this.esSetFinalizado(jugador, adversario))
                this.ganador = jugador;
        }

        private esSetFinalizado(jugador: number, adversario: number): bool {
            return this.puntos[jugador] >= 6 && (this.tieBreak || this.puntos[jugador] - this.puntos[adversario] >= 2);
        }
    }
}