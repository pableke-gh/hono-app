
import coll from "#client/components/Collection.js";

export default function(db) {
	const self = this; //self instance

    this.filter = data => {
        const sql = "select * from v_menu_padre where (? is null or tipo = ?) and (? is null or nombre like ?)";
        return db.list(sql, [data.tipo, data.tipo, data.nombre, data.nombre + "%"]);
    }
    this.filterByTerm = (tipo, term) => {
        const sql = "select * from v_menu_padre where (tipo = ?) and (nombre like ?)";
        return db.list(sql, [ tipo, "%" + term + "%" ]); // like is case insensitive
    }

    this.getById = id => db.find("select * from v_menu_padre where id = ?", id);
    this.getActions = user => db.list("select * from v_actions where usuario_id = ?", user);
    this.getMenus = (user, lang) => db.list(`select * from v_menus_${lang} where (tipo = 1) and usuario_id is null or usuario_id = ?`, user);
    this.getPublic = lang => db.list(`select * from v_menus_${lang} where (tipo = 1) and ((mask & 1) = 1)`);

    this.insert = data => {
        const sql = "insert into menus (tipo, padre, icono, nombre, titulo, enlace, orden, mask) values (?, ?, ?, ?, ?, ?, ?, ?)";
        const params = [data.tipo, data.padre, data.icono, data.nombre, data.titulo, data.enlace, data.orden, data.mask];
        return db.insert(sql, params).then(lastID => { data.id = lastID; return data; });
    }
    this.insertAll = data => {
        const params = []; // values container
        const sql = "insert into menus (tipo, padre, icono, nombre, titulo, enlace, orden, mask) values ";
        const values = data.map(row => {
            params.push(row.tipo, row.padre, row.icono, row.nombre, row.titulo, row.enlace, row.orden, row.mask);
            return "(?, ?, ?, ?, ?, ?, ?, ?)";
        }).join(",");
        return db.insert(sql + values, params).then(lastID => {
            return coll.eachPrev(data, (row, i, j) => { row.id = lastID - j; });
        });
    }
    this.update = data => {
        const sql = "update menus set tipo = ?, padre = ?, icono = ?, nombre = ?, titulo = ?, enlace = ?, orden = ?, mask = ? where id = ?";
        const params = [data.tipo, data.padre, data.icono, data.nombre, data.titulo, data.enlace, data.orden, data.mask, data.id];
        return db.update(sql, params);
    }
    this.save = data => data.id ? self.update(data) : self.insert(data);
    this.delete = id => db.delete("delete from menus where id = ?", id);
    this.deleteTest = () => db.delete("delete from menus where id > 20");
}
