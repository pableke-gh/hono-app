
import { describe, it, test } from "node:test";
import assert from "node:assert";

import app from "./app.js";
import sqlite from "./sqlite.js";

describe("Request example", () => {
    it("GET /test", async () => {
        const res = await app.test();
        assert.equal(res.status, 200);
        assert.equal(await res.text(), "Hello Word!");
    });

    test.skip("GET /email", () => {
        app.email().then(info => {
            assert.ok(info);
            assert.deepEqual(info.rejected, []);
            assert.deepEqual(info.accepted, [ "pableke@gmail.com" ]);
        });
    });
});
describe("Login test", () => {
    it("JWT", () => {
        const name = "pablo Rosique";
        app.jwt({ id: 123, name }).then(user => {
            assert.equal(user.id, 123);
            assert.equal(user.name, name);
        });
    });
});
describe("Util test", () => {
    it("zip", () => {
        const FILES = [ "src/public/files/aeat4.pdf", "src/public/files/aeat5.pdf", "src/public/files/aeat6.pdf", "src/public/files/canon_digital.pdf" ];
        assert.match(app.zip("test.zip", FILES), /test.zip/);
    });
});

describe("Sqlite DB tests", () => {
    it("Filter by data", async () => {
        const menus = await sqlite.filter({ tipo: 1 });
        assert.equal(menus.length, 18);
        const actions = await sqlite.filter({ tipo: 2 });
        assert.equal(actions.length, 2);
    });

    it("Filter menu by term", async () => {
        const menu = await sqlite.getById(2);
        const data = await sqlite.filterMenu("ini");
        assert.equal(menu.nombre, data[0].nombre);
        assert.equal(data[0].nombre, "Inicio");
        assert.equal(menu.tipo, data[0].tipo);
        assert.equal(data.length, 1);
    });

    it("Get all menus", async () => {
        const menus = await sqlite.getMenus();
        assert.equal(menus.length, 18);
        assert.equal(menus[1].nombre, "Private");
    });

    it("Multi insert values", () => {
        sqlite.insertAll().then(changes => {
            assert.equal(changes, 3);
        });
    });

    it("Login", async () => {
        const user = await sqlite.login();
        assert.equal(user.nif, "23024374V");
    });
});
