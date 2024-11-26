
import { raw } from "hono/html";

const css = `table { margin:auto; width: 94%; border-collapse: collapse; }
    thead { border-bottom: solid 1px #000; }
    tfoot { font-weight: bold; border-top: 1px dashed #000; }
    p { margin-top: 10px; padding: 4px; }
    hr { margin: 7px 0px; }

    .tr { text-align: right; }
    .tl { text-align: left; }
    .tc { text-align: center; }
    .tj { text-align: justify; }`;

export const Email = (props: any) => {
    return (
        <html lang="es">
            <head>
                <meta charset="utf-8"/>
                <title>HTML email test</title>
                <style type="text/css">{raw(css)}</style>
            </head>
            <body>
                <header></header>
                <main>
                    <h1>Mail submitted!</h1>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem eum animi molestiae inventore cumque? Illo, corporis vitae! Quia vero ab exercitationem atque totam? Repellat atque commodi rerum placeat fugit porro!</p>
                </main>
                <footer></footer>
            </body>
        </html>
    );
}
