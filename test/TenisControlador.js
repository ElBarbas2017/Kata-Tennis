var Tenis;
(function (Tenis) {
    (function (Controlador) {
        var Principal = (function () {
            function Principal() { }
            Principal.prototype.empiezaPartido = function (datos) {
                this.partido = new Tenis.Modelo.Partido();
                this.partido.datos = datos;
                this.servicioActual = datos.servicioInicial;
                this.oyente.nuevoPartido(this.partido.datos);
                this.nuevoSet();
            };
            Principal.prototype.setOyente = function (oyente) {
                this.oyente = oyente;
            };
            Principal.prototype.punto = function (jugador) {
                this.juegoActual.incrementa(jugador);
                if(this.juegoActual.ganador != undefined) {
                    this.juegoFinalizado();
                } else {
                    this.oyente.puntosJuego(this.juegoActual);
                }
            };
            Principal.prototype.getPartido = function () {
                return this.partido;
            };
            Principal.prototype.nuevoSet = function () {
                this.setActual = new Tenis.Modelo.Set();
                this.partido.sets.push(this.setActual);
                this.oyente.nuevoSet(this.partido.sets.length);
                this.nuevoJuego();
            };
            Principal.prototype.nuevoJuego = function () {
                if(this.juegoActual) {
                    this.servicioActual = (this.servicioActual + 1) % 2;
                } else {
                    this.servicioActual = this.partido.datos.servicioInicial;
                }
                this.juegoActual = new Tenis.Modelo.Juego();
                this.juegoActual.servicio = this.servicioActual;
                if(this.setActual.puntos[0] == 6 && this.setActual.puntos[1] == 6 && (this.partido.sets.length != 5 || this.partido.datos.tieBreak5)) {
                    this.setActual.tieBreak = true;
                    this.juegoActual.tieBreak = true;
                }
                this.oyente.nuevoJuego(this.juegoActual);
            };
            Principal.prototype.juegoFinalizado = function () {
                this.setActual.incrementa(this.juegoActual.ganador);
                this.oyente.puntosSet(this.partido.sets.length, this.setActual);
                if(this.setActual.ganador != undefined) {
                    this.partido.incrementa(this.setActual.ganador);
                    if(this.partido.ganador != undefined) {
                        this.oyente.finPartido(this.partido);
                    } else {
                        this.nuevoSet();
                    }
                } else {
                    this.nuevoJuego();
                }
            };
            return Principal;
        })();
        Controlador.Principal = Principal;        
    })(Tenis.Controlador || (Tenis.Controlador = {}));
    var Controlador = Tenis.Controlador;

})(Tenis || (Tenis = {}));

