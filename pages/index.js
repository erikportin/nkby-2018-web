import React from "react"
import Map from '../components/map';
import LocalesList from '../components/locales-list';
import { getLocales } from '../utils/api'
import store from '../utils/store'
import Head from 'next/head'

const MAP_HEIGHT = 500;

class App extends React.PureComponent {

    onZoomChanged(zoom){
        store.set('zoom', zoom)
    }

    onDragEnd(position){
        store.set('position', position)
    }

    render() {
        const { locales } = this.props;
        const visitedLocales = store.get('visited-locales') || [];
        const zoom = store.get('zoom');
        const position = store.get('position');

        return (
            <>
                <style jsx="true">{`
                      .js .index{
                        padding-top: ${MAP_HEIGHT}px;
                      }
                    `}</style>
                <div className="index">
                    <Head>
                        <title>Start | NKBY</title>
                    </Head>
                    <div className="index--map-wrapper" style={{
                        height: MAP_HEIGHT
                    }}>
                        <Map
                            locales={locales}
                            visitedLocales={visitedLocales}
                            zoom={zoom}
                            position={position}
                            style={{height: `${MAP_HEIGHT}px`}}
                            onDragEnd={this.onDragEnd}
                            onZoomChanged={this.onZoomChanged}
                        />
                    </div>
                    <div className="index--content">
                        <LocalesList locales={locales} withABCNav={true}  />
                    </div>
                </div>
            </>
        )
    }
}

App.getInitialProps = async function (context) {
    const {req = {}} = context;
    const {headers = {}} = req;
    const locales = await getLocales(headers.host);

    return { locales, skipToContentCopy: 'Gå till lista med gatunamn' }
};

export default App