/// <reference path="TenisModelo.ts" />

module Tenis.Controlador {
    export interface Entrada {
        setOyente(oyente: Salida): void;
        empiezaPartido(datos: Modelo.DatosPartido): void;
        punto(jugador: number): void;

        getPartido(): Modelo.Partido;
    }

    export interface Salida {
        nuevoPartido(datos: Tenis.Modelo.DatosPartido): void;
        nuevoSet(numero: number): void;
        nuevoJuego(juego: Modelo.Juego): void;
        puntosJuego(juego: Modelo.Juego): void;
        puntosSet(numero: number, set: Modelo.Set): void;
        finPartido(partido: Modelo.Partido): void;
    }

    export class Principal implements Entrada {
        private partido: Modelo.Partido;
        private oyente: Salida;

        private setActual: Modelo.Set;
        private juegoActual: Modelo.Juego;
        private servicioActual: number;

        // Interface público
        empiezaPartido(datos: Modelo.DatosPartido): void {
            this.partido = new Modelo.Partido();
            this.partido.datos = datos;
            this.servicioActual = datos.servicioInicial;

            this.oyente.nuevoPartido(this.partido.datos);

            this.nuevoSet();
        }

        setOyente(oyente: Salida) {
            this.oyente = oyente;
        }

        punto(jugador: number): void {
            this.juegoActual.incrementa(jugador);

            if (this.juegoActual.ganador != undefined)
                this.juegoFinalizado();
            else
                this.oyente.puntosJuego(this.juegoActual);

        }

        getPartido(): Modelo.Partido {
            return this.partido;
        }

        // Implementación privada
        private nuevoSet() {
            this.setActual = new Modelo.Set();

            this.partido.sets.push(this.setActual);

            this.oyente.nuevoSet(this.partido.sets.length);

            this.nuevoJuego();
        }

        private nuevoJuego() {
            if (this.juegoActual)
                this.servicioActual = (this.servicioActual + 1) % 2;
            else
                this.servicioActual = this.partido.datos.servicioInicial;

            this.juegoActual = new Modelo.Juego();
            this.juegoActual.servicio = this.servicioActual;
                        
            if (this.setActual.puntos[0] == 6 
                && this.setActual.puntos[1] == 6 
                && (this.partido.sets.length != 5 || this.partido.datos.tieBreak5)) {

                this.setActual.tieBreak = true;
                this.juegoActual.tieBreak = true;
            }
            this.oyente.nuevoJuego(this.juegoActual);
        }

        private juegoFinalizado() {
            this.setActual.incrementa(this.juegoActual.ganador);
            this.oyente.puntosSet(this.partido.sets.length, this.setActual);

            if (this.setActual.ganador != undefined) {
                this.partido.incrementa(this.setActual.ganador);

                if (this.partido.ganador != undefined)
                    this.oyente.finPartido(this.partido);
                else
                    this.nuevoSet();
            }
            else
                this.nuevoJuego();
        }
    }
}