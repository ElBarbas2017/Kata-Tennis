var Tenis;
(function (Tenis) {
    (function (Modelo) {
        var DatosPartido = (function () {
            function DatosPartido() { }
            return DatosPartido;
        })();
        Modelo.DatosPartido = DatosPartido;        
        var Partido = (function () {
            function Partido() {
                this.sets = [];
                this.contador = [
                    0, 
                    0
                ];
            }
            Partido.prototype.incrementa = function (jugador) {
                this.contador[jugador]++;
                if(this.esPartidoFinalizado(jugador)) {
                    this.ganador = jugador;
                }
            };
            Partido.prototype.esPartidoFinalizado = function (jugador) {
                return (this.sets.length == this.datos.numeroSets) || (this.contador[jugador] > this.datos.numeroSets / 2);
            };
            return Partido;
        })();
        Modelo.Partido = Partido;        
        var Juego = (function () {
            function Juego() {
                this.puntos = [
                    0, 
                    0
                ];
            }
            Juego.prototype.incrementa = function (jugador) {
                var adversario = (jugador + 1) % 2;
                if(this.tieBreak) {
                    this.puntos[jugador]++;
                    if((this.puntos[0] + this.puntos[1]) % 2 == 1) {
                        this.servicio = (this.servicio + 1) % 2;
                    }
                    if(this.esTieBreakFinalizado(jugador, adversario)) {
                        this.ganador = jugador;
                    }
                } else {
                    switch(this.puntos[jugador]) {
                        case 0: {
                            this.puntos[jugador] = 15;
                            break;

                        }
                        case 15: {
                            this.puntos[jugador] = 30;
                            break;

                        }
                        case 30: {
                            this.puntos[jugador] = 40;
                            break;

                        }
                        case 40: {
                            if(this.puntos[adversario] == 40) {
                                if(this.ventaja == jugador) {
                                    this.ganador = jugador;
                                } else {
                                    if(this.ventaja == adversario) {
                                        this.ventaja = undefined;
                                    } else {
                                        this.ventaja = jugador;
                                    }
                                }
                            } else {
                                this.ganador = jugador;
                            }
                            break;

                        }
                    }
                }
            };
            Juego.prototype.esTieBreakFinalizado = function (jugador, adversario) {
                return this.puntos[jugador] > 6 && (this.puntos[jugador] - this.puntos[adversario]) >= 2;
            };
            return Juego;
        })();
        Modelo.Juego = Juego;        
        var Set = (function () {
            function Set() {
                this.puntos = [
                    0, 
                    0
                ];
            }
            Set.prototype.incrementa = function (jugador) {
                var adversario = (jugador + 1) % 2;
                this.puntos[jugador]++;
                if(this.esSetFinalizado(jugador, adversario)) {
                    this.ganador = jugador;
                }
            };
            Set.prototype.esSetFinalizado = function (jugador, adversario) {
                return this.puntos[jugador] >= 6 && (this.tieBreak || this.puntos[jugador] - this.puntos[adversario] >= 2);
            };
            return Set;
        })();
        Modelo.Set = Set;        
    })(Tenis.Modelo || (Tenis.Modelo = {}));
    var Modelo = Tenis.Modelo;

})(Tenis || (Tenis = {}));

