
//DOM is fully loaded
$(function() {
	function fnSearch() { return !tables.tbFilter(tbConfig); };
	function fnReset() { tbConfig.iSearch.val(""); tables.tbReset(tbConfig); return !rf.reset(); };

	//inicializo los campos y eventos del formulario
	var fbConfig = {
		LatinFloatParse: npLatin, LatinFloat: nfLatin, LatinDateParse: dpLatin, LatinDate: dfLatin,
		onStart: fnReset,
		onLoad: function(ev, file, i) { rf.parse(ev.target.result); }, //parse file contents
		complete: function() {
			if (location.pathname.endsWith("ttpp_tpvs.xhtml"))
				return tables.tbPush(tbConfig);

			var n19 = rf.n19();
			if (n19.files) {
				Object.assign(tbConfig.tables.n19, n19);
				return tables.tbPush(tbConfig);
			}

			var data = rf.save().n43();
			data.referencias = rf.references().join();
			form.fbSet(data).find("[id$=read]").click();
		}
	};

	$("a#reset").click(fnReset);
	var form = $("form#ttpp").fbInit(fbConfig);
	var fr = $("input#fichero").change(function() { fr.fbRead(); });
	var ag = $("a#group, a#ungroup").click(function() { toggle(ag); return !tables.tbToggleGroup(tbConfig); });

	//inicializo la configuracion y eventos de la tabla
	var tbConfig = {
		LatinFloatParse: toNumber, LatinFloat: nfLatin, LatinDateParse: toDate, LatinDate: dfLatin, 
		/*orderNameClass: "ui-sortable-column-icon ui-icon ui-icon-carat-2-n-s",*/ descNameClass: "ui-icon-triangle-1-s", ascNameClass: "ui-icon-triangle-1-n",
		headColumns: '<td colspan="@columns_1;">@text;</td><td class="text-right">@importeSumFmt;</td>',
		footColumns: '<td colspan="@columns_1;">Filas: @numrows;</td><td class="text-right">@importeSumFmt;</td>',
		classColumns: { importe: "text-right" },
		primaryKey: "refreb",

		tables: {
			n19: {
				typeColumns: { fCobro: "DateTime", importe: "Number" },
				styleColumns: { fCobro: "LatinDate", importe: "LatinFloat" },
				afterPush: function(table) { $(table).parents().removeClass("hide").show(); },
				afterReset: function(table) { $(table.parentNode).addClass("hide").hide(); }
			},
			n43: {
				typeColumns: { fCobro: "DateTime", importe: "Number" },
				styleColumns: { fCobro: "LatinDate", importe: "LatinFloat" },
				beforeRead: function(table) {
					Object.assign(this, rf.load().n43());
					this.data = this.data.filter(rf.isConciliable);
				},
				onRead: function(recibo, row) {
					var fila = this.data.find(function(f) { return (recibo.refreb == f.ref1); });
					fila && rf.acLoad(fila, recibo); //aÃ±ado los datos de academico
					recibo.idFormaPago = +attr(row, "fp"); //forma de pago
					if (!recibo.fCobro || ([18, 31].indexOf(recibo.idFormaPago) < 0))
						return false; //recibo no de TPV
					//primero ajusto el offset time zone (-1 o -2 horas) y luego sumo 1 dia
					//recibo.fCobro.addHours(fCobro.getTimezoneOffset() / 60).addDate(1); //ajusto la hora de AC
					if (recibo.fCobro.getDay() == 5) recibo.fCobro.addDate(3); //si es viernes paso a lunes
					else if (recibo.fCobro.getDay() == 6) recibo.fCobro.addDate(2); //si es sabado paso a lunes
					else recibo.fCobro.addDate(1); //de domingo a jueves sumo 1 dia
					if (!recibo.fCobro.between(this.fInicio, this.fFin))
						return false; //recibo fuera del rango de fechas del fichero
					this.incorporado += recibo.importe; //importe incorporado de AC
					recibo.fOperacion = recibo.fCobro; //guardo la fecha de operacion en el recibo
					recibo.codigo = "22"; //codigo por defecto
					return rf.normalize(recibo); //incorporo el recibo
				},
				afterRead: function(table) {
					if (this.numrows) {
						var n43 = rf.n43();
						delete n43.referencias;
						delete n43.referencias;
						n43.incorporado = this.incorporado;
						form.fbSet(rf.save().n43()); //guardo los datos incorporados
						$(table).parents().removeClass("hide").show();
					}
					else
						$(table).tbReset(tbConfig);
				},
				afterReset: function(table) { $(table.parentNode).addClass("hide").hide(); }
			},
			n57: {
				typeColumns: { fCobro: "DateTime", idActividad: "Number", importe: "Number" },
				styleColumns: { fCobro: "LatinDate", idActividad: "Integer", importe: "LatinFloat" },
				beforeRead: function(table) {
					Object.assign(this, rf.n57());
					this.data = this.data.filter(rf.isConciliable);
				},
				onRead: function(recibo, row) {
					var fila = this.data.find(function(f) { return (recibo.refreb == f.ref1); });
					fila && rf.acLoad(fila, recibo); //aÃ±ado los datos de academico
					return false; //no incorporo nada
				},
				afterRead: function(table) {
					this.numrows ? $(table).parents().removeClass("hide").show() : $(table).tbReset(tbConfig);
				},
				afterReset: function(table) { $(table.parentNode).addClass("hide").hide(); }
			},
			tpvs: {
				typeColumns: { fCobro: "DateTime", importe: "Number" },
				styleColumns: { fCobro: "LatinDate", importe: "LatinFloat" },
				beforePush: function() {
					Object.assign(this, rf.n43());
					this.tpvs = JSON.parse($("div#tpvsJSON").text());
				},
				onPush: function(fila) {
					var tpv = tbConfig.tables.tpvs.tpvs.find(function(e) { return e.startsWith(rf.getTpv(fila)); });
					fila.forma = tpv || fila.forma; //actualizo el texto de agrupacion
					rf.normalize(fila);
				},
				afterPush: function(table) { $(table).parents().removeClass("hide").show(); },
				afterReset: function(table) { $(table.parentNode).addClass("hide").hide(); }
			},

			ficheros: {
				headColumns: '<td colspan="3;">@text;</td><td class="text-right">@importeSumFmt;</td><td class="text-right">@ncGDCSumFmt;</td><td class="text-right">@ncElavonSumFmt;</td><td class="text-right">@incorporadoSumFmt;</td><td class="text-right">@conciliableSumFmt;</td><td class="text-right">@totalSumFmt;</td><td colspan="5"></td>',
				footColumnsfinal: '<td colspan="3">Filas: @numrows;</td><td class="text-right">@importeSumFmt;</td><td class="text-right">@ncGDCSumFmt;</td><td class="text-right">@ncElavonSumFmt;</td><td class="text-right">@incorporadoSumFmt;</td><td class="text-right">@conciliableSumFmt;</td><td class="text-right">@totalSumFmt;</td><td colspan="5"></td>',
				footColumns: '<td colspan="@columns;">Filas: @numrows;</td>',
				primaryKey: "idFichero",

				onRead: function(data, row) {
					data.dias = Math.round(data.fInicio.trunc().days(data.fFin.trunc()));
					data.acciones = row.cells[13].innerHTML;
					return true;
				},

				createGroup: function(node, row) {
					node.tpvAcum = node.cAcum = node.dias = node.i = 0;
					delete node.fFinMax; delete node.fInicioMin;
				},
				onGroup: function(node, row) {
					node.tpvAcum += row.difTpv;
					node.cAcum += row.difConciliable;
					row.tpvAcum = node.tpvAcum;
					row.cAcum = node.cAcum;
					node.dias += row.dias;
					if (!$.mbHasError() && node.fInicioMin && (Math.round(node.fInicioMin.startYear().days(node.fFinMax.trunc())) != (node.dias + node.i)))
						form.mbError(format("La cuenta @text;, tiene fechas intermedias fuera del rango del @fInicioMinFmt; al @fFinMaxFmt;", node));
					node.i++;
				},
				afterGroup: function(table) {
					$.mbHasError() || $(table).mbOk("Rango de fechas cubierto para todas las cuentas.");
				}
			},
			movimientos: {
				typeColumns: { fecha: "DateTime", importe: "Number" },
				styleColumns: { fecha: "LatinDate", importe: "LatinFloat" },
				footColumns: '<td colspan="6">Filas: @numrows;</td><td class="text-right">@importeSumFmt;</td><td colspan="2"></td>',
				primaryKey: "idMovimiento",
				onRead: function(data, row) { data.acciones = row.cells[8].innerHTML; return true; }
			},

			fcb: {
				typeColumns: { fAsiento: "DateTime", impAplicacion: "Number" },
				styleColumns: { fAsiento: "LatinDate", impAplicacion: "LatinFloat" },
				headColumns: '<td colspan="7">@text;</td><td class="text-right">@impAplicacionSumFmt;</td><td colspan="3"></td>',
				footColumns: '<td colspan="7">Filas: @numrows;</td><td class="text-right">@impAplicacionSumFmt;</td><td colspan="3"></td>',
				classColumns: { impAplicacion: "text-right" },
				onRead: function(data) { Object.assign(data, data.fAsiento.toObject()); return true; }
			},
			fcbpivot: {
				footColumns: '<td>Filas: @numrows;</td><td class="text-right">@EneroSumFmt;</td><td class="text-right">@FebreroSumFmt;</td><td class="text-right">@MarzoSumFmt;</td><td class="text-right">@AbrilSumFmt;</td><td class="text-right">@MayoSumFmt;</td><td class="text-right">@JunioSumFmt;</td><td class="text-right">@JulioSumFmt;</td><td class="text-right">@AgostoSumFmt;</td><td class="text-right">@SeptiembreSumFmt;</td><td class="text-right">@OctubreSumFmt;</td><td class="text-right">@NoviembreSumFmt;</td><td class="text-right">@DiciembreSumFmt;</td><td class="text-right">@impAplicacionSumFmt;</td>',
				classColumns: { number: "text-right", impAplicacion: "textuc text-right" }
			},
			gc: {
				footColumns: '<td colspan="4">Filas: @numrows;</td><td class="text-right">@drnAcumSumFmt;</td><td class="text-right">@rnAcumSumFmt;</td><td></td><td class="text-right">@orAcumSumFmt;</td><td class="text-right">@ctHabilitadoSumFmt;</td><td colspan="3"></td>',
				classColumns: { porGg: "text-right", drnAcum: "text-right", rnAcum: "text-right", orAcum: "text-right", maxHabilitar: "text-right", ctHabilitado: "text-right", txtHabilitar: "text-right" },

				onRead: function(data, row) {
					data.porGg = data.porGg || "";
					data.modalidad = attr(row, "modalidad");
					data.impCpAcum = attr(row, "impCpAcum");
					data.impHabilitar = attr(row, "impHabilitar");
					data.txtCpAcum = (!data.modalidad || (data.modalidad == "I") || (data.modalidad == "N")) 
										? "No Aplica" : nfLatin(data.impCpAcum);
					data.txtHabilitar = (!data.modalidad || (data.modalidad == "I")) ? "Sin Ingreso"
										: (data.modalidad == "N") ? "No Vigente"
										: (data.modalidad == "E") ? "A Eliminar"
										: (isNaN(data.impHabilitar) || (data.modalidad == "S")) ? "A Solicitud"
										: nfLatin(data.impHabilitar);
					data.maxHabilitar = data.maxHabilitar || "";
					data.aipOrg = data.aipOrg || "";
					data.fCreacion = toDate(attr(row, "fCreacion"));
					//Date.valid(data.fCreacion) && $("span#f-creacion").text(dfLatin(data.fCreacion) + " 00:36h");
					return true;
				},
				onOrder: function(a, b, name) { return (name == "txtHabilitar") ? cmp(a[name].lpad(15), b[name].lpad(15)) : cmp(a[name], b[name]); },
				onFilter: function(row) {
					var elem = $("select#impHabilitar");
					var i = elem.prop("selectedIndex");
					var ok = (i == 0) || ((i < 4) && (row.txtHabilitar == text($("option", elem).get(i))));
					ok = ok || ((i == 4) && (row.txtHabilitar.endsWith("00")) && (row.impHabilitar == 0));
					ok = ok || ((i == 5) && (row.impHabilitar > 0));
					return ok && tbConfig.iSearch.ilike(row);
				}
			}
		},

		onFilter: function(row) { return tbConfig.iSearch.ilike(row); },
		createGroup: function(node, row, name) { node.text += row[name + "Desc"] ? (" - " + row[name + "Desc"]) : ""; }
	};

	$("select[id$=ejercicio]").change(function() { $("[id$=srv-search]").click(); });
	$("a#search").click(fnSearch);
	$("a#clearSearch").click(function() { tbConfig.iSearch.val(""); return fnSearch(); });
	var at = $("a#tabla, a#pivot").click(function() { toggle(at); return !toggle(tables); });
	$("a#excel").click(function() { this.href = B64MT.xls + tables.filter(".tb-push").xls(tbConfig).utf8ToB64(); });
	$("a#tr").click(function(){ this.href = B64MT.txt + rf.tr57to43().n43Fetch().utf8ToB64(); });
	$("[name=multi]").fbMulti({
		primaryKey: "idMovimiento",
		idsInput: "filtro:ap:referencias",
		jsonData: "op-uxxiec",
		onFilter: function(data, term) { return olike(data, ["operacion", "tipo", "descripcion"], term); },
		onRender: function(data, term) {
			return data.operacion.iwrap(term, "<u><b>", "</b></u>") + " / " + data.tipo + " / " + nfLatin(data.importe) + " &euro;<br>" 
					+ data.descripcion.iwrap(term, "<u><b>", "</b></u>");
		},
		onSort: function(a, b) { return cmp(a.operacion, b.operacion); },
		onSelect: function(data) { return data.operacion; }
	});

	tbConfig.iSearch = $("[group=search]").keydown(function(ev) { if (ev.keyCode == 13) { ev.preventDefault(); fnSearch(); } });
	var tables = $("table[tb-columns]").tbInit(tbConfig).tbRead(tbConfig).tbOrder(tbConfig);
});
