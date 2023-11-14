import { createContext, useContext, useState } from 'react'
import {View, Text, SafeAreaView, ScrollView} from 'react-native'
import ActiveFilter from './ActiveFilter'
import LoadingFullScreen from './LoadingFullScreen'
import TabButton from './Buttons/TabButton'
import { SideBarContext } from '../../App'
import CheckList from './Buttons/CheckList'
import LinkList from './LinkList'
import PriceRangeForm from './PriceRangeForm'
import Button from '../buttons/Button'

export const FilterContext = createContext()

export default function SideBar() {
    const {loading} = useContext(SideBarContext)
    return(
        <SafeAreaView className="absolute top-0 left-0 bottom-0 right-0 z-40 bg-white">
            <View className="flex-1">
                <FilterContext.Provider value={{
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
    const {filters} =  useContext(SideBarContext)

    return (
        <View className="flex-1 flex-row">
            <View className="basis-[30%] bg-blue-50 h-full">
                
                <ScrollView className="" showsVerticalScrollIndicator={false} scrollEnabled={false}>
                    {filters.map((filter) => (<TabButton key={filter.id} title={filter.label} handlePress={() => {setActiveButton(filter.label)}} activeButton={activeButton} />))}
                </ScrollView>
            </View>
            <View className=" flex-1">
                <ScrollView>
                    {filters.map(filter => {
                        if(activeButton === filter.label) {
                            if (filter.type === 'LIST') {
                                return filter.values.map(value => {
                                    return (<CheckList key={value.id} option={value} />)
                                })
                            }
                            if (filter.type === 'PRICE_RANGE') return (<PriceRangeForm key={filter.values[0].id} option={filter.values[0]} />)
                        }
                    })}

                </ScrollView>
            </View>
        </View>
    )
}

function Header () {
    const {activeFilters} = useContext(SideBarContext)

    return (
        <View style={{backgroundColor:'#fff', shadowColor:'#000', shadowOffset:{width:0, height:4}, shadowOpacity:0.05, elevation:3}} className={`w-full pt-3 pb-3 justify-center items-center z-10`}>
            <Text className="text-[16px] text-black font-light">Apply Filters</Text>
            {activeFilters.length > 0 && (<ActiveFilter style={{paddingHorizontal: 8, paddingTop: 12}}/>)}
        </View>
    )
}

function Footer () {
    const {setSideBarOpen} = useContext(SideBarContext)
    return (
        <View style={{backgroundColor:'#fff', shadowColor:'#000', shadowOffset:{width:0, height:-4}, shadowOpacity:0.05, elevation:3}} className="w-full items-center py-3">
            <Text className="text-[12px] text-black text-normal">100 results</Text>
            <View className="w-full flex-row justify-between px-3 mt-4">
                <Button type='secondary' label="reset" flex style={{marginRight: 16}}/>
                <Button label="done" flex onPress={() => setSideBarOpen(false)}/> 
            </View>
        </View>
    )
}