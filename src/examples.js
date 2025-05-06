import { createRoot } from 'react-dom/client';
import { basicSetup } from 'codemirror';
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import {javascript} from "@codemirror/lang-javascript";

const scriptsSources = __EXAMPLES_SOURCES__;
const webpack_mode = __WEBPACK_MODE__;

const scripts = {
    'create_empty_scheduler':  'Create empty scheduler',
    'loading_static_events':   'Loading static events',
    'loading_ajax_events':      'Loading ajax events',
    'drag_and_drop_event':     'Drag and drop event',
    'resize_event':            'Resize event',    
    'using_events_form':       'Managing events',
    'listening_events_change': 'Listening events change',
    'setting_new_event_id':    'Setting id for new event',
    'reverting_events_change': 'Reverting events change',
    'i18n':                    'i18n',
    'custom_default_view':     'Custom default view',
    'custom_initial_date':     'Custom initial date',
}

const url = new URL(window.location.href);
const currentScript = url.searchParams.has ('p') ? 
    url.searchParams.get('p') : 
    Object.keys(scripts)[0];


function Menu()
{   
    
    const urls = {}
    for (const name in scripts) {
        const urlParams = new URLSearchParams( url.searchParams );
        urlParams.set('p', name);
        urls[name] = urlParams;
    }
    
    return (
        <div className="list-group rounded-0">
            { Object.entries(scripts).map(([name, label]) => (
                <a  key={ name }
                    className={ 
                        "list-group-item " + 
                        (currentScript === name ? 'active': '') 
                    }
                    href={ '?' + urls[name] }
                >
                    <span className="ps-2">
                        { label }
                    </span>
                </a>                        
            )) }
        </div>
    );
}

if (webpack_mode !== 'production') {
    // date stub
    if (url.searchParams.has('today')) {
        Date.now = () => new Date(url.searchParams.get('today')).getTime();
    }
}

if (currentScript in scripts) {
    
    var script = document.createElement("script");
    script.src = './examples/' + currentScript + '.js';
    document.body.appendChild(script);
    
}

if (currentScript in scriptsSources) {
    
    const initialState = EditorState.create({
        doc: scriptsSources[currentScript].trim() + "\n",
        extensions: [
            basicSetup, 
            javascript( {jsx: true} ), 
            EditorState.readOnly.of(true)
        ]
    });
    
    const view = new EditorView({
        parent: document.getElementById('source'),
        state: initialState,
    });
    
    window.view = view;
}

createRoot( document.getElementById('menu' ) ).render( <Menu /> );
