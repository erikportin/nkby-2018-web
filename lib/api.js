const locales = require('./data/locales.json');
// Convert Degress to Radians
function Deg2Rad(deg) {
    return deg * Math.PI / 180;
}

function PythagorasEquirectangular(lat1, lon1, lat2, lon2) {

    lat1 = Deg2Rad(lat1);
    lat2 = Deg2Rad(lat2);
    lon1 = Deg2Rad(lon1);
    lon2 = Deg2Rad(lon2);
    let R = 6371; // km
    let x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
    let y = (lat2 - lat1);

    return Math.sqrt(x * x + y * y) * R;
}

function getLocales(){
    return Object.keys(locales)
        .map(key => {
            const {name, position, pages = []} = locales[key];

            return {
                id: key,
                name,
                position,
                numberOfPages: pages.length
            }
        })
}

function getLocale(id){
    return locales[id];
}

module.exports = {
    getLocale: getLocale,
    getLocales: getLocales,

    getLocalesNearby(id, numbersOfResults) {
        const locales = getLocales();
        const locale = getLocale(id);

        if(locale){
            const {position: {lng: currentLocaleLng, lat: currentLocaleLat}} = getLocale(id);

            return locales
                .filter(locale => locale.position && locale.id !== id)
                .map(locale => {
                    const {lng, lat} = locale.position;
                    const dif = PythagorasEquirectangular(currentLocaleLng, currentLocaleLat, lng, lat);

                    return {
                        ...locale,
                        dif
                    }
                })
                .sort((localeA, localeB) => {
                    return localeA.dif - localeB.dif
                })
                .splice(0, numbersOfResults)
        }

        return undefined
    }
};