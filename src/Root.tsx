import React from 'react';
import {Composition} from 'remotion';
import {Seaside} from './Seaside';
import {SeasideUpgrade} from './SeasideUpgrade';
export const Root=()=> <><Composition id="Seaside" component={Seaside} width={2560} height={1440} fps={30} durationInFrames={1440} defaultProps={{}}/><Composition id="SeasideUpgrade" component={SeasideUpgrade} width={2560} height={1440} fps={30} durationInFrames={1620} defaultProps={{}}/></>;
