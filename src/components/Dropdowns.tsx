
import util from "../lib/util.js";

const UserIcon = <i class="fas fa-user"></i>;

export const UserPublic = (props: any) => {
    return (
        <div id="user" class="dropdown">
            <button>{UserIcon}</button>
            <div>
                <a href="/" class="load-main">Home</a>
                <a href="/signup" class="load-main">Sign Up</a>
                <hr class="slim"/>
                <a href="/login" class="load-main">Login</a>
            </div>
        </div>
    );
}
export const UserLogged = (props: any) => {
    const { logo, email } = props.user;
    const logoHtml = logo ? <img src={util.getUrlThumb(logo)} alt="Avatar"/> : UserIcon;
    return (
        <div id="user" class="dropdown">
            <button>{logoHtml}</button>
            <div>
                <a href="/admin/profile" class="load-main">{email}</a>
                <a href="/" class="load-main">Home</a>
                <hr class="slim"/>
                <a href="/logout">Logout</a>
            </div>
        </div>
    );
}
export const User = (props: any) => {
    return ( props.user ? <UserLogged user={props.user}/> : <UserPublic/> );
}

export const Langs = (props: any) => {
    return (
        <div id="languages" class="dropdown">
            <button>
                <img src="/public/img/flags/spain.png"/>
                <i class="fas fa-chevron-down"></i>
            </button>
            <div>
                <a id="es" href="/es/lang"><img src="/public/img/flags/spain.png"/> ES</a>
                <a id="en" href="/en/lang"><img src="/public/img/flags/great_britain.png"/> EN</a>
            </div>
        </div>
    );
}
