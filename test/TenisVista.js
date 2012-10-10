$(function () {
    var controlador = new Tenis.Controlador.Principal();
    var vista = new Tenis.Vista.Principal();
    controlador.setOyente(vista);
    vista.setControlador(controlador);
});
var Tenis;
(function (Tenis) {
    (function (Vista) {
        var EstadoPartido;
        (function (EstadoPartido) {
            EstadoPartido._map = [];
            EstadoPartido._map[0] = "Previo";
            EstadoPartido.Previo = 0;
            EstadoPartido._map[1] = "Jugando";
            EstadoPartido.Jugando = 1;
            EstadoPartido._map[2] = "Finalizado";
            EstadoPartido.Finalizado = 2;
        })(EstadoPartido || (EstadoPartido = {}));

        var Principal = (function () {
            function Principal() {
                this.estado = EstadoPartido.Previo;
                this.inicializarVista();
            }
            Principal.prototype.setControlador = function (tenis) {
                this.tenis = tenis;
            };
            Principal.prototype.nuevoPartido = function (datos) {
                this.situarEstado(EstadoPartido.Jugando);
                $('#jug1 #jugador').html(datos.jugadores[0]);
                $('#jug2 #jugador').html(datos.jugadores[1]);
                $('.puntos').html('');
                if(datos.numeroSets == 5) {
                    $('.sets5').show();
                } else {
                    $('.sets5').hide();
                }
            };
            Principal.prototype.nuevoSet = function (numero) {
                this.setPuntosJuego(numero.toString(), [
                    0, 
                    0
                ]);
            };
            Principal.prototype.nuevoJuego = function (juego) {
                this.puntosJuego(juego);
            };
            Principal.prototype.puntosJuego = function (juego) {
                this.setPuntosJuego('Actual', juego.puntos);
                this.setVisible('#jug1 #ventaja', juego.ventaja == 0);
                this.setVisible('#jug2 #ventaja', juego.ventaja == 1);
                this.setVisible('#tieBreak', juego.tieBreak);
                this.setVisible('#jug1 #servicio', juego.servicio == 0);
                this.setVisible('#jug2 #servicio', juego.servicio == 1);
            };
            Principal.prototype.puntosSet = function (numero, set) {
                this.setPuntosJuego(numero.toString(), set.puntos);
            };
            Principal.prototype.finPartido = function (partido) {
                this.setPuntosJuego('Actual', [
                    0, 
                    0
                ]);
                $('#finalizado').html('Partido finalizado');
                $('#ganador').html('Ganador: ' + partido.datos.jugadores[partido.ganador]);
                this.situarEstado(EstadoPartido.Finalizado);
            };
            Principal.prototype.suspenderPartido = function () {
                if(confirm('¿Estás seguro de suspender el partido?')) {
                    $('#finalizado').html('Partido suspendido');
                    $('#ganador').html('');
                    this.situarEstado(EstadoPartido.Finalizado);
                }
            };
            Principal.prototype.situarEstado = function (estado) {
                this.setVisible('.previoPartido', false);
                this.setVisible('.durantePartido', false);
                this.setVisible('.despuesPartido', false);
                if(estado == EstadoPartido.Previo) {
                    this.setVisible('.previoPartido', true);
                }
                if(estado == EstadoPartido.Jugando) {
                    this.setVisible('.durantePartido', true);
                }
                if(estado == EstadoPartido.Finalizado) {
                    this.setVisible('.despuesPartido', true);
                }
            };
            Principal.prototype.inicializarVista = function () {
                var me = this;
                $('#formEmpezar').submit(function (data) {
                    if($('#formEmpezar').valid()) {
                        var datos = new Tenis.Modelo.DatosPartido();
                        datos.jugadores = [
                            $('input[name$="nombreJugador1"]').val(), 
                            $('input[name$="nombreJugador2"]').val()
                        ];
                        datos.numeroSets = $('select[name$="sets"]').val();
                        datos.tieBreak5 = $('input[name$="tiebreak"]').is(':checked');
                        datos.servicioInicial = $('input:radio[name=servicio]:checked').val();
                        me.tenis.empiezaPartido(datos);
                        $('#nuevoPartido').modal('hide');
                        return false;
                    }
                });
                $('select[name$="sets"]').change(function () {
                    if($('select[name$="sets"]').val() == '5') {
                        $('.para5Sets').show();
                    } else {
                        $('.para5Sets').hide();
                    }
                });
                $('#jug1 #puntoBoton').click(function () {
                    me.tenis.punto(0);
                });
                $('#jug2 #puntoBoton').click(function () {
                    me.tenis.punto(1);
                });
                $('#suspenderPartido').click(function () {
                    me.suspenderPartido();
                });
            };
            Principal.prototype.setVisible = function (selector, visible) {
                if(visible) {
                    $(selector).removeClass('hide');
                } else {
                    $(selector).addClass('hide');
                }
            };
            Principal.prototype.setPuntosJuego = function (juego, puntos) {
                $('#jug1 #juego' + juego).html(puntos[0].toString());
                $('#jug2 #juego' + juego).html(puntos[1].toString());
            };
            return Principal;
        })();
        Vista.Principal = Principal;        
    })(Tenis.Vista || (Tenis.Vista = {}));
    var Vista = Tenis.Vista;

})(Tenis || (Tenis = {}));

