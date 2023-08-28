import {FlatList, Text, View} from 'react-native'

export default function Hello () {

    function renderItem() {
        return(
            <View>
                <Image />
                <Text>title</Text>
                <Text>name</Text>
                <Text>price</Text>
                <View>
                    <View className='w-[8px] h-[8px]'></View>
                </View>
            </View>
        )
    }

    return(
        <View className='bg-green-200 flex-1'>
            <Text>Featured</Text>
            <FlatList
            data={proucts}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderItem}
            />
        </View>
    )
}