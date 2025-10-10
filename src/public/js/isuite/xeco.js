
import coll from "../components/CollectionHTML.js";
import tabs from "../components/Tabs.js";
import api from "../components/Api.js";
import rf from "./ttpp.js";

//DOM is fully loaded
coll.ready(() => {
	const btnSave = $1("a[href='#tab-action-save']");
	const fnSearch = () => !tables.tbFilter(tbConfig);
	const fnReset = () => {
		btnSave.hide();
		iSearch.val("");
		tables.tbReset(tbConfig);
		return !rf.reset();
	}
	const fnTable = (norma, table) => {
		tbConfig.current = norma;
		tables.tbPush(tbConfig);
		delete norma.references;
		table.data.reset();
		btnSave.show();
	}

	$("form#ttpp").fbInit({ // Inicializo los campos y eventos del formulario
		LatinFloatParse: npLatin, LatinFloat: nfLatin, LatinDateParse: dpLatin, LatinDate: dfLatin,
		onStart: fnReset,
		onLoad: ev => rf.parse(ev.target.result), //parse file contents
		complete: function() { // after parse file
			const n19 = rf.n19();
			if (n19.files) {
				Object.assign(tbConfig.tables.n19, n19);
				return fnTable(n19, tbConfig.tables.n19);
			}

			const n43 = rf.n43();
			if (window.location.search == "?tpv=1") {
				return api.init().json("/uae/ttpp/tpv").then(tpvs => {
					tbConfig.tables.tpvs.data = n43.data.map(fila => {
						const tpv = tpvs.find(item => item.value.startsWith(rf.getTpv(fila)));
						fila.forma = tpv ? (tpv.value + " - " + tpv.label) : fila.forma; // actualizo el texto de agrupacion
						return rf.normalize(fila);
					});
					fnTable(n43, tbConfig.tables.tpvs);
				});
			}
			if (n43.files) {
				n43.referencias = rf.references(); // referencias leidas del fichero bancario
				const temp1 = n43.data.filter(rf.isConciliable); // filas conciliables
				const aux = Object.copy({}, n43, [ "ccc", "fInicio", "fFin", "referencias" ]);
				return api.setJSON(aux).json("/uae/ttpp/load").then(data => { // llamada post
					const temp2 = data.recibos.filter(recibo => {
						const fila = temp1.find(f => (recibo.refreb == f.ref1));
						fila && rf.acLoad(fila, recibo); //aÃ±ado los datos de academico
						if (!recibo.fCobro || ([18, 31].indexOf(recibo.pago) < 0))
							return false; //recibo no de TPV
						//primero ajusto el offset time zone (-1 o -2 horas) y luego sumo 1 dia
						//recibo.fCobro.addHours(fCobro.getTimezoneOffset() / 60).addDate(1); //ajusto la hora de AC
						recibo.fCobro = new Date(recibo.fCobro); // build date object
						if (recibo.fCobro.trunc().getDay() == 5) recibo.fCobro.addDate(3); //si es viernes paso a lunes
						else if (recibo.fCobro.getDay() == 6) recibo.fCobro.addDate(2); //si es sabado paso a lunes
						else recibo.fCobro.addDate(1); //de domingo a jueves sumo 1 dia
						if (!recibo.fCobro.between(n43.fInicio, n43.fFin))
							return false; //recibo fuera del rango de fechas del fichero
						recibo.codigo = "22"; //codigo por defecto
						recibo.ref1 = recibo.refreb; // rename referencia
						recibo.forma = "TPV Virtual"; // forma cobro
						recibo.fOperacion = recibo.fCobro; //guardo la fecha de operacion en el recibo
						n43.incorporado += recibo.importe; //importe incorporado de AC
						return rf.normalize(recibo); //incorporo el recibo
					});
					n43.importe = n43.total + n43.incorporado; // importe recibos cancarios + incorporados
					tbConfig.tables.n43.data = temp1.concat(temp2); // muestro todos los recibos
					fnTable(n43, tbConfig.tables.n43);
				});
			}

			const n57 = rf.n57();
			if (n57.files) {
				n57.referencias = rf.references(); // referencias leidas del fichero bancario
				const temp1 = n57.data.filter(rf.isConciliable); // filas conciliables
				const aux = Object.copy({}, n57, [ "ccc", "fInicio", "fFin", "referencias" ]);
				return api.setJSON(aux).json("/uae/ttpp/load").then(data => { // llamada post
					data.recibos.forEach(recibo => { //no incorporo nada
						const fila = temp1.find(f => (recibo.refreb == f.ref1));
						fila && rf.acLoad(fila, recibo); // añado los datos de academico
					});
					tbConfig.tables.n57.data = temp1;
					fnTable(n57, tbConfig.tables.n57);
				});
			}
		}
	});

	$("a#reset").click(fnReset);
	const fr = $("input#fichero").change(() => fr.fbRead());
	const ag = $("a#group, a#ungroup").click(function() { toggle(ag); return !tables.tbToggleGroup(tbConfig); });

	tabs.setAction("save", () => api.init().json("/uae/ttpp/save"));
	const fnHideTable = table => { table.parentNode.hide(); tabs.setHeight(); }
	const fnShowTable = function(table) {
		if (this.numrows) {
			table.closest(".hide").show();
			table.previousElementSibling.render(tbConfig.current);
			table.querySelectorAll(".tb-resume-final").forEach(el => el.nextElementSibling.hide());
		}
		else
			$(table).tbReset(tbConfig);
		tabs.setHeight();
	}

	const tbConfig = { // Inicializo la configuracion y eventos de la tabla
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
				afterPush: fnShowTable,
				afterReset: fnHideTable
			},
			n43: {
				typeColumns: { fCobro: "DateTime", importe: "Number" },
				styleColumns: { fCobro: "LatinDate", importe: "LatinFloat" },
				afterPush: fnShowTable,
				afterReset: fnHideTable
			},
			n57: {
				typeColumns: { fCobro: "DateTime", idActividad: "Number", importe: "Number" },
				styleColumns: { fCobro: "LatinDate", idActividad: "Integer", importe: "LatinFloat" },
				afterPush: fnShowTable,
				afterReset: fnHideTable
			},
			tpvs: {
				typeColumns: { fCobro: "DateTime", importe: "Number" },
				styleColumns: { fCobro: "LatinDate", importe: "LatinFloat" },
				afterPush: fnShowTable,
				afterReset: fnHideTable
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
					data.porGg = data.porGg ?? "";
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
					return ok && iSearch.ilike(row);
				}
			}
		},

		onFilter: function(row) { return iSearch.ilike(row); },
		createGroup: function(node, row, name) { node.text += row[name + "Desc"] ? (" - " + row[name + "Desc"]) : ""; }
	};

	$("select[id$=ejercicio]").change(function() { $("[id$=srv-search]").click(); });
	$("a#search").click(fnSearch);
	$("a#clearSearch").click(function() { iSearch.val(""); return fnSearch(); });
	var at = $("a#tabla, a#pivot").click(function() { toggle(at); return !toggle(tables); });
	$("a#excel").click(function() { this.href = B64MT.xls + tables.filter(".tb-push").xls(tbConfig).utf8ToB64(); });
	$("a#tr").click(function(){ this.href = B64MT.txt + rf.tr57to43().n43Fetch().utf8ToB64(); });

	const iSearch = $("[group=search]").keydown(ev => { ev.preventDefault(); (ev.keyCode == 13) && fnSearch(); });
	const tables = $("table[tb-columns]").tbInit(tbConfig).tbRead(tbConfig).tbOrder(tbConfig);
});
