import React from 'react';
import {Composition} from 'remotion';
import {Seaside} from './Seaside';
export const Root=()=> <Composition id="Seaside" component={Seaside} width={2560} height={1440} fps={30} durationInFrames={1440} defaultProps={{}}/>;
