
import bcrypt from "bcrypt";
import { LoginError } from "../../public/js/i18n/errors.js";

const fnError = err => {
    if (err.errno == 19) //UK violated
        err.message = "Users previously registered in the system";
    throw err;
}

export default function(db) {
	const self = this; //self instance

    this.all = () => db.list("select * from usuarios order by nif desc limit 10", []);
    this.filter = data => {
        const sql = "select * from usuarios where (? is null or nif like ?) and (? is null or email like ?)";
        //const sql2 = "select * from usuarios where nif like :nif and email like :email"; //no named parameters
        return db.list(sql, [data.nif, data.nif + "%", data.email, data.email + "%"]);
    }

    this.getById = id => db.find("select * from usuarios where id = ?", id);
    this.getByLogin = login => {
        const sql = "select * from usuarios where nif = ? or email = ?";
        return db.find(sql, [login.toUpperCase(), login.toLowerCase()]);
    }
    this.login = (login, pass) => {
        return this.getByLogin(login).then(user => {
            if (!user)
                throw new LoginError("login", "errLogin");
            if (bcrypt.compareSync(pass, user.clave))
                return user;
            throw new LoginError("pass", "errPass");
        });
    }

    this.insert = data => {
        const sql = "insert into usuarios (nif, nombre, apellido1, apellido2, email, logo, clave) values (?, ?, ?, ?, ?, ?, ?)";
        const params = [data.nif.toUpperCase(), data.nombre, data.apellido1, data.apellido2, data.email.toLowerCase(), logo, bcrypt.hashSync(data.clave, 10)];
        return db.insert(sql, params).then(lastID => { data.id = lastID; return data; });
    }
    this.update = data => {
        const sql = "update usuarios set nif = ?, nombre = ?, apellido1 = ?, apellido2 = ?, email = ?, logo = ?, activado = ? where id = ?";
        const params = [data.nif, data.nombre, data.apellido1, data.apellido2, data.email, data.logo, data.activado, data.id];
        return db.update(sql, params).catch(fnError);
    }
    this.activate = user => { //ej: select datetime('2023-06-07T12:00:25.0Z') -> select strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
        const sql = "update usuarios set activado = datetime('now') where id = ?";
        return db.update(sql, user).catch(fnError);
    }
    this.updatePassword = (user, pass) => {
        const sql = "update usuarios set clave = ? where id = ?";
        const params = [bcrypt.hashSync(pass, 10), user]; // user = id
        return db.update(sql, params).catch(fnError);
    }
    this.save = data => data.id ? self.update(data) : self.insert(data);
    this.delete = id => db.delete("delete from usuarios where id = ?", id);
}
