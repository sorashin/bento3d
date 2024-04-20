// import { getAccessorType, getterTree, mutationTree, actionTree } from 'typed-vuex';

import { View } from '@react-three/drei'
import { atom } from 'jotai'
export type BoxConfig = {
    totalWidth:number,
	totalDepth:number,
	depth:number,
	padding:number,
	colorMode:number,
    viewMode:number,
	partitionThickness:number,
    mm2pixel:number,
    fillet:number
}

export const boxConfigAtom = atom<BoxConfig>({
    totalWidth: 100,
    totalDepth: 100,
    depth: 100,
    padding: 3,
    colorMode: 0,
    viewMode:0,
    partitionThickness: 2,
    mm2pixel:3,
    fillet:2,
})

// boxConfigAtom.totalWidthが更新されたらgridAtomsのwidthを更新し、

export type Grid = {
    index:number,
	label:string,
	width:number,
    depth:number,
	division:number,
}

export const gridAtoms = atom<Grid[]>([
    {
        index: 0,
        label: '',
        width: 100,
        depth:100,
        division: 1
    }
])

export type PhantomSize = {
    width:number,
    height:number,
    depth:number

}
export const phantomSizeAtom = atom<PhantomSize>({
    width: 100,
    height:60,
    depth: 100
})
export const openAIAPIKeyAtom = atom<string>('')
export const selectedColorAtom = atom<string>('')
export const screenModeAtom = atom<number>(0)
export const isDebugAtom = atom<boolean>(false)
export const isDownloadDialogOpenAtom = atom<boolean>(false)
export const cameraModeAtom = atom<number>(0)
// 0:default
// 1:Front View/高さ
// 2:Top View/奥行き

export const stepAtom=atom<number>(0)
//set same value as stepAtom to boxconfig.viewMode when stepAtom changes
// stepAtomの値が変更されたときにboxConfig.viewModeを更新するatom
export const syncViewModeWithStep = atom(
    null, // このatomはgetを使用しません。
    (get, set, update: number) => {
      // stepAtomが更新されるたびにこの関数がトリガーされます。
      const currentBoxConfig = get(boxConfigAtom)
      set(boxConfigAtom, {
        ...currentBoxConfig,
        viewMode: update // stepAtomの最新値でviewModeを更新
      })
    }
  )
  
  // stepAtomが更新されるたびにsyncViewModeWithStepを更新するatom
  export const stepSyncAtom = atom(
    (get) => get(stepAtom),
    (get, set, update: number) => {
      set(stepAtom, update) // stepAtomを更新
      set(syncViewModeWithStep, update) // syncViewModeWithStepをトリガーしてboxConfigAtomを更新
    }
  )

export type ColorPalette = {
    label:string,
    primary:string,
    secondary:string,
}
export const colorPaletteAtom = atom<ColorPalette[]>([
    {
        label: 'しらたま',
        primary: '#F4EFE4',
        secondary: '#B4AFA2'
    },
    {
        label: 'ネイビー',
        primary: '#606D84',
        secondary: '#606D84'
    },
    {
        label: 'テラコッタ',
        primary: '#A06351',
        secondary: '#915646'
    }])

//update totalwidth along with length of gridAtoms
export const calculateSizeAction = atom(
    // 同じコンポーネント内でデータも扱うなら一緒にした方がimportを減らせます
    (get) => get(boxConfigAtom),
    // 非同期もOK
    
    async (get, set, pixelSize:number) => {
    
    const sumOfWidth = get(gridAtoms).reduce((acc, grid) => acc + grid.width, 0)
    const w = sumOfWidth + get(boxConfigAtom).partitionThickness*(get(gridAtoms).length +1);
    //get the max value from gridAtoms.height
    const d = Math.max(...get(gridAtoms).map(grid=>grid.depth));
      set(boxConfigAtom, {
        ...get(boxConfigAtom),
        totalWidth:w,
        totalDepth:d,
        mm2pixel:pixelSize/w
        
      });
    },
  );
  