
const INFO = { // información contextual
	c2s1: "Trabajos de albañilería, fontanería, electricidad, carpintería metálica y de madera, cristalería, mantenimiento de ascensores, desinfección y control de plagas, etc. así como los materiales necesarios para los mismos.",
	c2s2: "Trabajos de reparación y mantenimiento de máquinaria, así como los materiales necesarios para los mismos. Por ejemplo: Reparación de cortadoras, fresadoras, tornos, compresores, equipos industriales de cafeterías, etc.",
	c2s3: "Trabajos de reparación y mantenimiento de instalaciones técnicas, así como los materiales necesarios para los mismos. Por ejemplo: reparaciones y matenimiento en laboratorios, talleres especiales, sistemas de climatización, plantas fotovoltaicas, depósitos de gases, depuradoras, etc.",
	c2s4: "Trabajos de reparación, mantenimiento e ITV de vehículos de la Unidad Técnica",
	c2s5: "Trabajos de reparación y mantenimiento de muebles y electrodomésticos (exceptuando los de uso industrial en cafeterías), así como los materiales necesarios para los mismos.",
	c2s6: "Trabajos de reparación y mantenimiento de utensilios y herramientas, así como los materiales necesarios para los mismos. Por ejemplo: herramienta profesional especializada, medidor láser, equipos de diagnóstico, etc.",
	c2s7: "Trabajos de reparación y mantenimiento de otros elementos no incluidos en las categorías anteriores, así como los materiales necesarios para los mismos.",

	c3s1: "Servicios de traslados de mobiliario, enseres, equipos, etc.",
	c3s2: "Redacción de proyectos, estudios, dirección de obra, etc. realizados por estos profesionales, excepto los necesarios para el desarrollo de obras licitadas o instalación de equipos inventariables.",
	c3s3: "Otros servicios especializados de carácter técnico destinados tanto al análisis, diseño o asesoramiento (consultoría) como a la ejecución, implantación o soporte técnico (asistencia técnica), realizados por entidades externas en apoyo a la actividad de la universidad.",
	c3s4: "",
	c3s5: "",
	c3s6: "Licencias de duración no superior al año o de coste inferior a 300 € (IVA incluido)",
	c3s7: "Licencias de duración superior al año y de importe superior a 300 € (IVA incluido)",
	c3s8: "Otros servicios no incluido en las categorías anteriores",

	c4s1: "Material y mobiliario de oficina no inventariable de importe unitario inferior a 300 € (IVA incluido)",
	c4s2: "Equipos informáticos, periféricos, memorias, discos y similares, con un importe unitario inferior a 300 € (IVA incluido)",
	c4s3: "Materiales y muebles destinados a la docencia de importe unitario inferior a 300 € (IVA incluido). Por ejemplo, mesas y sillas para aulas, pizarras, etc.",
	c4s4: "Materiales y muebles de un importe unitario inferior a 300 € (IVA incluido) destinados a laboratorios.",
	c4s5: "Productos y material de limpieza",
	c4s6: "Vestuario y otras prendas de dotación obligada. Por ejemplo: uniformes, EPIs, etc.",
	c4s7: "Otro material fungible, de importe unitario inferior a  300 € (IVA incluido), de duración inferior al año y no incluido en las categorías anteriores",

	c5s1: "Arrendamiento de máquinas que hacen un trabajo específico de forma automática o mecánica, necesarias para el desarrollo de la actividad en laboratorios, talleres y aulas. Por ejemplo: arrendamiento de cortadoras, fresadoras, tornos, impresoras 3D, equipos industriales de cafeterías, etc.",
	c5s2: "Arrendamiento de un conjunto de equipos y elementos conectados entre sí que sirven para un uso concreto y especializado. Por ejemplo: arrendamiento de laboratorios, talleres especiales, sistemas de climatización, plantas fotovoltaicas, depósitos de gases, depuradoras, etc. También costes de trabajos especializados de montaje y desmontaje de instalaciones temporales, stands, etc.",
	c5s3: "Arrendamiento de herramientas transportables o accesorios que se utilizan para trabajar, normalmente junto a una máquina o de forma manual. Por ejemplo: arrendamiento de herramienta profesional especializada, medidor láser, equipos de diagnóstico, etc.",
	c5s4: "Arrendamiento de muebles y electrodomésticos (exceptuando los de uso industrial en las cafeterías)",
	c5s5: "Arrendamiento de edificios, locales, naves, etc.",
	c5s6: "Arrendamiento de vehículos",
	c5s7: "Arrendamiento de bienes no incluidos en las anteriores categorías",

	c6s1: "Máquinas que hacen un trabajo específico de forma automática o mecánica, instaladas permanentemente en una ubicación concreta, necesarias para el desarrollo de la actividad en laboratorios, talleres y aulas, que duren más de un año y su importe unitario sea superior a 300 € (IVA incluido). También los costes necesarios para su puesta en marcha inicial, facturados conjunta o separadamente, como los gastos de transporte, instalación, etc. Por ejemplo: Cortadoras, fresadoras, tornos, impresoras 3D, equipos industriales de cafeterías, etc.",
	c6s2: "Herramientas transportables o accesorios que se utilizan para trabajar, normalmente junto a una máquina o de forma manual, que duren más de un año y su importe unitario sea superior a 300 € (IVA incluido). También los costes necesarios para su puesta en marcha inicial, facturados conjunta o separadamente, como los gastos de transporte, configuración, etc. Por ejemplo: herramienta profesional especializada, medidor láser, equipos de diagnóstico, etc.",
	c6s3: "Conjunto de equipos y elementos conectados entre sí e instalados de forma permanente en el edificio, que sirven para un uso concreto y especializado y cuyo importe total sea superior a 300 € (IVA incluido). También los costes necesarios para su puesta en marcha inicial, facturados conjunta o separadamente, como los gastos de transporte, instalación, etc. Por ejemplo: laboratorios, talleres especiales, sistemas de climatización, plantas fotovoltaicas, depósitos de gases, depuradoras, etc.",
	c6s4: "Muebles y electrodomésticos (exceptuando los de uso industrial en las cafeterías), que duren más de un año y su importe unitario sea superior a 300 € (IVA incluido). También los costes necesarios para su puesta en marcha inicial, facturados conjunta o separadamente, como los gastos de transporte, etc.",
	c6s5: "Equipos electrónicos destinados al tratamiento, almacenamiento o transmisión de información que duren más de un año y su importe unitario sea superior a 300 € (IVA incluido). También los costes necesarios para su puesta en marcha inicial, facturados conjunta o separadamente, como los gastos de transporte, instalación, etc. Por ejemplo: ordenadores de sobremesa, portátiles, tablets, etc.",
	c6s6: "Otros elementos inventariables con duración superior a un año y de importe unitario superior a 300 € (IVA incluido) que no estén incluidos en las anteriores categorías. También los costes necesarios para su puesta en marcha inicial, facturados conjunta o separadamente, como los gastos de transporte, instalación, etc."
}

const ECONOMICAS = {
	c2s1: "21200",    c2s2: "21300", c2s3: "21301", c2s4: "21401", c2s5: "21500", c2s6: "21302", c2s7: "21900",
	c3s1: "2230101",  c3s2: "22620", c3s3: "22624", c3s4: "22700", c3s5: "22701", c3s6: "20600", c3s7: "64700", c3s8: "22699", 
	c4s1: "22000",    c4s2: "22002", c4s3: "22115", c4s4: "22116", c4s5: "22109", c4s6: "22104", c4s7: "22099",
	c5s1: "20300",    c5s2: "20301", c5s3: "20302", c5s4: "20500", c5s5: "20200", c5s6: "20400", c5s7: "20800",

	c6s1i1: "62100", c6s1i2: "63100", c6s2i1: "62102", c6s2i2: "63102", c6s3i1: "62103", c6s3i2: "63103",
	c6s4i1: "62300", c6s4i2: "63300", c6s5i1: "62401", c6s5i2: "63401", c6s6i1: "62909", c6s6i2: "63909"
}

const SUBCATEGORIAS = { // labels
	c2: [
		"Trabajos de albañilería, pintura, fontanería, electricidad, carpintería, jardinería, etc.", 
		"De equipos y aparatos (ej. reparación de compresores, cortadoras, tornos, etc.)", 
		"De instalaciones técnicas (ej. reparación de laboratorios, sistemas de climatización, depósitos, etc.)", 
		"De vehículos", "De mobiliario y electrodomésticos", "De herramientas, instrumentos y accesorios", 
		"De otros bienes"
	],
	c3: [
		"Traslados y mudanzas", "Servicios de profesionales colegiados (arquitectos, ingenieros, etc.)", 
		"Servicios de consultoría y asistencias técnicas", "Servicios de limpieza fuera de contrato", 
		"Sevicios de seguridad fuera de contrato", "Licencias anuales de software", "Licencias de software de duración superior al año",
		"Otros servicios"
	],
	c4: [
		"Mobiliario y otro material de oficina no inventariable", 
		"Material informático no inventariable", "Material de docencia no inventariable", "Material de laboratorio no inventariable", 
		"Produtos de limpieza", "Ropa de trabajo y EPI", "Otro material no inventariable"
	],
	c5: [
		"De equipos y aparatos (ej. de compresores, elevadores, generadores, etc.)", 
		"De instalaciones técnicas (ej. talleres, depósitos de gases, plantas fotovoltaicas, etc.)", 
		"De herramientas, instrumentos y accesorios", "De mobiliario y electrodomésticos", "De locales, naves y otros edificios", 
		"De vehículos", "De otros bienes"
	],
	c6: [
		"Equipos y aparatos (ej. compresores, cortadoras, tornos, etc.)", "Herramientas, instrumentos y accesorios", 
		"Instalaciones técnicas (ej. laboratorios, talleres, depósitos, plantas fotovoltaicas, climatización, etc.)", 
		"Mobiliario y electrodomésticos", "Ordenadores y otros equipos informáticos", 
		"Otros bienes inventariables"
	],
}

export default {
	getInfo: (categoria, subcategoria) => INFO["c" + categoria + "s" + subcategoria],
	getSubcategorias: categoria => (SUBCATEGORIAS["c" + categoria] || SUBCATEGORIAS.c2),
	getEconomica: (categoria, subcategoria, inventario) => {
		const prefix = "c" + categoria + "s" + subcategoria; // required part
		return inventario ? ECONOMICAS[prefix + "i" + inventario] : ECONOMICAS[prefix];
	},
	build: economica => {
		const result = {}; // select values
		const key = "" + Object.keys(ECONOMICAS).find(key => (ECONOMICAS[key] == economica)); // force string
		result.categoria  = key.charAt(1); // [2..6]
		result.subcategoria  = key.charAt(3); // [1..9]
		result.inventario  = key.charAt(5); // "" si fuera de rango [1..2]
		return result;
	}
}
