import {loadFont} from '@remotion/fonts';
import {cancelRender,continueRender,delayRender,staticFile} from 'remotion';
const handle=delayRender('Load project-local Chinese fonts');
Promise.all([
 loadFont({family:'SeasideSans',url:staticFile('fonts/sans-sc.woff'),weight:'400'}),
 loadFont({family:'SeasideSerif',url:staticFile('fonts/serif-sc.woff'),weight:'400'}),
]).then(()=>continueRender(handle)).catch(cancelRender);
