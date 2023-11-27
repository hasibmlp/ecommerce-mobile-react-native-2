import { PreVariantSelectionProvider } from "../../contexts/PreVariantSelectionContext"
import VariantSelectionModalContent from "./VariantSelectionModalContent"

export default function VariantSelection({productId, handleClose, context}) {
    return (
        <PreVariantSelectionProvider productId={productId} handleClose={handleClose}>
            <VariantSelectionModalContent
                productId={productId}
                handleClose={handleClose}
                context={context}
            />
        </PreVariantSelectionProvider>
    )
}