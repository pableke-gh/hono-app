
import { Alerts, Loading, BackToTop } from "../components/Alerts";
import { User, Langs } from "../components/Dropdowns";
import { ButtonTheme } from "../components/Buttons";
import Menu from "../components/Menu";

export const Head = (props: any) => {
    return (
        <head>
            <meta charset="utf-8"/>
            <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>

            <title>{props.title}</title>
            <link rel="icon" type="image/png" href="/public/img/png/star-yellow.png"></link>
            <link rel="stylesheet" type="text/css" media="screen" href="/public/css/styles-min.css"/>
            <script type="text/javascript" src="https://kit.fontawesome.com/76f12cea70.js" crossorigin="anonymous"></script>
            <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.min.mjs"></script> 
            <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script> 
            <script type="module" src="/public/js/tests.js"></script>
        </head>
    );
}

export const NavPhone = (props: any) => {
    return (
        <nav class="show-xs">
            <button id="menu-toggle">
                <i class="fas fa-arrow-left hide"></i>
                <i class="fas fa-bars"></i>
            </button>
            <button>Phone-Menu 2</button>
            <button>Phone-Menu 3</button>
        </nav>
    );
}

export const Footer = () => {
    return (<footer>Page Footer</footer>);
}

export const Layout = (props: any) => {
    const { lang, title } = props.msgs.getLang();
    return (
        <html lang={lang}>
            <Head title={title}/>
            <body>
                <Alerts {...props.msgs.getMsgs()}/>
                <header></header>
                <NavPhone/>
                <nav class="menu-main">
                    <div><Menu>{props.menu}</Menu></div>
                    <div class="separator"></div>
                    <div class="menu-group">
                        <User user={props.user}/>
                        <Langs/>
                        <ButtonTheme/>
                    </div>
                </nav>
                <main>{props.children}</main>
                <Footer/>
                <Loading/>
                <BackToTop/>
            </body>
        </html>
    );
}
