import VariantSelectionModalContent from "./VariantSelectionModalContent"

export default function VariantSelection({productId, handleClose, context}) {
    return (
            <VariantSelectionModalContent
                productId={productId}
                handleClose={handleClose}
                context={context}
            />
    )
}