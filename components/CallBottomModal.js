import BottomModal from "./BottomModal";
import Overlay from "./Overlay";

export default function CallBottomModal({
  state,
  setState,
  productId,
  handleAddCartBtn,
  selectedOption,
  setSelectedOption,
  selectedVariant,
  setSelectedVariant,
}) {

  return (
    <>
      <Overlay state={state} setState={setState} />
      <BottomModal
        state={state}
        setState={setState}
        productId={productId}
        handleAddCartBtn={handleAddCartBtn}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        selectedVariant={selectedVariant}
        setSelectedVariant={setSelectedVariant}
      />
    </>
  );
}
