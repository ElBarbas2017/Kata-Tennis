/// <reference path="jquery.d.ts" />
/// <reference path="jquery.validation.d.ts" />
/// <reference path="bootstrap-modal.d.ts" />

/// <reference path="TenisModelo.ts" />
/// <reference path="TenisControlador.ts" />

$(function () {
    var controlador = new Tenis.Controlador.Principal();
    var vista = new Tenis.Vista.Principal();

    controlador.setOyente(vista);
    vista.setControlador(controlador);
})

module Tenis.Vista {

    enum EstadoPartido {
        Previo, Jugando, Finalizado
    }

    export class Principal implements Tenis.Controlador.Salida {
        private tenis: Tenis.Controlador.Entrada;
        private estado: EstadoPartido = EstadoPartido.Previo;

        constructor () {
            this.inicializarVista();
        }

        public setControlador(tenis: Tenis.Controlador.Entrada) {
            this.tenis = tenis;
        }

        // Implementación interface
        private nuevoPartido(datos: Tenis.Modelo.DatosPartido): void {
            this.situarEstado(EstadoPartido.Jugando);

            $('#jug1 #jugador').html(datos.jugadores[0]);
            $('#jug2 #jugador').html(datos.jugadores[1]);
            $('.puntos').html('');
            if (datos.numeroSets == 5)
                $('.sets5').show();
            else
                $('.sets5').hide();
        }

        private nuevoSet(numero: number): void {
            this.setPuntosJuego(numero.toString(), [0, 0]);
        }

        private nuevoJuego(juego: Modelo.Juego): void {
            this.puntosJuego(juego);
        }

        private puntosJuego(juego: Tenis.Modelo.Juego): void {
            this.setPuntosJuego('Actual', juego.puntos);

            this.setVisible('#jug1 #ventaja', juego.ventaja == 0);
            this.setVisible('#jug2 #ventaja', juego.ventaja == 1);

            this.setVisible('#tieBreak', juego.tieBreak);

            this.setVisible('#jug1 #servicio', juego.servicio == 0);
            this.setVisible('#jug2 #servicio', juego.servicio == 1);
        }

        private puntosSet(numero: number, set: Tenis.Modelo.Set): void {
            this.setPuntosJuego(numero.toString(), set.puntos);
        }

        private finPartido(partido: Tenis.Modelo.Partido): void {
            this.setPuntosJuego('Actual', [0, 0]);

            $('#finalizado').html('Partido finalizado');
            $('#ganador').html('Ganador: ' + partido.datos.jugadores[partido.ganador]);

            this.situarEstado(EstadoPartido.Finalizado);
        }

        private suspenderPartido() {
            if (confirm('¿Estás seguro de suspender el partido?')) {
                $('#finalizado').html('Partido suspendido');
                $('#ganador').html('');

                this.situarEstado(EstadoPartido.Finalizado);
            }
        }

        private situarEstado(estado: EstadoPartido) {
            this.setVisible('.previoPartido', false);
            this.setVisible('.durantePartido', false);
            this.setVisible('.despuesPartido', false);

            if (estado == EstadoPartido.Previo) this.setVisible('.previoPartido', true);
            if (estado == EstadoPartido.Jugando) this.setVisible('.durantePartido', true);
            if (estado == EstadoPartido.Finalizado) this.setVisible('.despuesPartido',true);
        }

        // Implementación privada
        private inicializarVista() {
            var me = this;

            $('#formEmpezar').submit(function (data) {
                if ($('#formEmpezar').valid()) {
                    var datos = new Tenis.Modelo.DatosPartido();
                    datos.jugadores = [$('input[name$="nombreJugador1"]').val(), $('input[name$="nombreJugador2"]').val()];
                    datos.numeroSets = $('select[name$="sets"]').val();
                    datos.tieBreak5 = $('input[name$="tiebreak"]').is(':checked');
                    datos.servicioInicial = $('input:radio[name=servicio]:checked').val();

                    me.tenis.empiezaPartido(datos);

                    $('#nuevoPartido').modal('hide');
                    return false
                }
            });

            $('select[name$="sets"]').change(function () {
                if ($('select[name$="sets"]').val() == '5')
                    $('.para5Sets').show();
                else
                    $('.para5Sets').hide();
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
        }

        private setVisible(selector: string, visible: bool) {
            if (visible) $(selector).removeClass('hide'); else $(selector).addClass('hide');
        }

        private setPuntosJuego(juego: string, puntos: number[]) {
            $('#jug1 #juego'+juego).html(puntos[0].toString());
            $('#jug2 #juego'+juego).html(puntos[1].toString());
        }
    }
}