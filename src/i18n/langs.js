
import en from "./en.js";
import es from "./es.js";
// referencia local a i18n en la parte publica (cliente)
import i18n from "#client/i18n/langs.js";

// ¡¡Importante!!
// usar siempre la referencia: #client/i18n/langs.js en el servidor
// para evitar crear mas de una instancia del modulo
// usar la referncia local: ./i18n/langs.js en el cliente
i18n.addLang("en", en).addLang("es", es);

// Server redefinitions
i18n.confirm = () => true;
i18n.getNavLang = i18n.getDefault;

// Server language container
export default i18n;
