import { Text, View } from "react-native"
import { layoutToComponent } from "../../data/constants"

export default function ComponentMapper({content}) {
    if (!content || !content.layout) return null

    const Component = layoutToComponent[content.layout]
    if (!Component) return null
    return <Component content={content}/>
}