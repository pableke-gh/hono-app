
import sqlite from "app/dao/sqlite/factory.js";

const MENUS = [
    { tipo: 1, enlace: "#1", nombre: "nombre 1", titulo: "titulo 1", orden: 21, mask: 1 },
    { tipo: 1, enlace: "#2", nombre: "nombre 2", titulo: "titulo 2", orden: 22, mask: 1 },
    { tipo: 1, enlace: "#3", nombre: "nombre 3", titulo: "titulo 3", orden: 23, mask: 1 }
];

sqlite.open();
export default {
    // Menus
    getById: id => sqlite.menus.getById(id),
    filter: data => sqlite.menus.filter(data),
    filterMenu: term => sqlite.menus.filterByTerm(1, term),
    getMenus: () => sqlite.menus.getMenus(1, "en"),
    insertAll: () => sqlite.menus.insertAll(MENUS).then(sqlite.menus.deleteTest),

    // Users
    login: () => sqlite.usuarios.login("pableke@gmail.com", "123456")
}
