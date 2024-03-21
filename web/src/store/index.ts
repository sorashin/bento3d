// import { getAccessorType, getterTree, mutationTree, actionTree } from 'typed-vuex';

import * as user from './user';
import { atom } from 'jotai'
export type BoxConfig = {
    totalWidth:number,
	totalHeight:number,
	totalDimension:number,
	offset:number,
	colorMode:number,
	partitionThickness:number
}

export const boxConfigAtom = atom<BoxConfig>({
    totalWidth: 100,
    totalHeight: 100,
    totalDimension: 100,
    offset: 3,
    colorMode: 0,
    partitionThickness: 1
})

export type Grid = {
    index:number,
	label:string,
	width:number,
	height:number,
	grid:number,
}

export const gridAtoms = atom<Grid[]>([
    {
        index: 0,
        label: '',
        width: 100,
        height: 100,
        grid: 1
    }
])

export const openAIAPIKeyAtom = atom<string>('')
export const selectedColorAtom = atom<string>('')