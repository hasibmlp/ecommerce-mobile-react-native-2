export default function BottomModalSkeleton () {
    return (
        <View>
            <View className="mb-5">
                <Skeleton width={100} height={20} />
            </View>

            <View className="flex-row w-full mb-5">
                <Skeleton
                width={100}
                height={150}
                style={{ marginRight: 12, borderRadius: 5 }}
                />
                <Skeleton
                width={100}
                height={150}
                style={{ marginRight: 12, borderRadius: 5 }}
                />
                <Skeleton
                width={100}
                height={150}
                style={{ marginRight: 12, borderRadius: 5 }}
                />
                <Skeleton
                width={100}
                height={150}
                style={{ marginRight: 12, borderRadius: 5 }}
                />
            </View>

            <View className="w-full flex-row justify-between mb-5">
                <Skeleton width={100} height={20} />
                <Skeleton width={100} height={20} />
            </View>

            <View className="flex-row w-full">
                <Skeleton
                width={60}
                height={50}
                style={{ marginRight: 12, borderRadius: 5 }}
                />
                <Skeleton
                width={60}
                height={50}
                style={{ marginRight: 12, borderRadius: 5 }}
                />
                <Skeleton
                width={60}
                height={50}
                style={{ marginRight: 12, borderRadius: 5 }}
                />
                <Skeleton
                width={60}
                height={50}
                style={{ marginRight: 12, borderRadius: 5 }}
                />
                <Skeleton
                width={60}
                height={50}
                style={{ marginRight: 12, borderRadius: 5 }}
                />
                <Skeleton
                width={60}
                height={50}
                style={{ marginRight: 12, borderRadius: 5 }}
                />
            </View>
        </View>
    )
}