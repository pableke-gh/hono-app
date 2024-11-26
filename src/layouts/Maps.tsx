
import { Layout } from "./Main";
import { Tab } from "../components/Tabs";
import { Autocomplete } from "../components/Inputs";

export const MapsTab0 = () => {
    return (
        <Tab id="tab-0" active={true} title="GOOGLE MAPS API">
            <div class="ui-blocks">
                <Autocomplete name="origen" required={true} label="Origen de la ruta" tabindex="1" placeholder="Search a place"/>
            </div>

            <div class="address-components hide">
                <h2>Address Components:</h2>
                <ul>
                    <li><b>Dirección (route):</b> @dir;</li>
                    <li><b>Localidad (locality):</b> @localidad;</li>
                    <li><b>Código Postal (postal_code):</b> @cp;</li>
                    <li><b>Provincia (administrative_area_level_2):</b> @provincia;</li>
                    <li><b>Comunidad Autonoma (administrative_area_level_1):</b> @ccaa;</li>
                    <li><b>País (country):</b> @pais;</li>
                </ul>
            </div>

            <hr/>
            <div class="dieta hide">
                <h2>Dietas:</h2>
                <ul>
                    <li><b>País / Ciudad:</b> @name;</li>
                    <li><b>Alojamiento 1:</b> @a1; €</li>
                    <li><b>Alojamiento 2:</b> @a2; €</li>
                    <li><b>Manutención 1:</b> @m1; €</li>
                    <li><b>Manutención 2:</b> @m2; €</li>
                </ul>
            </div>
            <script id="maps-js" type="module" src="/public/js/modules/xeco/iris/tests.js"></script>
        </Tab>
    );
}

export const Maps = (props: any) => {
    return (<Layout><MapsTab0/></Layout>);
}
