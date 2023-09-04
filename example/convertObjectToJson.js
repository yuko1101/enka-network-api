// sometimes you need to convert object to json for such as sending data to server or saving data to file.
// but you can't convert object to json with JSON.stringify() since the object has circular object. (e.g. enka.cachedAssetsManager.enka...)
// and maybe you want TextAssets to be converted to string.
// so here is a function to convert object to json.

const { EnkaClient, TextAssets, DynamicTextAssets } = require("enka-network-api");

function convertObjectToJson(obj) {
    if (typeof obj !== "object" || obj === null || obj === undefined) return obj;
    const entries = Object.entries(obj)
        .filter(([key, value]) => !key.startsWith("_") && !(value instanceof EnkaClient)) // filter out private properties and EnkaClient instance, which has circular object
        .map(([key, value]) => [key, convertObjectToJson(value)]);
    if (obj instanceof TextAssets) {
        entries.push(["text", obj instanceof DynamicTextAssets ? obj.getNullableReplacedText() : obj.getNullable()]); // convert TextAssets to string
    }
    return Object.fromEntries(entries);
}


// usage example:

(async () => {

    const enka = new EnkaClient();

    const user = await enka.fetchUser(825436941);

    const jsonUser = convertObjectToJson(user);
    console.log(jsonUser);


    const ayaka = enka.getCharacterById(10000002);

    const jsonAyaka = convertObjectToJson(ayaka);
    console.log(jsonAyaka);

})();