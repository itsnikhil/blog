import {entries} from '../lib/content.js';
import {GET as feed} from './[...feed].xml.js';
export function GET(){return feed({props:{feed:'index',title:'ItsNikhil',entries}});}
