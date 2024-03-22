// import { getAccessorType, getterTree, mutationTree, actionTree } from 'typed-vuex';

import { off } from 'process';
import * as user from './user';
import { atom } from 'jotai'
export type BoxConfig = {
    totalWidth:number,
	totalHeight:number,
	totalDimension:number,
	offset:number,
	colorMode:number,
	partitionThickness:number,
    mm2pixel:number
}

export const boxConfigAtom = atom<BoxConfig>({
    totalWidth: 100,
    totalHeight: 100,
    totalDimension: 100,
    offset: 3,
    colorMode: 0,
    partitionThickness: 1,
    mm2pixel:0.01
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

//update totalwidth along with length of gridAtoms
export const calculateSizeAction = atom(
    // 同じコンポーネント内でデータも扱うなら一緒にした方がimportを減らせます
    (get) => get(boxConfigAtom),
    // 非同期もOK
    
    async (get, set, pixelSize:number) => {
    const w = get(gridAtoms).reduce((acc, grid) => acc + grid.width + get(boxConfigAtom).offset*2, 0)
      set(boxConfigAtom, {
        ...get(boxConfigAtom),
        totalWidth:w,
        mm2pixel:pixelSize/w
      });
    },
  );