
const INFO = { // información contextual
	c2s1: "Trabajos de albañilería, fontanería, electricidad, carpintería metálica y de madera, cristalería, mantenimiento de ascensores, desinfección y control de plagas, etc.",
	c2s2: "Reparación y mantenimiento de máquinas que hacen un trabajo específico de forma automática o mecánica, instaladas permanentemente en una ubicación concreta, necesarias para el desarrollo de la actividad en laboratorios, talleres y aulas. Por ejemplo: Reparación de cortadoras, fresadoras, tornos, impresoras 3D, compresores, equipos industriales de cafeterías, etc.",
	c2s3: "Reparación y mantenimiento de instalaciones técnicas consistentes en un conjunto de equipos y elementos conectados entre sí e instalados de forma permanente en el edificio, que sirven para un uso concreto y especializado. Por ejemplo: laboratorios, talleres especiales, sistemas de climatización, plantas fotovoltaicas, depósitos de gases, depuradoras, etc.",
	c2s4: "Reparación, mantenimiento e ITV de vehículos de la Unidad Técnica",
	c2s5: "Reparación y mantenimiento de muebles y electrodomésticos (exceptuando los de uso industrial en cafeterías)",
	c2s6: "Reparación y mantenimiento de utensilios y herramientas de fácil transporte y accesorios que se utilizan habitualmente junto a una máquina o de forma manual. Por ejemplo: herramienta profesional especializada, medidor láser, equipos de diagnóstico, etc.",
	c2s7: "Reparación y mantenimiento de otros elementos no incluidos en las categorías anteriores.",

	c3s1: "Servicios de traslados de mobiliario, enseres, equipos, etc.",
	c3s2: "Redacción de proyectos, estudios, dirección de obra, etc. realizados por estos profesionales, excepto los necesarios para el desarrollo de obras licitadas o instalación de equipos inventariables.",
	c3s3: "Otros servicios especializados de carácter técnico destinados tanto al análisis, diseño o asesoramiento (consultoría) como a la ejecución, implantación o soporte técnico (asistencia técnica), realizados por entidades externas en apoyo a la actividad de la universidad.",
	c3s4: "",
	c3s5: "",
	c3s6: "Otros servicios no incluido en las categorías anteriores",

	c4s1: "Material y mobiliario de oficina no inventariable de importe unitario inferior a 300 € (IVA incluido)",
	c4s2: "Equipos informáticos, periféricos, memorias, discos y similares, con un importe unitario inferior a 300 € (IVA incluido)",
	c4s3: "Materiales y muebles destinados a la docencia de importe unitario inferior a 300 € (IVA incluido). Por ejemplo, mesas y sillas para aulas, pizarras, etc.",
	c4s4: "Materiales y muebles de un importe unitario inferior a 300 € (IVA incluido) destinados a laboratorios.",
	c4s5: "Productos y material de limpieza",
	c4s6: "Vestuario y otras prendas de dotación obligada. Por ejemplo: uniformes, EPIs, etc.",
	c4s7: "Otro material fungible, de importe unitario inferior a  300 € (IVA incluido), de duración inferior al año y no incluido en las categorías anteriores",
	c4s8: "Licencias de duración no superior al año o de coste inferior a 300 € (IVA incluido)",
	c4s9: "Licencias de duración superior al año y de importe superior a 300 € (IVA incluido)",

	c5s1: "Arrendamiento de máquinas que hacen un trabajo específico de forma automática o mecánica, necesarias para el desarrollo de la actividad en laboratorios, talleres y aulas. Por ejemplo: arrendamiento de cortadoras, fresadoras, tornos, impresoras 3D, equipos industriales de cafeterías, etc.",
	c5s2: "Arrendamiento de un conjunto de equipos y elementos conectados entre sí e instalados de forma permanente en el edificio, que sirven para un uso concreto y especializado. Por ejemplo: arrendamiento de laboratorios, talleres especiales, sistemas de climatización, plantas fotovoltaicas, depósitos de gases, depuradoras, etc.",
	c5s3: "Arrendamiento de herramientas transportables o accesorios que se utilizan para trabajar, normalmente junto a una máquina o de forma manual. Por ejemplo: arrendamiento de herramienta profesional especializada, medidor láser, equipos de diagnóstico, etc.",
	c5s4: "Arrendamiento de muebles y electrodomésticos (exceptuando los de uso industrial en las cafeterías)",
	c5s5: "Arrendamiento de edificios, locales, naves, etc.",
	c5s6: "Arrendamiento de vehículos",
	c5s7: "Arrendamiento de bienes no incluidos en las anteriores categorías",

	c6s1: "Máquinas que hacen un trabajo específico de forma automática o mecánica, instaladas permanentemente en una ubicación concreta, necesarias para el desarrollo de la actividad en laboratorios, talleres y aulas, que duren más de un año y su importe unitario sea superior a 300 € (IVA incluido). Por ejemplo: Cortadoras, fresadoras, tornos, impresoras 3D, equipos industriales de cafeterías, etc.",
	c6s2: "Herramientas transportables o accesorios que se utilizan para trabajar, normalmente junto a una máquina o de forma manual, que duren más de un año y su importe unitario sea superior a 300 € (IVA incluido). Por ejemplo: herramienta profesional especializada, medidor láser, equipos de diagnóstico, etc.",
	c6s3: "Conjunto de equipos y elementos conectados entre sí e instalados de forma permanente en el edificio, que sirven para un uso concreto y especializado y cuyo importe total sea superior a 300 € (IVA incluido). Por ejemplo: laboratorios, talleres especiales, sistemas de climatización, plantas fotovoltaicas, depósitos de gases, depuradoras, etc.",
	c6s4: "Muebles y electrodomésticos (exceptuando los de uso industrial en las cafeterías), que duren más de un año y su importe unitario sea superior a 300 € (IVA incluido)",
	c6s5: "Equipos electrónicos destinados al tratamiento, almacenamiento o transmisión de información que duren más de un año y su importe unitario sea superior a 300 € (IVA incluido). Por ejemplo: ordenadores de sobremesa, portátiles, tablets, etc.",
	c6s6: "Otros elementos inventariables con duración superior a un año y de importe unitario superior a 300 € (IVA incluido) que no estén incluidos en las anteriores categorías."
}

const ECONOMICAS = {
	c2s1: "212.00",    c2s2: "213.00", c2s3: "213.01", c2s4: "214.01", c2s5: "215.00", c2s6: "213.02", c2s7: "219.00",
	c3s1: "223.01.01", c3s2: "226.20", c3s3: "226.24", c3s4: "227.00", c3s5: "227.01", c3s6: "226.99", 
	c4s1: "220.00",    c4s2: "220.02", c4s3: "221.15", c4s4: "221.16", c4s5: "221.09", c4s6: "221.04", c4s7: "220.99", c4s8: "206.00", c4s9: "647.00",
	c5s1: "203.00",    c5s2: "203.01", c5s3: "203.02", c5s4: "205.00", c5s5: "202.00", c5s6: "204.00", c5s7: "208.00",

	c6s1i1: "621.00", c6s1i2: "631.00", c6s2i1: "621.02", c6s2i2: "631.02", c6s3i1: "621.03", c6s3i2: "631.03",
	c6s4i1: "623.00", c6s4i2: "633.00", c6s5i1: "624.01", c6s5i2: "634.01", c6s6i1: "629.09", c6s6i2: "639.09"
}

const DATA = {
	// subcategorias
	c2: [ "Edificios", "Maquinaria", "Instalaciones técnicas", "Vehículos", "Mobiliario y electrodomésticos", "Utillaje", "Otros bienes" ],
	c3: [ "Traslados y mudanzas", "Servicios de arquitectos, ingenieros y otros profesionales", "Otros servicios de consultorías y asistencias técnicas", "Servicios de limpieza fuera de contrato", "Sevicios de seguridad fuera de contrato", "Otros servicios" ],
	c4: [ "Mobiliario y otro material de oficina no inventariable", "Material informático no inventariable", "Material de docencia", "Material de laboratorio", "Produtos de limpieza", "Vestuario", "Otro material no inventariable", "Licencias anuales de software", "Licencias de software de duración superior al año" ],
	c5: [ "Maquinaria", "Instalaciones técnicas", "Utillaje", "Mobiliario y electrodomésticos", "Edificios y otras construcciones", "Vehículos", "Otros bienes" ],
	c6: [ "Maquinaria", "Utillaje", "Instalaciones técnicas", "Mobiliario y electrodomésticos", "Ordenadores y otros equipos informáticos", "Otros bienes inventariables" ],

	// inventario
	c6s1: [ "Nueva adquisición", "Sustituye a un bien similar dado previamente de baja" ],
	c6s2: [ "Nueva adquisición", "Sustituye a un bien similar dado previamente de baja" ],
	c6s3: [ "Nueva adquisición", "Sustituye a un bien similar dado previamente de baja" ],
	c6s4: [ "Nueva adquisición", "Sustituye a un bien similar dado previamente de baja" ],
	c6s5: [ "Nueva adquisición", "Sustituye a un bien similar dado previamente de baja" ],
	c6s6: [ "Nueva adquisición", "Sustituye a un bien similar dado previamente de baja" ]
}

export default {
	getInfo: (categoria, subcategoria) => INFO["c" + categoria + "s" + subcategoria],
	getSubcategorias: categoria => (DATA["c" + categoria] || DATA.c2),
	getInventario: (categoria, subcategoria) => DATA["c" + categoria + "s" + subcategoria],
	getEconomica: (categoria, subcategoria, inventario) => {
		const prefix = "c" + categoria + "s" + subcategoria; // required part
		return inventario ? ECONOMICAS[prefix + "i" + inventario] : ECONOMICAS[prefix];
	}
}
