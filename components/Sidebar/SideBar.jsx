import { createContext, useContext, useState } from 'react'
import {View, Text, TouchableOpacity, SafeAreaView, Pressable, ScrollView} from 'react-native'
import TickIcon from './Icon/TickIcon'
import ActiveFilter from './ActiveFilter'
import LoadingFullScreen from './LoadingFullScreen'
import CheckButton from './Buttons/CheckButton'
import TabButton from './Buttons/TabButton'
import { SideBarContext } from '../../App'

export const FilterContext = createContext()

export default function SideBar() {
    const [activeFilters, setActiveFilters] = useState([])
    const [loading, setLoading] = useState(false)
    return(
        <SafeAreaView className="absolute top-0 left-0 bottom-0 right-0 z-40 bg-white">
            <View className="flex-1">
                <FilterContext.Provider value={{
                    activeFilters,
                    loading,
                    setLoading,
                    setActiveFilters 
                }}>
                    {loading && (<LoadingFullScreen />)}
                    <Header />
                    <Content />
                    <Footer />
                </FilterContext.Provider>
            </View>
        </SafeAreaView>
    )
}

function Content () {
    const [activeButton, setActiveButton] = useState('Category1')

    return (
        <View className="flex-1 flex-row">
            <View className="basis-[30%] bg-blue-50">
                <TabButton title={'Category1'} handlePress={() => {setActiveButton('Category1')}} activeButton={activeButton} />
                <TabButton title={'Category2'} handlePress={() => {setActiveButton('Category2')}} activeButton={activeButton}/>
                <TabButton title={'Category3'} handlePress={() => {setActiveButton('Category3')}} activeButton={activeButton}/>
                <TabButton title={'Category4'} handlePress={() => {setActiveButton('Category4')}} activeButton={activeButton}/>
                <TabButton title={'Category5'} handlePress={() => {setActiveButton('Category5')}} activeButton={activeButton}/>
                <TabButton title={'Category6'} handlePress={() => {setActiveButton('Category6')}} activeButton={activeButton}/>
            </View>
            <View className=" flex-1">
                <ScrollView>
                    {activeButton === 'Category1' && (<CheckButton option={{title: 'Option1', count: 193}} />)}
                    {activeButton === 'Category2' && (<CheckButton option={{title: 'Option2', count: 238}} />)}
                </ScrollView>
            </View>
        </View>
    )
}

function Header () {
    const {activeFilters} = useContext(FilterContext)

    return (
        <View style={{backgroundColor:'#fff', shadowColor:'#000', shadowOffset:{width:0, height:4}, shadowOpacity:0.05, elevation:3}} className={`w-full pt-3 ${activeFilters.length === 0 && 'pb-3'} justify-center items-center z-10`}>
            <Text className="text-[16px] text-black font-light">Apply Filters</Text>
            {activeFilters.length > 0 && (<ActiveFilter/>)}
        </View>
    )
}

function Footer () {
    const {setSideBarOpen} = useContext(SideBarContext)
    return (
        <View style={{backgroundColor:'#fff', shadowColor:'#000', shadowOffset:{width:0, height:-4}, shadowOpacity:0.05, elevation:3}} className="w-full items-center py-3">
            <Text className="text-[12px] text-black text-normal">100 results</Text>
            <View className="w-full flex-row justify-between px-3 mt-4">
                <TouchableOpacity className="w-[48%] h-12 bg-white justify-center rounded-[5px] border border-blue-400">
                    <Text className="text-[14px] text-blue-500 font-semibold text-center uppercase">Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSideBarOpen(false)} className="w-[48%] h-12 bg-blue-400 justify-center rounded-[5px]">
                    <Text className="text-[14px] text-white font-semibold text-center uppercase">Done</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}