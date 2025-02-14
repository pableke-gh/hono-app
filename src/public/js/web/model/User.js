
function User() {
	const self = this; //self instance

    this.validateLogin = (data, valid) => {
        valid.isLogin("login", data.login, "errLogin");
        //valid.isLogin("pass", data.pass, "errPass");
        return valid;
    }
    this.validateProfile = (data, valid) => {
        valid.size200("nombre", data.nombre);
        valid.isEmail("email", data.email);
        return valid;
    }
}

export default new User();
